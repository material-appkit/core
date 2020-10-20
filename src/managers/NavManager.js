import qs from 'query-string';
import { createBrowserHistory } from 'history';

import { isSet } from '../util/value';

class NavManager {
  static history = null;

  static initialize(options) {
    const historyBaseName = options.basename || process.env.REACT_APP_URL_BASENAME;
    this.history = createBrowserHistory({ basename: historyBaseName });
  }

  static get currentLocation() {
    return this.history.location;
  }


  /**
   * Return an object representation of the current query string
   */
  static get qsParams() {
    return qs.parse(this.currentLocation.search);
  }


  static reloadWindow() {
    window.location.reload();
  }

  /**
   * Replace ALL location querystring parameters with those provided, (excluding those without values).
   * @param params Set of parameters to replace the URL with
   * @param pathname Path to set on location. If undefined, use the current pathname.
   * @param replace If set, replace the topmost URL in the history stack. Else push a new one.
   */
  static setUrlParams(params, pathname, replace, state) {
    const currentLocation = this.currentLocation;
    const qsParams = params || qs.parse(currentLocation.search);

    // Filter out any null/undefined parameters
    const filteredParams = {};
    Object.keys(qsParams).forEach((paramName) => {
      const value = qsParams[paramName];
      if (isSet(value)) {
        filteredParams[paramName] = value;
      }
    });

    const currentPathname = currentLocation.pathname;
    const querystring = qs.stringify(filteredParams);
    const url = `${pathname || currentPathname}?${querystring}`;

    if (replace) {
      this.history.replace(url, state);
    } else {
      this.history.push(url, state);
    }
  }

  /**
   * Convenience method to add, change, or remove params from the query string
   * @param change Object containing params to add, change, or remove
   * @param replace Flag indicating whether to add a new history entry or
   *                update the current history state
   */
  static updateUrlParams(change, replace) {
    const params = { ...this.qsParams, ...change };

    this.setUrlParams(params, null, replace);
  }

  /**
   * Convenience method to set a single querystring param
   */
  static updateUrlParam(paramName, paramValue, replace) {
    this.updateUrlParams({ [paramName]: paramValue }, replace);
  }

  /**
   * Unlike the underlying setUrlParams method, this method will clear the
   * querystring params if qsParams is unset.
   */
  static navigate(path, qsParams, replace, state) {
    this.setUrlParams(qsParams || {}, path, replace, state);
  }

  static goBack() {
    this.history.goBack();
  }
}


export default NavManager;
