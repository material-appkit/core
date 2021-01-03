import NativeServiceProxy from './ajax/NativeServiceProxy';

class ServiceAgent {
  static ServiceProxyClass = NativeServiceProxy;
  static config;

  /**
   *
   * @param {object} config
   */
  static initialize(config) {
    this.config = config || {};

    if (this.config.ServiceProxyClass) {
      this.ServiceProxyClass = this.config.ServiceProxyClass;
    }
  }

  static _createProxy() {
    return new this.ServiceProxyClass();
  }

  /**
   *
   * @param {string} method
   * @param {string} endpoint
   * @param {object} params
   * @param {object} context
   * @param {object} headers
   * @returns {Promise}
   */
  static request(method, endpoint, params, context, headers) {
    const proxy = this._createProxy();
    return proxy.request(method, endpoint, params, context, headers);
  }

  static get(endpoint, params, context, headers) {
    return this.request('GET', endpoint, params, context, headers);
  }

  static post(endpoint, params, context, headers) {
    return this.request('POST', endpoint, params, context, headers);
  }

  static put(endpoint, params, context, headers) {
    return this.request('PUT', endpoint, params, context, headers);
  }

  static patch(endpoint, params, context, headers) {
    return this.request('PATCH', endpoint, params, context, headers);
  }

  static delete(endpoint, params, context, headers) {
    return this.request('DELETE', endpoint, params, context, headers);
  }

  static options(endpoint, params, context, headers) {
    return this.request('OPTIONS', endpoint, params, context, headers);
  }

  static head(endpoint, params, context, headers) {
    return this.request('HEAD', endpoint, params, context, headers);
  }

  static download(endpoint, params, context, headers) {
    const proxy = this._createProxy();
    return proxy.download(endpoint, params, context, headers);
  }

  static upload(endpoint, files, params, context, headers) {
    const proxy = this._createProxy();
    return proxy.upload(endpoint, files, params, context, headers);
  }
}

export default ServiceAgent;
