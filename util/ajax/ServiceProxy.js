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

var ServiceProxy = function () {
  function ServiceProxy() {
    _classCallCheck(this, ServiceProxy);
  }

  _createClass(ServiceProxy, [{
    key: 'getRequestHeaders',
    value: function getRequestHeaders(extra) {
      var headers = { 'Accept': 'application/json' };

      if (extra) {
        Object.assign(headers, extra);
      }

      var accessToken = this.constructor.getAccessToken();
      if (accessToken) {
        headers.Authorization = 'Bearer ' + accessToken;
      }

      var csrfToken = _jsCookie2.default.get('csrftoken');
      if (csrfToken) {
        headers['X-CSRFToken'] = csrfToken;
      }

      return headers;
    }
  }, {
    key: 'request',
    value: function request(method, endpoint, params, context, headers) {
      var requestURL = this.constructor.buildRequestUrl(endpoint);

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
      req.set(this.getRequestHeaders(headers));

      if (context) {
        context.request = req;
      }
      return req;
    }
  }, {
    key: 'get',
    value: function get(endpoint, params, context, headers) {
      return this.request('GET', endpoint, params, context, headers);
    }
  }, {
    key: 'post',
    value: function post(endpoint, params, context, headers) {
      return this.request('POST', endpoint, params, context, headers);
    }
  }, {
    key: 'put',
    value: function put(endpoint, params, context, headers) {
      return this.request('PUT', endpoint, params, context, headers);
    }
  }, {
    key: 'patch',
    value: function patch(endpoint, params, context, headers) {
      return this.request('PATCH', endpoint, params, context, headers);
    }
  }, {
    key: 'delete',
    value: function _delete(endpoint, params, context, headers) {
      return this.request('DELETE', endpoint, params, context, headers);
    }
  }, {
    key: 'options',
    value: function options(endpoint, params, context, headers) {
      return this.request('OPTIONS', endpoint, params, context, headers);
    }
  }, {
    key: 'head',
    value: function head(endpoint, params, context, headers) {
      return this.request('HEAD', endpoint, params, context, headers);
    }
  }, {
    key: 'download',
    value: function download(endpoint, params, context, headers) {
      var requestContext = context || {};
      var req = this.get(endpoint, params, requestContext, headers);
      requestContext.request.responseType('blob');
      return req;
    }
  }, {
    key: 'upload',
    value: function upload(endpoint, files, params, headers) {
      if (!Array.isArray(files)) {
        throw new Error('Expecting "files" to be an array');
      }

      var requestURL = this.constructor.buildRequestUrl(endpoint);
      var req = _superagent2.default.post(requestURL);

      req.set(this.getRequestHeaders(headers));

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = files[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var fileInfo = _step.value;

          req.attach(fileInfo.name, fileInfo.file);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      var fields = params || {};
      Object.keys(params).forEach(function (fieldName) {
        req.field(fieldName, fields[fieldName]);
      });

      return req;
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
      var endpointInfo = endpoint;

      if (typeof endpointInfo === 'string') {
        endpointInfo = {
          url: process.env.REACT_APP_API_URL,
          path: endpointInfo
        };
      }

      // If this is already an absolute URL, leave it as is.
      if (endpointInfo.path.startsWith('http')) {
        return endpointInfo.path;
      }

      // Construct the AJAX request with the given params
      var requestURL = endpointInfo.url;
      if (!endpointInfo.path.startsWith('/')) {
        requestURL += process.env.REACT_APP_API_ENDPOINT_PREFIX;
      }
      requestURL += endpointInfo.path;

      return requestURL;
    }
  }]);

  return ServiceProxy;
}();

exports.default = ServiceProxy;