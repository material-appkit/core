'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ServiceProxy = require('./ajax/ServiceProxy');

var _ServiceProxy2 = _interopRequireDefault(_ServiceProxy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ServiceAgent = function () {
  function ServiceAgent() {
    _classCallCheck(this, ServiceAgent);
  }

  _createClass(ServiceAgent, null, [{
    key: 'initialize',
    value: function initialize(options) {
      if (options.ServiceProxyClass) {
        this.ServiceProxyClass = options.ServiceProxyClass;
      }
    }
  }, {
    key: 'request',
    value: function request(method, endpoint, params, context) {
      var proxy = new this.ServiceProxyClass();
      return proxy.request(method, endpoint, params, context);
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

ServiceAgent.ServiceProxyClass = _ServiceProxy2.default;
exports.default = ServiceAgent;