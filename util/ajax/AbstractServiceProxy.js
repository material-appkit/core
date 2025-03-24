/**
 *
 */
export default class AbstractServiceProxy {
  /**
   *
   * @static
   * @param headers
   * @param params
   * @returns {{}}
   */
  static getRequestHeaders(headers, params) {
    const requestHeaders = {};

    if (headers) {
      Object.assign(requestHeaders, headers);
    }

    return requestHeaders;
  }


  /**
   *
   * @static
   * @param endpoint
   * @returns {*}
   */
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


  /**
   *
   * @param method
   * @param endpoint
   * @param params
   * @param context
   * @param headers
   */
  request(method, endpoint, params, context, headers) {
    throw new Error('Subclass Responsibility');
  }


  /**
   *
   * @param endpoint
   * @param params
   * @param context
   * @param headers
   * @returns {*}
   */
  get(endpoint, params, context, headers) {
    return this.request('GET', endpoint, params, context, headers);
  }


  /**
   *
   * @param endpoint
   * @param params
   * @param context
   * @param headers
   * @returns {*}
   */
  post(endpoint, params, context, headers) {
    return this.request('POST', endpoint, params, context, headers);
  }


  /**
   *
   * @param endpoint
   * @param params
   * @param context
   * @param headers
   * @returns {*}
   */
  put(endpoint, params, context, headers) {
    return this.request('PUT', endpoint, params, context, headers);
  }


  /**
   *
   * @param endpoint
   * @param params
   * @param context
   * @param headers
   * @returns {*}
   */
  patch(endpoint, params, context, headers) {
    return this.request('PATCH', endpoint, params, context, headers);
  }


  /**
   *
   * @param endpoint
   * @param params
   * @param context
   * @param headers
   * @returns {*}
   */
  delete(endpoint, params, context, headers) {
    return this.request('DELETE', endpoint, params, context, headers);
  }


  /**
   *
   * @param endpoint
   * @param params
   * @param context
   * @param headers
   * @returns {*}
   */
  options(endpoint, params, context, headers) {
    return this.request('OPTIONS', endpoint, params, context, headers);
  }


  /**
   *
   * @param endpoint
   * @param params
   * @param context
   * @param headers
   * @returns {*}
   */
  head(endpoint, params, context, headers) {
    return this.request('HEAD', endpoint, params, context, headers);
  }
}
