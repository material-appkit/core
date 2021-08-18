import NativeServiceProxy from './ajax/NativeServiceProxy';

/**
 * General description about the ServiceAgent class
 */
class ServiceAgent {
  static ServiceProxyClass = NativeServiceProxy;
  static config;

  /**
   *
   * @param {Object} config
   */
  static initialize(config) {
    this.config = config || {};

    if (this.config.ServiceProxyClass) {
      this.ServiceProxyClass = this.config.ServiceProxyClass;
    }
  }


  /**
   *
   * @returns {NativeServiceProxy}
   * @private
   */
  static _createProxy() {
    return new this.ServiceProxyClass();
  }


  /**
   *
   * @param requestContext
   */
  static abortRequest(requestContext) {
    if (requestContext && requestContext.abortController) {
      requestContext.abortController.abort();
    }
  }

  /**
   *
   * @param {String} method
   * @param args
   * @returns {Promise}
   */
  static request(method, ...args) {
    const proxy = this._createProxy();
    return proxy.request(method, ...args);
  }

  static get(...args) {
    return this.request('GET', ...args);
  }

  static post(...args) {
    return this.request('POST', ...args);
  }

  static put(...args) {
    return this.request('PUT', ...args);
  }

  static patch(...args) {
    return this.request('PATCH', ...args);
  }

  static delete(...args) {
    return this.request('DELETE', ...args);
  }

  static options(...args) {
    return this.request('OPTIONS', ...args);
  }

  static head(...args) {
    return this.request('HEAD', ...args);
  }

  static download(...args) {
    const proxy = this._createProxy();
    return proxy.download(...args);
  }

  static upload(...args) {
    const proxy = this._createProxy();
    return proxy.upload(...args);
  }
}

export default ServiceAgent;
