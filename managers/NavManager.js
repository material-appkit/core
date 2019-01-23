'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _queryString = require('query-string');

var _queryString2 = _interopRequireDefault(_queryString);

var _history = require('history');

var _mobxReactRouter = require('mobx-react-router');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NavManager = function () {
  function NavManager() {
    _classCallCheck(this, NavManager);
  }

  _createClass(NavManager, null, [{
    key: 'initialize',
    value: function initialize() {
      this.routerStore = new _mobxReactRouter.RouterStore();
      this.history = (0, _mobxReactRouter.syncHistoryWithStore)((0, _history.createBrowserHistory)({ basename: process.env.REACT_APP_URL_BASENAME }), this.routerStore);
    }

    /**
     * Return an object representation of the current query string
     */

  }, {
    key: 'reloadWindow',
    value: function reloadWindow() {
      window.location.reload();
    }

    /**
     * Replace ALL location querystring parameters with those provided, (excluding those without values).
     * @param params Set of parameters to replace the URL with
     * @param pathname Path to set on location. If undefined, use the current pathname.
     * @param replace If set, replace the topmost URL in the history stack. Else push a new one.
     */

  }, {
    key: 'setUrlParams',
    value: function setUrlParams(params, pathname, replace, state) {
      var qsParams = params || _queryString2.default.parse(this.routerStore.location.search);

      // Filter out any parameters with unset values
      var filteredParams = {};
      Object.keys(qsParams).forEach(function (paramName) {
        var value = qsParams[paramName];
        if (value) {
          filteredParams[paramName] = value;
        }
      });

      var currentPathname = this.routerStore.location.pathname;
      var querystring = _queryString2.default.stringify(filteredParams);
      var url = (pathname || currentPathname) + '?' + querystring;

      if (replace) {
        this.routerStore.history.replace(url, state);
      } else {
        this.routerStore.history.push(url, state);
      }
    }

    /**
     * Convenience method to add, change, or remove params from the query string
     * @param change Object containing params to add, change, or remove
     */

  }, {
    key: 'updateUrlParams',
    value: function updateUrlParams(change, replace) {
      var params = this.qsParams;

      Object.keys(change).forEach(function (key) {
        var paramValue = change[key];
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

  }, {
    key: 'navigate',
    value: function navigate(path, qsParams, replace, state) {
      this.setUrlParams(qsParams || {}, path, replace, state);
    }
  }, {
    key: 'goBack',
    value: function goBack() {
      this.routerStore.history.goBack();
    }
  }, {
    key: 'qsParams',
    get: function get() {
      return _queryString2.default.parse(this.routerStore.location.search);
    }
  }, {
    key: 'currentLocation',
    get: function get() {
      return this.routerStore.location;
    }
  }]);

  return NavManager;
}();

NavManager.routerStore = null;
NavManager.history = null;
exports.default = NavManager;