import StorageManager from '../../managers/StorageManager';

const DEFAULT_REQUEST_HEADERS = {
  'Accept': 'application/json',
};

export default class SAServiceProxy {
  static getAccessTokenCookieName() {
    const cookieName = (
      process.env.REACT_APP_ACCESS_TOKEN_COOKIE_NAME ||
      process.env.GATSBY_ACCESS_TOKEN_COOKIE_NAME
    );
    if (!cookieName) {
      throw new Error('Expecting an environment variable of name "REACT_APP_ACCESS_TOKEN_COOKIE_NAME" or "GATSBY_ACCESS_TOKEN_COOKIE_NAME"');
    }

    return cookieName;
  }

  static getBaseURL() {
    const baseUrl = (
      process.env.REACT_APP_API_URL ||
      process.env.GATSBY_API_URL
    );
    if (!baseUrl) {
      throw new Error('Expecting an environment variable of name "REACT_APP_API_URL" or "GATSBY_API_URL"');
    }

    return baseUrl;
  }

  static getBaseURLPrefix() {
    const urlPrefix = (
      process.env.REACT_APP_API_ENDPOINT_PREFIX ||
      process.env.GATSBY_API_ENDPOINT_PREFIX
    );
    if (!urlPrefix) {
      throw new Error('Expecting an environment variable of name "REACT_APP_API_ENDPOINT_PREFIX" or "GATSBY_API_ENDPOINT_PREFIX"');
    }

    return urlPrefix;
  }

  static getAccessToken() {
    return StorageManager.localValue(this.getAccessTokenCookieName());
  }

  static setAccessToken(value) {
    const cookieName = this.getAccessTokenCookieName();
    if (value) {
      StorageManager.setLocalValue(cookieName, value);
    } else {
      StorageManager.removeLocalValue(cookieName);
    }
  }


  static getRequestHeaders(headers, params) {
    const requestHeaders = { ...DEFAULT_REQUEST_HEADERS };

    if (params && !(params instanceof FormData)) {
      requestHeaders['Content-Type'] = 'application/json';
    }

    if (headers) {
      Object.assign(requestHeaders, headers);
    }

    const accessToken = this.getAccessToken();
    if (accessToken) {
      requestHeaders.Authorization = `Bearer ${accessToken}`;
    }

    const csrfToken = StorageManager.localValue('csrftoken');
    if (csrfToken) {
      requestHeaders['X-CSRFToken'] = csrfToken;
    }

    return requestHeaders;
  }


  static buildRequestUrl(endpoint) {
    let endpointInfo = endpoint;

    if (typeof(endpointInfo) === 'string') {
      endpointInfo = {
        url: this.getBaseURL(),
        path: endpointInfo,
      }
    }

    // If this is already an absolute URL, leave it as is.
    if (endpointInfo.path.startsWith('http')) {
      return endpointInfo.path;
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
