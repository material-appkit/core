import ServiceProxy from './ajax/ServiceProxy';

class ServiceAgent {
  static ServiceProxyClass = ServiceProxy;

  static initialize(options) {
    if (options.ServiceProxyClass) {
      this.ServiceProxyClass = options.ServiceProxyClass;
    }
  }

  static request(method, endpoint, params, context, headers) {
    const proxy = new this.ServiceProxyClass();
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
}

export default ServiceAgent;
