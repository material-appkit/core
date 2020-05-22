import cookie from 'js-cookie';
import request from 'superagent';

export default class ServiceProxy {
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


  getRequestHeaders(extra) {
    const headers = { 'Accept': 'application/json' };

    if (extra) {
      Object.assign(headers, extra);
    }

    const accessToken = this.constructor.getAccessToken();
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const csrfToken = cookie.get('csrftoken');
    if (csrfToken) {
      headers['X-CSRFToken'] = csrfToken;
    }

    return headers;
  }

  request(method, endpoint, params, context, headers) {
    const requestURL = this.constructor.buildRequestUrl(endpoint);

    if (typeof params === 'function') {
      params = params();
    }

    let req = request(method, requestURL);
    if (params) {
      if (method === 'GET') {
        req = req.query(params);
      } else {
        req = req.send(params);
      }
    }

    req.set(this.getRequestHeaders(headers));

    if (context) {
      context.request = req;
    }
    return req;
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

  download(endpoint, params, context, headers) {
    const requestContext = context || {};
    const req = this.get(endpoint, params, requestContext, headers);
    requestContext.request.responseType('blob');
    return req;
  }

  upload(endpoint, filesInfoList, params, context, headers) {
    if (!Array.isArray(filesInfoList)) {
      throw new Error('Expecting "files" to be an array');
    }

    const requestURL = this.constructor.buildRequestUrl(endpoint);
    const req = request.post(requestURL);

    req.set(this.getRequestHeaders(headers));

    for (const fileInfo of filesInfoList) {
      req.attach(fileInfo.name, fileInfo.file);
    }

    const fields = params || {};
    Object.keys(fields).forEach((fieldName) => {
      req.field(fieldName, fields[fieldName])
    });

    if (context) {
      context.request = req;
    }

    return req;
  }
}
