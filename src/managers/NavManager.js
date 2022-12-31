import { createBrowserHistory } from 'history';

import { isSet } from '../util/value';

/**
 * @summary
 * General description about the NavManager
 */
class NavManager {
  static history = null;

  /**
   *
   * @param {Object} options
   *
   * @static
   */
  static initialize(options) {
    const historyBaseName = options.basename || process.env.REACT_APP_URL_BASENAME;
    this.history = createBrowserHistory({ basename: historyBaseName });
  }

  /**
   * @static
   *
   * @returns {Object}
   * Current location in browser history
   *
   * @static
   */
  static get currentLocation() {
    return this.history.location;
  }


  /**
   * @returns {Object}
   * An object representation of the current query string
   *
   * @static
   */
  static get qsParams() {
    const searchParams = new URLSearchParams(this.currentLocation.search);
    return Object.fromEntries(searchParams);
  }


  /**
   * @summary
   * Reload the page at the current location
   *
   * @static
   */
  static reloadWindow() {
    window.location.reload();
  }

  /**
   * @summary
   * Replace ALL location querystring parameters with those provided, (excluding those without values).
   *
   * @param {Object} params
   * Set of parameters to replace the URL with
   *
   * @param {String} pathname
   * Path to set on location. If undefined, use the current pathname.
   *
   * @param {Boolean} replace
   * If set, replace the topmost URL in the history stack. Else push a new one.
   *
   * @param {Object} state
   * Optional context to include new location
   *
   * @static
   */
  static setUrlParams(params, pathname, replace, state) {
    const currentLocation = this.currentLocation;
    let qsParams = params;
    if (!qsParams) {
      qsParams = NavManager.qsParams;
    }

    // Filter out any null/undefined parameters
    const filteredParams = {};
    Object.keys(qsParams).forEach((paramName) => {
      const value = qsParams[paramName];
      if (isSet(value)) {
        filteredParams[paramName] = value;
      }
    });

    const currentPathname = currentLocation.pathname;
    const searchParams = new URLSearchParams(filteredParams);
    const querystring = searchParams.toString();
    const url = `${pathname || currentPathname}?${querystring}`;

    if (replace) {
      this.history.replace(url, state);
    } else {
      this.history.push(url, state);
    }
  }

  /**
   *
   * @summary
   * Convenience method to add or change a set of querystring params
   *
   * @param {Object} change
   * Object containing params to add or change
   *
   * @param {Boolean} replace
   * Flag indicating whether to add a new history entry or update
   * the current history state
   *
   * @static
   */
  static updateUrlParams(change, replace) {
    const params = { ...this.qsParams, ...change };

    this.setUrlParams(params, null, replace);
  }

  /**
   * @summary
   * Convenience method to set a single querystring param
   *
   * @param {String} paramName
   * @param {*} paramValue
   * @param {Boolean} replace
   *
   * @static
   */
  static updateUrlParam(paramName, paramValue, replace) {
    this.updateUrlParams({ [paramName]: paramValue }, replace);
  }


  /**
   * @summary
   * Convenience method to clear a set of querystring params
   *
   * @param {Array} paramNames
   * @param {Boolean} replace
   *
   * @static
   */
  static clearUrlParams(paramNames, replace) {
    const params = { ...this.qsParams };
    paramNames.forEach((paramName) => {
      params[paramName] = null;
    });
    this.setUrlParams(params, null, replace);
  };


  /**
   * @summary
   * Convenience method to clear a single querystring param
   *
   * @param {String} paramName
   * @param {Boolean} replace*
   *
   * @static
   */
  static clearUrlParam(paramName, replace) {
    this.clearUrlParams([paramName], replace);
  };


  /**
   * @summary
   * Unlike the underlying setUrlParams method, this method will clear the
   * querystring params if qsParams is unset.
   *
   * @param {String} path
   * @param {Object} qsParams
   * @param {Boolean} replace
   * @param {Boolean} state
   *
   * @static
   */
  static navigate(path, qsParams, replace, state) {
    this.setUrlParams(qsParams || {}, path, replace, state);
  }

  /**
   * @summary
   * Navigate to the previous page in the location history
   *
   * @static
   */
  static goBack() {
    this.history.goBack();
  }
}


export default NavManager;
