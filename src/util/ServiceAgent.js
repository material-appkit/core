import ServiceProxy from './ajax/ServiceProxy';

class ServiceAgent {
  static ServiceProxyClass = ServiceProxy;

  static initialize(options) {
    if (options.ServiceProxyClass) {
      this.ServiceProxyClass = options.ServiceProxyClass;
    }
  }

  static createProxy() {
    return new this.ServiceProxyClass();
  }

  static request(method, endpoint, params, context, headers) {
    const proxy = this.createProxy();
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
    const proxy = this.createProxy();
    return proxy.download(endpoint, params, context, headers);
  }

  static upload(endpoint, files, headers) {
    const proxy = this.createProxy();
    return proxy.upload(endpoint, files, headers);
  }
}

export default ServiceAgent;
