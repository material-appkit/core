'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _queryString = require('query-string');

var _queryString2 = _interopRequireDefault(_queryString);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = require('react-router-dom');

var _Tabs = require('@material-ui/core/Tabs');

var _Tabs2 = _interopRequireDefault(_Tabs);

var _Tab = require('@material-ui/core/Tab');

var _Tab2 = _interopRequireDefault(_Tab);

var _withStyles = require('@material-ui/core/styles/withStyles');

var _withStyles2 = _interopRequireDefault(_withStyles);

var _VirtualizedList = require('./VirtualizedList');

var _VirtualizedList2 = _interopRequireDefault(_VirtualizedList);

var _map = require('../util/map');

var _object = require('../util/object');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ListView = function (_React$PureComponent) {
  _inherits(ListView, _React$PureComponent);

  function ListView(props) {
    var _this2 = this;

    _classCallCheck(this, ListView);

    var _this = _possibleConstructorReturn(this, (ListView.__proto__ || Object.getPrototypeOf(ListView)).call(this, props));

    _this.reloadItemStore = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var filterParams;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              filterParams = _this.filterParams;

              if (!filterParams) {
                _context.next = 3;
                break;
              }

              return _context.abrupt('return');

            case 3:
              _this.props.store.update(filterParams);

            case 4:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this2);
    }));


    _this.initializeTabConfigList();

    _this.state = {
      redirectUrl: null,
      selectedTabIndex: null
    };
    return _this;
  }

  _createClass(ListView, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.props.store.update(this.filterParams);
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      if (this.props.location.pathname !== this.props.mountPath) {
        // Since this component may be mounted in the background, only respond
        // to location changes when it is "active"
        return;
      }

      if (this.subsetArrangement) {
        var tabIndex = (0, _map.indexOfKey)(this.subsetKey, this.subsetArrangement);
        if (tabIndex === -1) {
          this.setState({ selectedTabIndex: 0 });
        } else {
          if (tabIndex !== this.state.selectedTabIndex) {
            this.setState({ selectedTabIndex: tabIndex });
          }
        }
      }

      this.props.store.update(this.filterParams);
    }
  }, {
    key: 'initializeTabConfigList',
    value: function initializeTabConfigList() {
      var _this3 = this;

      this.subsetArrangement = null;
      this.tabConfigList = null;

      if (this.props.subsetArrangement) {
        var tabConfigList = [];
        var subsetArrangement = this.props.subsetArrangement;
        subsetArrangement.forEach(function (subset) {
          var url = _this3.props.location.pathname;

          var subsetName = subset[0];
          if (subsetName) {
            url = url + '?subset=' + subsetName;
          }
          subset[1].url = url;

          tabConfigList.push({
            subsetName: subsetName,
            label: subset[1].tabLabel,
            url: url
          });
        });
        this.tabConfigList = tabConfigList;
        this.subsetArrangement = new Map(subsetArrangement);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        _react2.default.Fragment,
        null,
        this.tabs,
        _react2.default.createElement(_VirtualizedList2.default, {
          componentForItem: this.props.listItemComponent,
          store: this.props.store,
          itemContextProvider: this.props.itemContextProvider,
          onItemClick: this.props.onItemClick,
          selectionMode: this.props.selectionMode
        })
      );
    }
  }, {
    key: 'tabs',
    get: function get() {
      var _this4 = this;

      if (!this.tabConfigList || this.state.selectedTabIndex === null) {
        return null;
      }

      return _react2.default.createElement(
        _Tabs2.default,
        {
          className: this.props.classes.tabs,
          indicatorColor: 'primary',
          scrollButtons: 'auto',
          textColor: 'primary',
          value: this.state.selectedTabIndex,
          variant: 'scrollable'
        },
        this.tabConfigList.map(function (tabConfig) {
          return _react2.default.createElement(_Tab2.default, {
            component: _reactRouterDom.Link,
            className: _this4.props.classes.tab,
            key: tabConfig.subsetName,
            label: tabConfig.label,
            to: tabConfig.url
          });
        })
      );
    }
  }, {
    key: 'qsParams',
    get: function get() {
      return _queryString2.default.parse(this.props.location.search);
    }
  }, {
    key: 'subsetKey',
    get: function get() {
      return this.qsParams.subset || '';
    }
  }, {
    key: 'activeTabArrangement',
    get: function get() {
      if (!this.subsetArrangement) {
        return null;
      }

      return this.subsetArrangement.get(this.subsetKey);
    }
  }, {
    key: 'filterParams',
    get: function get() {
      var filterParams = (0, _object.filterByKeys)(this.qsParams, this.props.qsFilterParamNames);
      var arrangementInfo = this.activeTabArrangement;
      if (arrangementInfo) {
        Object.assign(filterParams, arrangementInfo.apiQueryParams);
      }

      return filterParams;
    }
  }]);

  return ListView;
}(_react2.default.PureComponent);

ListView.propTypes = {
  classes: _propTypes2.default.object,
  createURL: _propTypes2.default.string,
  listItemComponent: _propTypes2.default.func.isRequired,
  store: _propTypes2.default.object.isRequired,
  entityType: _propTypes2.default.string,
  filterParams: _propTypes2.default.object,
  itemContextProvider: _propTypes2.default.func,
  onItemClick: _propTypes2.default.func,
  location: _propTypes2.default.object.isRequired,
  mountPath: _propTypes2.default.string,
  qsFilterParamNames: _propTypes2.default.array,
  selectionMode: _propTypes2.default.oneOf(['single', 'multiple']),
  subsetArrangement: _propTypes2.default.array,
  topbarTitle: _propTypes2.default.string
};

ListView.defaultProps = {
  qsFilterParamNames: []
};

exports.default = (0, _withStyles2.default)(function (theme) {
  return {
    tabs: {
      backgroundColor: '#fafafa',
      borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
    },
    tab: {
      padding: '0 10px'
    }
  };
})(ListView);