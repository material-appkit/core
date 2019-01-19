import { diff } from 'deep-object-diff';

import { decorate, observable } from 'mobx';
import { ServiceAgent } from '../util';

import DataStore from './DataStore';

class RemoteStore extends DataStore {
  constructor(options) {
    super();

    this.isLoading = false;
    this.pageCount = null;
    this.params = null;
    this.requestContext = null;

    this.options = options || {};
    this._endpoint = this.options.endpoint;
  }

  get endpoint() {
    if (this._endpoint) {
      return this._endpoint;
    }

    throw new Error('Store must specify its endpoint!');
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
  async _load(page) {
    const searchParams = { page, ...this.params };

    this.isLoading = true;

    if (this.requestContext) {
      // Abort the currently in-flight request, if any
      this.requestContext.request.abort();
    }

    this.requestContext = {};
    const req = ServiceAgent.get(this.endpoint, searchParams, this.requestContext);
    req.then((res) => {
      this.requestContext = null;

      const responseData = res.body;
      const loadedItems = this._transformResponseData(responseData);

      // Initialize the list of pages now that we know how many there are.
      if (!this.items) {
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

  async load(params, page) {
    this.unload();

    this.params = params || {};
    return this._load(page || 1);
  }

  async loadMore(page) {
    return this._load(page);
  }

  async update(params) {
    if (!params) {
      return;
    }

    const paramDiff = diff(params, this.params);
    if (!Object.keys(paramDiff).length) {
      return;
    }

    this.load(params);
  }


  unload() {
    this.params = null;
    this.items = null;
    this.totalLength = null;
    this.pageCount = null;
  }
}

decorate(RemoteStore, {
  isLoading: observable,
});

export default RemoteStore;
