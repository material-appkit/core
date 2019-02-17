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

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ServiceProxy = function () {
  function ServiceProxy() {
    _classCallCheck(this, ServiceProxy);
  }

  _createClass(ServiceProxy, [{
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
    key: 'getRequestHeaders',
    value: function getRequestHeaders() {
      var headers = {};

      var accessToken = this.getAccessToken();
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
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(method, endpoint, params, context) {
        var requestURL, requestParams, req;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                requestURL = this.buildRequestUrl(endpoint);


                if (typeof params === 'function') {
                  params = params();
                }
                requestParams = params || {};
                req = null;
                _context.t0 = method;
                _context.next = _context.t0 === 'GET' ? 7 : _context.t0 === 'POST' ? 9 : _context.t0 === 'PUT' ? 11 : _context.t0 === 'PATCH' ? 13 : _context.t0 === 'DELETE' ? 15 : _context.t0 === 'OPTIONS' ? 17 : _context.t0 === 'HEAD' ? 19 : 21;
                break;

              case 7:
                req = _superagent2.default.get(requestURL).query(requestParams);
                return _context.abrupt('break', 22);

              case 9:
                req = _superagent2.default.post(requestURL).send(requestParams);
                return _context.abrupt('break', 22);

              case 11:
                req = _superagent2.default.put(requestURL).send(requestParams);
                return _context.abrupt('break', 22);

              case 13:
                req = _superagent2.default.patch(requestURL).send(requestParams);
                return _context.abrupt('break', 22);

              case 15:
                req = _superagent2.default.del(requestURL).send(requestParams);
                return _context.abrupt('break', 22);

              case 17:
                req = _superagent2.default.options(requestURL).send(requestParams);
                return _context.abrupt('break', 22);

              case 19:
                req = _superagent2.default.head(requestURL).send(requestParams);
                return _context.abrupt('break', 22);

              case 21:
                throw new Error('Unsupported request method: ' + method);

              case 22:
                req.accept('application/json');
                req.set(this.getRequestHeaders());

                if (context) {
                  context.request = req;
                }
                return _context.abrupt('return', req);

              case 26:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function request(_x, _x2, _x3, _x4) {
        return _ref.apply(this, arguments);
      }

      return request;
    }()
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

  return ServiceProxy;
}();

exports.default = ServiceProxy;