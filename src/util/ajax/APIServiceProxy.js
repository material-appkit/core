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
      process.env.NEXT_PUBLIC_ACCESS_TOKEN_COOKIE_NAME
    );
    if (!cookieName) {
      throw new Error('Expecting an environment variable of name "REACT_APP_ACCESS_TOKEN_COOKIE_NAME" or "NEXT_PUBLIC_ACCESS_TOKEN_COOKIE_NAME"');
    }

    return cookieName;
  }

  /**
   * @static
   * @returns {String}
   */
  static getRefreshTokenCookieName() {
    const cookieName = (
      process.env.REACT_APP_REFRESH_TOKEN_COOKIE_NAME ||
      process.env.NEXT_PUBLIC_REFRESH_TOKEN_COOKIE_NAME
    );
    if (!cookieName) {
      throw new Error('Expecting an environment variable of name "REACT_APP_REFRESH_TOKEN_COOKIE_NAME" or "NEXT_PUBLIC_REFRESH_TOKEN_COOKIE_NAME"');
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
      || '';
  }


  /**
   * @static
   * @returns {String}
   */
  static getBaseURLPrefix() {
    const urlPrefix = (
      process.env.REACT_APP_API_ENDPOINT_PREFIX ||
      process.env.NEXT_PUBLIC_API_ENDPOINT_PREFIX
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
    return StorageManager.getCookie(this.getAccessTokenCookieName());
  }

  /**
   * @static
   */
  static setAccessToken(value) {
    const cookieName = this.getAccessTokenCookieName();
    const cookieOptions = { expires: 1 };
    if (value) {
      StorageManager.setCookie(cookieName, value, cookieOptions);
    } else {
      StorageManager.removeCookie(cookieName, cookieOptions);
    }
  }


  /**
   * @static
   * @returns {String}
   */
  static getRefreshToken() {
    return StorageManager.getCookie(this.getRefreshTokenCookieName());
  }

  /**
   * @static
   */
  static setRefreshToken(value) {
    const cookieName = this.getRefreshTokenCookieName();
    const cookieOptions = { expires: 7 };
    if (value) {
      StorageManager.setCookie(cookieName, value, cookieOptions);
    } else {
      StorageManager.removeCookie(cookieName, cookieOptions);
    }
  }


  /**
   * @static
   * @returns {Object}
   */
  static getRequestHeaders(headers, params, authenticate) {
    const requestHeaders = {
      'Accept': 'application/json'
    };

    if (!(params instanceof FormData)) {
      requestHeaders['Content-Type'] = 'application/json';
    }

    if (headers) {
      Object.assign(requestHeaders, headers);
    }

    if (authenticate) {
      const accessToken = this.getAccessToken();
      if (accessToken) {
        requestHeaders.Authorization = `Bearer ${accessToken}`;
      }
    }

    const csrfToken = StorageManager.getCookie('csrftoken');
    if (csrfToken) {
      requestHeaders['X-CSRFToken'] = csrfToken;
    }

    return requestHeaders;
  }
}
