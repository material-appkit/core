import StorageManager from '../../managers/StorageManager';

import NativeServiceProxy from './NativeServiceProxy';

/**
 *
 */
export default class APIServiceProxy extends NativeServiceProxy {
  /**
   * @static
   * @returns {String}
   */
  static getAccessTokenCookieName() {
    const cookieName = (
      process.env.REACT_APP_ACCESS_TOKEN_COOKIE_NAME ||
      process.env.NEXT_PUBLIC_ACCESS_TOKEN_COOKIE_NAME ||
      process.env.GATSBY_ACCESS_TOKEN_COOKIE_NAME
    );
    if (!cookieName) {
      throw new Error('Expecting an environment variable of name "REACT_APP_ACCESS_TOKEN_COOKIE_NAME" or "NEXT_PUBLIC_ACCESS_TOKEN_COOKIE_NAME" OR "GATSBY_ACCESS_TOKEN_COOKIE_NAME"');
    }

    return cookieName;
  }


  /**
   * @static
   * @returns {String}
   */
  static getBaseURL() {
    return process.env.REACT_APP_API_URL
      || process.env.NEXT_PUBLIC_API_URL
      || process.env.GATSBY_API_URL
      || '';
  }


  /**
   * @static
   * @returns {String}
   */
  static getBaseURLPrefix() {
    const urlPrefix = (
      process.env.REACT_APP_API_ENDPOINT_PREFIX ||
      process.env.NEXT_PUBLIC_API_ENDPOINT_PREFIX ||
      process.env.GATSBY_API_ENDPOINT_PREFIX
    );
    if (!urlPrefix) {
      throw new Error('Expecting an environment variable of name "REACT_APP_API_ENDPOINT_PREFIX" or "NEXT_PUBLIC_API_ENDPOINT_PREFIX" or "GATSBY_API_ENDPOINT_PREFIX"');
    }

    return urlPrefix;
  }


  /**
   * @static
   * @returns {String}
   */
  static getAccessToken() {
    return StorageManager.localValue(this.getAccessTokenCookieName());
  }


  /**
   * @static
   */
  static setAccessToken(value) {
    const cookieName = this.getAccessTokenCookieName();
    if (value) {
      StorageManager.setLocalValue(cookieName, value);
    } else {
      StorageManager.removeLocalValue(cookieName);
    }
  }


  /**
   * @static
   * @returns {Object}
   */
  static getRequestHeaders(headers, params) {
    const requestHeaders = {
      'Accept': 'application/json'
    };

    if (!(params instanceof FormData)) {
      requestHeaders['Content-Type'] = 'application/json';
    }

    if (headers) {
      Object.assign(requestHeaders, headers);
    }

    const accessToken = this.getAccessToken();
    if (accessToken) {
      requestHeaders.Authorization = `Bearer ${accessToken}`;
    }

    const csrfToken = StorageManager.getCookie('csrftoken');
    if (csrfToken) {
      requestHeaders['X-CSRFToken'] = csrfToken;
    }

    return requestHeaders;
  }
}
