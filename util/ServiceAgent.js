'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jsCookie = require('js-cookie');

var _jsCookie2 = _interopRequireDefault(_jsCookie);

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ServiceAgent = function () {
  function ServiceAgent() {
    _classCallCheck(this, ServiceAgent);
  }

  _createClass(ServiceAgent, [{
    key: 'request',
    value: function request(method, endpoint, params, context) {
      return this.constructor.request(method, endpoint, params, context);
    }
  }, {
    key: 'get',
    value: function get(endpoint, params, context) {
      return this.request('GET', endpoint, params, context);
    }
  }, {
    key: 'post',
    value: function post(endpoint, params, context) {
      return this.request('POST', endpoint, params, context);
    }
  }, {
    key: 'put',
    value: function put(endpoint, params, context) {
      return this.request('PUT', endpoint, params, context);
    }
  }, {
    key: 'patch',
    value: function patch(endpoint, params, context) {
      return this.request('PATCH', endpoint, params, context);
    }
  }, {
    key: 'delete',
    value: function _delete(endpoint, params, context) {
      return this.request('DELETE', endpoint, params, context);
    }
  }, {
    key: 'options',
    value: function options(endpoint, params, context) {
      return this.request('OPTIONS', endpoint, params, context);
    }
  }, {
    key: 'head',
    value: function head(endpoint, params, context) {
      return this.request('HEAD', endpoint, params, context);
    }
  }], [{
    key: 'getAccessToken',
    value: function getAccessToken() {
      var cookieName = process.env.REACT_APP_ACCESS_TOKEN_COOKIE_NAME;
      return _jsCookie2.default.get(cookieName);
    }
  }, {
    key: 'setAccessToken',
    value: function setAccessToken(value) {
      var cookieName = process.env.REACT_APP_ACCESS_TOKEN_COOKIE_NAME;
      if (value) {
        _jsCookie2.default.set(cookieName, value);
      } else {
        _jsCookie2.default.remove(cookieName);
      }
    }
  }, {
    key: 'buildRequestUrl',
    value: function buildRequestUrl(endpoint) {
      // If this is already an absolute URL, leave it as is.
      if (endpoint.startsWith('http')) {
        return endpoint;
      }

      // Construct the AJAX request with the given params
      var requestURL = process.env.REACT_APP_API_URL;
      if (!endpoint.startsWith('/')) {
        requestURL += process.env.REACT_APP_API_ENDPOINT_PREFIX;
      }
      requestURL += endpoint;

      return requestURL;
    }
  }, {
    key: 'request',
    value: function request(method, endpoint, params, context) {
      var requestURL = this.buildRequestUrl(endpoint);

      if (typeof params === 'function') {
        params = params();
      }
      var requestParams = params || {};

      var req = null;
      switch (method) {
        case 'GET':
          req = _superagent2.default.get(requestURL).query(requestParams);
          break;
        case 'POST':
          req = _superagent2.default.post(requestURL).send(requestParams);
          break;
        case 'PUT':
          req = _superagent2.default.put(requestURL).send(requestParams);
          break;
        case 'PATCH':
          req = _superagent2.default.patch(requestURL).send(requestParams);
          break;
        case 'DELETE':
          req = _superagent2.default.del(requestURL).send(requestParams);
          break;
        case 'OPTIONS':
          req = _superagent2.default.options(requestURL).send(requestParams);
          break;
        case 'HEAD':
          req = _superagent2.default.head(requestURL).send(requestParams);
          break;
        default:
          throw new Error('Unsupported request method: ' + method);
      }
      req.accept('application/json');
      var accessToken = this.getAccessToken();
      if (accessToken) {
        req.set('Authorization', 'Bearer ' + accessToken);
      }

      var csrfToken = _jsCookie2.default.get('csrftoken');
      if (csrfToken) {
        req.set('X-CSRFToken', csrfToken);
      }

      if (context) {
        context.request = req;
      }
      return req;
    }
  }, {
    key: 'get',
    value: function get(endpoint, params, context) {
      return this.request('GET', endpoint, params, context);
    }
  }, {
    key: 'post',
    value: function post(endpoint, params, context) {
      return this.request('POST', endpoint, params, context);
    }
  }, {
    key: 'put',
    value: function put(endpoint, params, context) {
      return this.request('PUT', endpoint, params, context);
    }
  }, {
    key: 'patch',
    value: function patch(endpoint, params, context) {
      return this.request('PATCH', endpoint, params, context);
    }
  }, {
    key: 'delete',
    value: function _delete(endpoint, params, context) {
      return this.request('DELETE', endpoint, params, context);
    }
  }, {
    key: 'options',
    value: function options(endpoint, params, context) {
      return this.request('OPTIONS', endpoint, params, context);
    }
  }, {
    key: 'head',
    value: function head(endpoint, params, context) {
      return this.request('HEAD', endpoint, params, context);
    }
  }]);

  return ServiceAgent;
}();

exports.default = ServiceAgent;