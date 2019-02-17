import ServiceProxy from './ajax/ServiceProxy';

class ServiceAgent {
  static ServiceProxyClass = ServiceProxy;

  static initialize(options) {
    if (options.ServiceProxyClass) {
      this.ServiceProxyClass = options.ServiceProxyClass;
    }
  }

  static request(method, endpoint, params, context) {
    const proxy = new this.ServiceProxyClass();
    return proxy.request(method, endpoint, params, context);
  }

  static get(endpoint, params, context) {
    return this.request('GET', endpoint, params, context);
  }

  static post(endpoint, params, context) {
    return this.request('POST', endpoint, params, context);
  }

  static put(endpoint, params, context) {
    return this.request('PUT', endpoint, params, context);
  }

  static patch(endpoint, params, context) {
    return this.request('PATCH', endpoint, params, context);
  }

  static delete(endpoint, params, context) {
    return this.request('DELETE', endpoint, params, context);
  }

  static options(endpoint, params, context) {
    return this.request('OPTIONS', endpoint, params, context);
  }

  static head(endpoint, params, context) {
    return this.request('HEAD', endpoint, params, context);
  }
}

export default ServiceAgent;
