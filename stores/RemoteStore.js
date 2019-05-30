'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LOAD_DID_FAIL_NOTIFICATION_NAME = exports.LOAD_DID_COMPLETE_NOTIFICATION_NAME = exports.LOAD_WILL_BEGIN_NOTIFICATION_NAME = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash.isequal');

var _lodash2 = _interopRequireDefault(_lodash);

var _mobx = require('mobx');

var _util = require('../util');

var _object = require('../util/object');

var _NotificationManager = require('../managers/NotificationManager');

var _NotificationManager2 = _interopRequireDefault(_NotificationManager);

var _DataStore2 = require('./DataStore');

var _DataStore3 = _interopRequireDefault(_DataStore2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LOAD_WILL_BEGIN_NOTIFICATION_NAME = exports.LOAD_WILL_BEGIN_NOTIFICATION_NAME = 'RemoteStore.loadWillBegin';
var LOAD_DID_COMPLETE_NOTIFICATION_NAME = exports.LOAD_DID_COMPLETE_NOTIFICATION_NAME = 'RemoteStore.loadDidComplete';
var LOAD_DID_FAIL_NOTIFICATION_NAME = exports.LOAD_DID_FAIL_NOTIFICATION_NAME = 'RemoteStore.loadDidFail';

var RemoteStore = function (_DataStore) {
  _inherits(RemoteStore, _DataStore);

  function RemoteStore(options) {
    _classCallCheck(this, RemoteStore);

    var _this = _possibleConstructorReturn(this, (RemoteStore.__proto__ || Object.getPrototypeOf(RemoteStore)).call(this));

    _this.isLoading = false;
    _this.pageCount = null;
    _this.params = null;
    _this.requestContext = null;

    _this.options = options || {};
    _this._notificationCenter = _this.options.notificationCenter || _NotificationManager2.default.defaultCenter;

    // List of objects to receive callback when data is loaded
    _this.listeners = new Map();

    _this.addListener = _this.addListener.bind(_this);
    _this.removeListener = _this.removeListener.bind(_this);
    _this.emit = _this.emit.bind(_this);
    return _this;
  }

  _createClass(RemoteStore, [{
    key: 'load',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(params, page) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (params) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt('return');

              case 2:

                this.unload();

                this.params = (0, _object.filterEmptyValues)(params);
                return _context.abrupt('return', this._load(page || 1, true));

              case 5:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function load(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return load;
    }()
  }, {
    key: 'reload',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var params;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                params = _extends({}, this.params);

                this.unload();
                this.load(params);

              case 3:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function reload() {
        return _ref2.apply(this, arguments);
      }

      return reload;
    }()
  }, {
    key: 'loadMore',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(page) {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                return _context3.abrupt('return', this._load(page, false));

              case 1:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function loadMore(_x3) {
        return _ref3.apply(this, arguments);
      }

      return loadMore;
    }()
  }, {
    key: 'update',
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(params) {
        var updatedParams;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (params) {
                  _context4.next = 2;
                  break;
                }

                return _context4.abrupt('return');

              case 2:
                updatedParams = null;

                if (!this.params) {
                  _context4.next = 9;
                  break;
                }

                updatedParams = (0, _object.filterEmptyValues)(params);

                if (!(0, _lodash2.default)(updatedParams, this.params)) {
                  _context4.next = 7;
                  break;
                }

                return _context4.abrupt('return');

              case 7:
                _context4.next = 10;
                break;

              case 9:
                updatedParams = params;

              case 10:

                this.load(updatedParams);

              case 11:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function update(_x4) {
        return _ref4.apply(this, arguments);
      }

      return update;
    }()
  }, {
    key: 'unload',
    value: function unload() {
      this.params = null;
      this.items = null;
      this.totalLength = null;
      this.pageCount = null;

      if (this.requestContext) {
        // Abort the currently in-flight request, if any
        this.requestContext.request.abort();
      }
      this.requestContext = null;
      this.emit('unload');
    }
  }, {
    key: 'addListener',
    value: function addListener(eventName, callback) {
      this.listeners.has(eventName) || this.listeners.set(eventName, []);
      this.listeners.get(eventName).push(callback);
    }
  }, {
    key: 'removeListener',
    value: function removeListener(eventName, callback) {
      var listeners = this.listeners.get(eventName);
      var index = null;

      if (listeners && listeners.length) {
        index = listeners.reduce(function (i, listener, index) {
          return typeof listener === 'function' && listener === callback ? i = index : i;
        }, -1);

        if (index !== -1) {
          listeners.splice(index, 1);
          this.listeners.set(eventName, listeners);
          return true;
        }
      }
      return false;
    }
  }, {
    key: 'emit',
    value: function emit(eventName, param) {
      var listeners = this.listeners.get(eventName);
      if (listeners) {
        listeners.forEach(function (listener) {
          listener(param);
        });
      }
    }
  }, {
    key: '_getPageCount',
    value: function _getPageCount(totalLength) {
      return Math.ceil(totalLength / this.pageSize);
    }
  }, {
    key: '_getTotalLength',
    value: function _getTotalLength(responseData) {
      return responseData.count;
    }

    /**
     * Typically the response body is a JSON array of records.
     * Can be overridden by subclasses to handle response bodies of different form.
     */

  }, {
    key: '_transformResponseData',
    value: function _transformResponseData(responseData) {
      return responseData.results;
    }

    /**
     * Load records for the given page. Upon completion, store them
     * in their respective index in the _pages array.
     */

  }, {
    key: '_load',
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(page, replace) {
        var _this2 = this;

        var searchParams, pageSize, req;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                searchParams = _extends({}, this.params);
                pageSize = this.pageSize;


                if (pageSize) {
                  searchParams.page = page;
                  searchParams.pageSize = pageSize;
                }

                this.isLoading = true;

                if (this.options.onLoadStart) {
                  this.options.onLoadStart(searchParams);
                }

                this._notificationCenter.postNotification(LOAD_WILL_BEGIN_NOTIFICATION_NAME, this);
                this.emit('loadWillBegin');

                req = _util.ServiceAgent.get(this.endpoint, searchParams, this.requestContext);

                req.then(function (res) {
                  _this2.requestContext = null;

                  // If no response data is available (ex: due to the request having been
                  // aborted, unload the store.
                  if (res === null) {
                    _this2.unload();
                    return null;
                  }

                  var responseData = res.body;

                  // Notify listeners
                  _this2._notificationCenter.postNotification(LOAD_DID_COMPLETE_NOTIFICATION_NAME, _this2, { res: res });
                  _this2.emit('loadDidComplete', responseData);

                  var loadedItems = _this2._transformResponseData(responseData);

                  // Initialize the list of pages now that we know how many there are.
                  if (replace) {
                    _this2.totalLength = _this2._getTotalLength(responseData);
                    _this2.pageCount = _this2._getPageCount(_this2.totalLength);
                    _this2.items = loadedItems;
                  } else {
                    _this2.items = _this2.items.concat(loadedItems);
                  }

                  _this2.isLoading = false;

                  if (_this2.options.onLoadComplete) {
                    _this2.options.onLoadComplete(responseData);
                  }

                  return responseData;
                }).catch(function (err) {
                  _this2._notificationCenter.postNotification(LOAD_DID_FAIL_NOTIFICATION_NAME, _this2, { err: err });
                  _this2.emit('RemoteStore.loadDidFail', err);
                  return null;
                });

              case 9:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function _load(_x5, _x6) {
        return _ref5.apply(this, arguments);
      }

      return _load;
    }()
  }, {
    key: 'endpoint',
    get: function get() {
      var endpoint = this.options.endpoint;

      if (!endpoint) {
        throw new Error('Store must specify its endpoint!');
      }
      return endpoint;
    }
  }, {
    key: 'pageSize',
    get: function get() {
      return this.options.pageSize;
    }
  }]);

  return RemoteStore;
}(_DataStore3.default);

(0, _mobx.decorate)(RemoteStore, {
  isLoading: _mobx.observable
});

exports.default = RemoteStore;