'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash.isequal');

var _lodash2 = _interopRequireDefault(_lodash);

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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ListView = function (_React$PureComponent) {
  _inherits(ListView, _React$PureComponent);

  function ListView(props) {
    _classCallCheck(this, ListView);

    var _this = _possibleConstructorReturn(this, (ListView.__proto__ || Object.getPrototypeOf(ListView)).call(this, props));

    _this.state = {
      redirectTo: null,
      selectedTabIndex: null
    };

    _this.syncItemStore = function () {
      if (_this.props.location.pathname !== _this.props.mountPath) {
        // Since this component may be mounted in the background, only respond
        // to location changes when it is "active"
        return;
      }

      var filterParams = _this.filterParams;
      var storeParams = _this.props.store.params;
      if (!filterParams || (0, _lodash2.default)(filterParams, storeParams)) {
        return;
      }

      _this.props.store.load(filterParams);
    };

    _this.constructTabConfigList();
    return _this;
  }

  _createClass(ListView, [{
    key: 'constructTabConfigList',
    value: function constructTabConfigList() {
      var _this2 = this;

      if (this.props.subsetArrangement) {
        var tabConfigList = [];
        var subsetArrangement = this.props.subsetArrangement;

        subsetArrangement.forEach(function (subset) {
          var path = _this2.props.mountPath;

          var subsetName = subset[0];
          if (subsetName) {
            path = path + '?subset=' + subsetName;
          }
          subset[1].path = path;

          tabConfigList.push({
            subsetName: subsetName,
            label: subset[1].tabLabel,
            path: path
          });
        });
        this.tabConfigList = tabConfigList;
        this.subsetArrangement = new Map(subsetArrangement);
      } else {
        this.subsetArrangement = null;
        this.tabConfigList = null;
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      if (this.subsetArrangement) {
        var tabIndex = (0, _map.indexOfKey)(this.subsetKey, this.subsetArrangement);
        if (tabIndex === -1) {
          // Decide whether we need to redirect.
          // This will be the case when a subset arrangement is in effect and the
          // querystring param does not match any of the existing subset names.
          if (!this.state.redirectTo) {
            var firstSubsetKey = this.subsetArrangement.keys().next().value;
            var subsetConfig = this.subsetArrangement.get(firstSubsetKey);
            this.setState({ redirectTo: subsetConfig.path });
          } else {
            this.setState({ redirectTo: null });
          }
        } else {
          this.syncItemStore();
          if (tabIndex !== this.state.selectedTabIndex) {
            this.setState({ selectedTabIndex: tabIndex });
            if (this.props.onTabChange) {
              this.props.onTabChange(tabIndex, this.state.selectedTabIndex);
            }
          }
        }
      } else {
        this.syncItemStore();
      }
    }
  }, {
    key: 'render',
    value: function render() {
      if (this.state.redirectTo) {
        return _react2.default.createElement(_reactRouterDom.Redirect, { to: this.state.redirectTo });
      }

      return _react2.default.createElement(
        _react2.default.Fragment,
        null,
        this.tabs,
        _react2.default.createElement(_VirtualizedList2.default, {
          componentForItem: this.props.listItemComponent,
          store: this.props.store,
          itemContextProvider: this.props.itemContextProvider,
          itemProps: this.props.itemProps,
          onItemClick: this.props.onItemClick,
          onSelectionChange: this.props.onSelectionChange,
          selectionMode: this.props.selectionMode
        })
      );
    }
  }, {
    key: 'tabs',
    get: function get() {
      var _this3 = this;

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
            className: _this3.props.classes.tab,
            key: tabConfig.subsetName,
            label: tabConfig.label,
            to: tabConfig.path
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
      var _props = this.props,
          filterParams = _props.filterParams,
          qsFilterParamNames = _props.qsFilterParamNames;


      var params = filterParams || {};
      if (qsFilterParamNames) {
        Object.assign(params, (0, _object.filterByKeys)(this.qsParams, qsFilterParamNames));
      }

      var arrangementInfo = this.activeTabArrangement;
      if (arrangementInfo) {
        Object.assign(params, arrangementInfo.apiQueryParams);
      }

      return params;
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
  itemProps: _propTypes2.default.object,
  onItemClick: _propTypes2.default.func,
  onSelectionChange: _propTypes2.default.func,
  onTabChange: _propTypes2.default.func,
  location: _propTypes2.default.object.isRequired,
  mountPath: _propTypes2.default.string.isRequired,
  qsFilterParamNames: _propTypes2.default.array,
  selectionMode: _propTypes2.default.oneOf(['single', 'multiple']),
  subsetArrangement: _propTypes2.default.array,
  topbarTitle: _propTypes2.default.string
};

ListView.defaultProps = {
  itemProps: {}
};

exports.default = (0, _withStyles2.default)(function (theme) {
  return {
    tabs: {
      backgroundColor: '#fafafa',
      borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
    },
    tab: {
      minWidth: 100
    }
  };
})(ListView);