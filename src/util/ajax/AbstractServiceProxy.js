import cookie from 'js-cookie';
import qs from 'query-string';

const DEFAULT_FETCH_OPTIONS = {
  mode: 'cors',
  credentials: 'same-origin',
};

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
    return cookie.get(this.getAccessTokenCookieName());
  }

  static setAccessToken(value, attrs) {
    const cookieAttributes = attrs || {};
    const cookieName = this.getAccessTokenCookieName();
    if (value) {
      cookie.set(cookieName, value, cookieAttributes);
    } else {
      cookie.remove(cookieName, cookieAttributes);
    }
  }


  static getRequestHeaders(extra) {
    const headers = { ...DEFAULT_REQUEST_HEADERS };

    if (extra) {
      Object.assign(headers, extra);
    }

    const accessToken = this.getAccessToken();
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const csrfToken = cookie.get('csrftoken');
    if (csrfToken) {
      headers['X-CSRFToken'] = csrfToken;
    }

    return headers;
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


  static buildRequest(method, endpoint, params, headers) {
    let requestURL = this.buildRequestUrl(endpoint);

    const fetchOptions = {
      ...DEFAULT_FETCH_OPTIONS,
      method,
      headers,
    };


    if (params) {
      let requestParams = params;
      
      const paramType = typeof requestParams;
      if (paramType === 'function') {
        requestParams = requestParams();
      }

      if (method === 'GET') {
        requestURL = `${requestURL}?${qs.stringify(params)}`;
      } else {
        if (requestParams instanceof FormData) {
          fetchOptions.body = requestParams;
        } else {
          fetchOptions.body = JSON.stringify(requestParams);
        }
      }
    }

    return new Request(requestURL, fetchOptions);
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
