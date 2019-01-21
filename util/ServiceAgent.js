import cookie from 'js-cookie';
import request from 'superagent';

class ServiceAgent {
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

  static getRefreshToken() {
    const cookieName = process.env.REACT_APP_REFRESH_TOKEN_COOKIE_NAME;
    return cookie.get(cookieName);
  }
  static setRefreshToken(value) {
    const cookieName = process.env.REACT_APP_REFRESH_TOKEN_COOKIE_NAME;
    if (value) {
      cookie.set(cookieName, value);
    } else {
      cookie.remove(cookieName);
    }
  }


  static async refreshAccessToken() {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available!');
    }

    try {
      // If a refresh token is present, attempt to refresh the access token
      const refreshTokenEndpoint =  process.env.REACT_APP_REFRESH_TOKEN_ENDPOINT;
      const params = { refresh: refreshToken };
      const res = await this._request('POST', refreshTokenEndpoint, params);

      this.setAccessToken(res.body.access);
      this.setRefreshToken(res.body.refresh);

      return res;
    } catch (err) {
      this.setAccessToken(null);
      this.setRefreshToken(null);
      throw new Error('Access token refresh failed');
    }
  }

  static _request(method, endpoint, params, context) {
    // Construct the AJAX request with the given params
    let requestURL = process.env.REACT_APP_API_URL;
    if (!endpoint.startsWith('/')) {
      requestURL += process.env.REACT_APP_API_ENDPOINT_PREFIX;
    }
    requestURL += endpoint;

    if (process.env.REACT_APP_API_XDEBUG_KEY) {
      requestURL = `${requestURL}?XDEBUG_SESSION_START=${process.env.REACT_APP_API_XDEBUG_KEY}`;
    }

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
    req.accept('application/json');
    const accessToken = this.getAccessToken();
    if (accessToken) {
      req.set('Authorization', `Bearer ${accessToken}`);
    }

    const csrfToken = cookie.get('csrftoken');
    if (csrfToken) {
      req.set('X-CSRFToken', csrfToken);
    }

    if (context) {
      context.request = req;
    }
    return req;
  }

  static async request(method, endpoint, params, context) {
    try {
      return await this._request(method, endpoint, params, context);
    } catch (err) {
      // If a requests fails for ANY reason, attempt to refresh the access
      // token then re-issue.
      // TODO: Distinguish requests that failed due to an invalid token.
      // Only THEN do we want to clear the stored accessToken
      // this.setAccessToken(null);
      try {
        await this.refreshAccessToken();
        return await this._request(method, endpoint, params, context);
      } catch (tokenRefreshError) {
        throw err;
      }
    }
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
