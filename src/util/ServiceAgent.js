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
    const proxy = this.createProxy();
    return proxy.get(endpoint, params, context, headers);
  }

  static post(endpoint, params, context, headers) {
    const proxy = this.createProxy();
    return proxy.post(endpoint, params, context, headers);
  }

  static put(endpoint, params, context, headers) {
    const proxy = this.createProxy();
    return proxy.put(endpoint, params, context, headers);
  }

  static patch(endpoint, params, context, headers) {
    const proxy = this.createProxy();
    return proxy.patch(endpoint, params, context, headers);
  }

  static delete(endpoint, params, context, headers) {
    const proxy = this.createProxy();
    return proxy.delete(endpoint, params, context, headers);
  }

  static options(endpoint, params, context, headers) {
    const proxy = this.createProxy();
    return proxy.options(endpoint, params, context, headers);
  }

  static head(endpoint, params, context, headers) {
    const proxy = this.createProxy();
    return proxy.head(endpoint, params, context, headers);
  }

  static download(endpoint, params, context, headers) {
    const proxy = this.createProxy();
    return proxy.download(endpoint, params, context, headers);
  }
}

export default ServiceAgent;
