import { diff } from 'deep-object-diff';

import { decorate, observable } from 'mobx';
import { ServiceAgent } from '../util';
import { filterEmptyValues } from '../util/object';

import DataStore from './DataStore';

class RemoteStore extends DataStore {
  constructor(options) {
    super();

    this.isLoading = false;
    this.pageCount = null;
    this.params = null;
    this.requestContext = null;
    this.ServiceAgent = options.ServiceAgent || ServiceAgent;

    this.options = options || {};
    this._endpoint = this.options.endpoint;

    // List of objects to receive callback when data is loaded
    this.subscribers = [];
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

    this.params = filterEmptyValues(params);
    return this._load(page || 1, true);
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
      const paramDiff = diff(updatedParams, this.params);
      if (!Object.keys(paramDiff).length) {
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
  }

  subscribe(callback) {
    const self = this;

    this.subscribers.push(callback);

    return function() {
      const index = self.subscribers.indexOf(callback);
      if (index === -1) {
        throw new Error('Could not locate callback index!');
      }
      self.subscribers.splice(1, index);
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

    if (this.requestContext) {
      // Abort the currently in-flight request, if any
      this.requestContext.request.abort();
    }

    this.requestContext = {};
    const req = this.ServiceAgent.get(this.endpoint, searchParams, this.requestContext);
    req.then((res) => {
      this.requestContext = null;

      const responseData = res.body;

      // Notify subscribers
      this.subscribers.forEach((callback) => {
        callback(responseData, 'load`');
      });

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

      return responseData;
    }).catch((err) => {
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
