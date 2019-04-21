import cookie from 'js-cookie';
import request from 'superagent';

export default class ServiceProxy {
  static getAccessToken() {
    const cookieName = process.env.REACT_APP_ACCESS_TOKEN_COOKIE_NAME;
    return cookie.get(cookieName);
  }

  static setAccessToken(value) {
    const cookieName = process.env.REACT_APP_ACCESS_TOKEN_COOKIE_NAME;
    if (value) {
      cookie.set(cookieName, value);
    } else {
      cookie.remove(cookieName);
    }
  }

  static buildRequestUrl(endpoint) {
    // If this is already an absolute URL, leave it as is.
    if (endpoint.startsWith('http')) {
      return endpoint;
    }

    // Construct the AJAX request with the given params
    let requestURL = process.env.REACT_APP_API_URL;
    if (!endpoint.startsWith('/')) {
      requestURL += process.env.REACT_APP_API_ENDPOINT_PREFIX;
    }
    requestURL += endpoint;

    return requestURL;
  }

  getRequestHeaders(extra) {
    const headers = {
      'Content-Type': 'application/json'
    };

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

  async request(method, endpoint, params, context, headers) {
    console.log(headers);

    const requestURL = this.constructor.buildRequestUrl(endpoint);

    if (typeof params === 'function') {
      params = params();
    }
    const requestParams = params || {};

    let req = null;
    switch (method) {
      case 'GET':
        req = request.get(requestURL).query(requestParams);
        break;
      case 'POST':
        req = request.post(requestURL).send(requestParams);
        break;
      case 'PUT':
        req = request.put(requestURL).send(requestParams);
        break;
      case 'PATCH':
        req = request.patch(requestURL).send(requestParams);
        break;
      case 'DELETE':
        req = request.del(requestURL).send(requestParams);
        break;
      case 'OPTIONS':
        req = request.options(requestURL).send(requestParams);
        break;
      case 'HEAD':
        req = request.head(requestURL).send(requestParams);
        break;
      default:
        throw new Error(`Unsupported request method: ${method}`);
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
}
