export default class AbstractServiceProxy {
  static getRequestHeaders(headers, params) {
    const requestHeaders = {};

    if (headers) {
      Object.assign(requestHeaders, headers);
    }

    return requestHeaders;
  }


  static buildRequestUrl(endpoint) {
    let endpointInfo = endpoint;

    if (typeof(endpointInfo) === 'string') {
      // If this is already an absolute URL, leave it as is.
      if (endpointInfo.startsWith('http')) {
        return endpointInfo;
      }

      endpointInfo = {
        url: this.getBaseURL(),
        path: endpointInfo,
      }
    }

    // Construct the AJAX request with the given params
    let requestURL = endpointInfo.url;
    if (!endpointInfo.path.startsWith('/')) {
      requestURL += this.getBaseURLPrefix();
    }
    requestURL += endpointInfo.path;

    return requestURL;
  }


  request(method, endpoint, params, context, headers) {
    throw new Error('Subclass Responsibility');
  }

    get(endpoint, params, context, headers) {
    return this.request('GET', endpoint, params, context, headers);
  }

  post(endpoint, params, context, headers) {
    return this.request('POST', endpoint, params, context, headers);
  }

  put(endpoint, params, context, headers) {
    return this.request('PUT', endpoint, params, context, headers);
  }

  patch(endpoint, params, context, headers) {
    return this.request('PATCH', endpoint, params, context, headers);
  }

  delete(endpoint, params, context, headers) {
    return this.request('DELETE', endpoint, params, context, headers);
  }

  options(endpoint, params, context, headers) {
    return this.request('OPTIONS', endpoint, params, context, headers);
  }

  head(endpoint, params, context, headers) {
    return this.request('HEAD', endpoint, params, context, headers);
  }
}
