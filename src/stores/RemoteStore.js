import isEqual from 'lodash.isequal';

import { decorate, observable } from 'mobx';
import { ServiceAgent } from '../util';
import { filterEmptyValues } from '../util/object';
import NotificationManager from '../managers/NotificationManager';
import DataStore from './DataStore';

export const LOAD_WILL_BEGIN_NOTIFICATION_NAME = 'RemoteStore.loadWillBegin';
export const LOAD_DID_COMPLETE_NOTIFICATION_NAME = 'RemoteStore.loadDidComplete';
export const LOAD_DID_FAIL_NOTIFICATION_NAME = 'RemoteStore.loadDidFail';

class RemoteStore extends DataStore {
  constructor(options) {
    super();

    this.isLoading = false;
    this.pageCount = null;
    this.params = null;
    this.requestContext = null;

    this.options = options || {};
    this._endpoint = this.options.endpoint;
    this._notificationCenter = this.options.notificationCenter || NotificationManager.defaultCenter;

    // List of objects to receive callback when data is loaded
    this.listeners = new Map();

    this.addListener = this.addListener.bind(this);
    this.removeListener = this.removeListener.bind(this);
    this.emit = this.emit.bind(this);
  }

  get endpoint() {
    if (this._endpoint) {
      return this._endpoint;
    }

    throw new Error('Store must specify its endpoint!');
  }

  async load(params, page) {
    if (!params) {
      return;
    }

    this.unload();

    this.params = filterEmptyValues(params);
    return this._load(page || 1, true);
  }

  async reload() {
    const params = {...this.params};
    this.unload();
    this.load(params);
  }

  async loadMore(page) {
    return this._load(page, false);
  }

  async update(params) {
    if (!params) {
      return;
    }

    let updatedParams = null;
    if (this.params) {
      updatedParams = filterEmptyValues(params);
      if (isEqual(updatedParams, this.params)) {
        return;
      }
    } else {
      updatedParams = params;
    }

    this.load(updatedParams);
  }


  unload() {
    this.params = null;
    this.items = null;
    this.totalLength = null;
    this.pageCount = null;

    if (this.requestContext) {
      // Abort the currently in-flight request, if any
      this.requestContext.request.abort();
    }
    this.requestContext = null;
    this.emit('unload');
  }

  addListener(eventName, callback) {
    this.listeners.has(eventName) || this.listeners.set(eventName, []);
    this.listeners.get(eventName).push(callback);
  }

  removeListener(eventName, callback) {
    let listeners = this.listeners.get(eventName);
    let index = null;

    if (listeners && listeners.length) {
      index = listeners.reduce((i, listener, index) => (
        ((typeof(listener) === 'function') && listener === callback) ? i = index : i
      ), -1);

      if (index !== -1) {
        listeners.splice(index, 1);
        this.listeners.set(eventName, listeners);
        return true;
      }
    }
    return false;
  }

  emit(eventName, param) {
    const listeners = this.listeners.get(eventName);
    if (listeners) {
      listeners.forEach((listener) => {
        listener(param);
      });
    }
  }

  _getPageCount(responseData) {
    if (responseData.count === 0) {
      return 0;
    }
    return Math.ceil(responseData.count / 50);
  }

  _getTotalLength(responseData) {
    return responseData.count;
  }

  /**
   * Typically the response body is a JSON array of records.
   * Can be overridden by subclasses to handle response bodies of different form.
   */
  _transformResponseData(responseData) {
    return responseData.results;
  }

  /**
   * Load records for the given page. Upon completion, store them
   * in their respective index in the _pages array.
   */
  async _load(page, replace) {
    const searchParams = { page, ...this.params };

    this.isLoading = true;

    if (this.options.onLoadStart) {
      this.options.onLoadStart(searchParams);
    }

    this._notificationCenter.postNotification(LOAD_WILL_BEGIN_NOTIFICATION_NAME, this);
    this.emit('loadWillBegin');

    const req = ServiceAgent.get(this.endpoint, searchParams, this.requestContext);
    req.then((res) => {
      this.requestContext = null;

      // If no response data is available (ex: due to the request having been
      // aborted, unload the store.
      if (res === null) {
        this.unload();
        return null;
      }

      const responseData = res.body;

      // Notify listeners
      this._notificationCenter.postNotification(LOAD_DID_COMPLETE_NOTIFICATION_NAME, this, { res });
      this.emit('loadDidComplete', responseData);

      const loadedItems = this._transformResponseData(responseData);

      // Initialize the list of pages now that we know how many there are.
      if (replace) {
        this.totalLength = this._getTotalLength(responseData);
        this.pageCount = this._getPageCount(responseData);
        this.items = loadedItems;
      } else {
        this.items = this.items.concat(loadedItems);
      }

      this.isLoading = false;

      if (this.options.onLoadComplete) {
        this.options.onLoadComplete(responseData);
      }

      return responseData;
    }).catch((err) => {
      this._notificationCenter.postNotification(LOAD_DID_FAIL_NOTIFICATION_NAME, this, { err });
      this.emit('RemoteStore.loadDidFail', err);

      if (err.code !== 'ABORTED') {
        throw err;
      }
    });
  }
}

decorate(RemoteStore, {
  isLoading: observable,
});

export default RemoteStore;
