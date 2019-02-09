'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = require('react-router-dom');

var _Tabs = require('@material-ui/core/Tabs');

var _Tabs2 = _interopRequireDefault(_Tabs);

var _Tab = require('@material-ui/core/Tab');

var _Tab2 = _interopRequireDefault(_Tab);

var _styles = require('@material-ui/core/styles');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * TabView
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */

var TabView = function (_React$PureComponent) {
  _inherits(TabView, _React$PureComponent);

  function TabView() {
    _classCallCheck(this, TabView);

    return _possibleConstructorReturn(this, (TabView.__proto__ || Object.getPrototypeOf(TabView)).apply(this, arguments));
  }

  _createClass(TabView, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          classes = _props.classes,
          rest = _objectWithoutProperties(_props, ['classes']);

      var selectedTabIndex = this.selectedTabIndex;
      var activeTabConfig = this.props.tabArrangement[selectedTabIndex];

      var activeTabProps = activeTabConfig.componentProps || {};
      activeTabProps.mountPath = activeTabConfig.path;

      return _react2.default.createElement(
        _react2.default.Fragment,
        null,
        _react2.default.createElement(
          _Tabs2.default,
          {
            value: this.selectedTabIndex,
            className: classes.tabs,
            indicatorColor: 'primary',
            scrollButtons: 'auto',
            textColor: 'primary',
            variant: 'scrollable'
          },
          this.props.tabArrangement.map(function (tabConfig) {
            return _react2.default.createElement(_Tab2.default, {
              key: tabConfig.path,
              component: _reactRouterDom.Link,
              to: tabConfig.path,
              label: tabConfig.label
            });
          })
        ),
        _react2.default.createElement(activeTabConfig.component, _extends({}, activeTabProps, rest))
      );
    }
  }, {
    key: 'selectedTabIndex',
    get: function get() {
      var selectedTabIndex = 0;
      var currentLocationPath = this.props.location.pathname;
      this.props.tabArrangement.forEach(function (tabConfig, tabIndex) {
        if (currentLocationPath === tabConfig.path) {
          selectedTabIndex = tabIndex;
        }
      });
      return selectedTabIndex;
    }
  }]);

  return TabView;
}(_react2.default.PureComponent);

TabView.propTypes = {
  classes: _propTypes2.default.object.isRequired,
  location: _propTypes2.default.object.isRequired,
  tabArrangement: _propTypes2.default.array.isRequired
};

exports.default = (0, _styles.withStyles)({
  tabs: {
    backgroundColor: '#fafafa',
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
  },
  tab: {
    padding: '0 10px'
  }
})(TabView);