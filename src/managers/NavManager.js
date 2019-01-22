import qs from 'query-string';
import { createBrowserHistory } from 'history';
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router';

class NavManager {
  static routerStore = null;
  static history = null;

  static initialize() {
    this.routerStore = new RouterStore();
    this.history = syncHistoryWithStore(
      createBrowserHistory({ basename: process.env.REACT_APP_URL_BASENAME }),
      this.routerStore
    );
  }

  /**
   * Return an object representation of the current query string
   */
  static get qsParams() {
    return qs.parse(this.routerStore.location.search);
  }

  static get currentLocation() {
    return this.routerStore.location;
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
  static setUrlParams(params, pathname, replace) {
    const qsParams = params || qs.parse(this.routerStore.location.search);

    // Filter out any parameters with unset values
    const filteredParams = {};
    Object.keys(qsParams).forEach((paramName) => {
      const value = qsParams[paramName];
      if (value) {
        filteredParams[paramName] = value;
      }
    });

    const currentPathname = this.routerStore.location.pathname;
    const querystring = qs.stringify(filteredParams);
    const url = `${pathname || currentPathname}?${querystring}`;

    if (replace) {
      this.routerStore.replace(url);
    } else {
      this.routerStore.push(url);
    }
  }

  /**
   * Convenience method to add, change, or remove params from the query string
   * @param change Object containing params to add, change, or remove
   */
  static updateUrlParams(change, replace) {
    const params = this.qsParams;

    Object.keys(change).forEach((key) => {
      const paramValue = change[key];
      if (paramValue) {
        params[key] = paramValue;
      } else {
        delete params[key];
      }
    });

    this.setUrlParams(params, null, replace);
  }

  /**
   * Unlike the underlying setUrlParams method, this method will clear the
   * querystring params if qsParams is unset.
   */
  static navigate(path, qsParams, replace) {
    this.setUrlParams(qsParams || {}, path, replace);
  }

  static goBack() {
    this.routerStore.history.goBack();
  }
}


export default NavManager;
