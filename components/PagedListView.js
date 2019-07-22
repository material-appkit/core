'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash.isequal');

var _lodash2 = _interopRequireDefault(_lodash);

var _queryString = require('query-string');

var _queryString2 = _interopRequireDefault(_queryString);

var _reactRouterDom = require('react-router-dom');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _withStyles = require('@material-ui/core/styles/withStyles');

var _withStyles2 = _interopRequireDefault(_withStyles);

var _ServiceAgent = require('../util/ServiceAgent');

var _ServiceAgent2 = _interopRequireDefault(_ServiceAgent);

var _object = require('../util/object');

var _VirtualizedList = require('./VirtualizedList');

var _VirtualizedList2 = _interopRequireDefault(_VirtualizedList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PagedListView = function (_React$PureComponent) {
  _inherits(PagedListView, _React$PureComponent);

  function PagedListView() {
    var _ref,
        _this2 = this;

    var _temp, _this, _ret;

    _classCallCheck(this, PagedListView);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = PagedListView.__proto__ || Object.getPrototypeOf(PagedListView)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      filterParams: null,
      items: null,
      redirectTo: null
    }, _this.refresh = function () {
      if (!_this.isActive) {
        // Since this component may be mounted in the background, only respond
        // to location changes when it is "active"
        return;
      }

      _this.syncItemStore();
    }, _this.syncItemStore = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var _this$props, endpoint, filterParams, onLoad, qsFilterParamNames, params, res;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _this$props = _this.props, endpoint = _this$props.endpoint, filterParams = _this$props.filterParams, onLoad = _this$props.onLoad, qsFilterParamNames = _this$props.qsFilterParamNames;
              params = filterParams || {};

              if (qsFilterParamNames) {
                Object.assign(params, (0, _object.filterByKeys)(_this.qsParams, qsFilterParamNames));
              }

              if (!(!params || (0, _lodash2.default)(params, _this.state.filterParams))) {
                _context.next = 5;
                break;
              }

              return _context.abrupt('return');

            case 5:

              _this.setState({ filterParams: params });

              _context.next = 8;
              return _ServiceAgent2.default.get(endpoint, params);

            case 8:
              res = _context.sent;

              onLoad(res.body, params);
              _this.setState({ items: res.body.results });

            case 11:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this2);
    })), _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(PagedListView, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.refresh();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.refresh();
    }
  }, {
    key: 'render',
    value: function render() {
      if (this.state.redirectTo) {
        return _react2.default.createElement(_reactRouterDom.Redirect, { to: this.state.redirectTo });
      }

      var _props = this.props,
          listItemComponent = _props.listItemComponent,
          isGrouped = _props.isGrouped,
          itemContextProvider = _props.itemContextProvider,
          itemIdKey = _props.itemIdKey,
          itemProps = _props.itemProps,
          onItemClick = _props.onItemClick,
          onSelectionChange = _props.onSelectionChange,
          selectionMode = _props.selectionMode;


      return _react2.default.createElement(_VirtualizedList2.default, {
        componentForItem: listItemComponent,
        isGrouped: isGrouped,
        itemContextProvider: itemContextProvider,
        itemIdKey: itemIdKey,
        itemProps: itemProps,
        items: this.state.items,
        onItemClick: onItemClick,
        onSelectionChange: onSelectionChange,
        selectionMode: selectionMode
      });
    }
  }, {
    key: 'isActive',
    get: function get() {
      var _props2 = this.props,
          location = _props2.location,
          mountPath = _props2.mountPath;


      var match = (0, _reactRouterDom.matchPath)(location.pathname, { path: mountPath });
      return match.isExact;
    }
  }, {
    key: 'qsParams',
    get: function get() {
      return _queryString2.default.parse(this.props.location.search);
    }
  }, {
    key: 'filterParams',
    get: function get() {
      var _props3 = this.props,
          filterParams = _props3.filterParams,
          qsFilterParamNames = _props3.qsFilterParamNames;


      var params = filterParams || {};
      if (qsFilterParamNames) {
        Object.assign(params, (0, _object.filterByKeys)(this.qsParams, qsFilterParamNames));
      }

      return params;
    }
  }]);

  return PagedListView;
}(_react2.default.PureComponent);

PagedListView.propTypes = {
  classes: _propTypes2.default.object,
  createURL: _propTypes2.default.string,
  listItemComponent: _propTypes2.default.func.isRequired,
  endpoint: _propTypes2.default.string,
  entityType: _propTypes2.default.string,
  filterParams: _propTypes2.default.object,
  isGrouped: _propTypes2.default.bool,
  itemContextProvider: _propTypes2.default.func,
  itemIdKey: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.func]),
  itemProps: _propTypes2.default.object,
  onItemClick: _propTypes2.default.func,
  onLoad: _propTypes2.default.func,
  onSelectionChange: _propTypes2.default.func,
  location: _propTypes2.default.object.isRequired,
  mountPath: _propTypes2.default.string.isRequired,
  page: _propTypes2.default.number,
  qsFilterParamNames: _propTypes2.default.array,
  selectionMode: _propTypes2.default.oneOf(['single', 'multiple']),
  topbarTitle: _propTypes2.default.string
};

PagedListView.defaultProps = {
  itemProps: {}
};

exports.default = (0, _withStyles2.default)(function (theme) {
  return {};
})(PagedListView);