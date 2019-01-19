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

var _deepObjectDiff = require('deep-object-diff');

var _reactTabs = require('react-tabs');

var _AppBar = require('@material-ui/core/AppBar');

var _AppBar2 = _interopRequireDefault(_AppBar);

var _Toolbar = require('@material-ui/core/Toolbar');

var _Toolbar2 = _interopRequireDefault(_Toolbar);

var _styles = require('@material-ui/core/styles');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NavigationController = function (_React$Component) {
  _inherits(NavigationController, _React$Component);

  function NavigationController(props) {
    _classCallCheck(this, NavigationController);

    var _this = _possibleConstructorReturn(this, (NavigationController.__proto__ || Object.getPrototypeOf(NavigationController)).call(this, props));

    _this.viewControllerDidMount = function (viewController, path) {
      _this.topbarConfigMap.set(path, {});
      _this.updateTopbarConfig(viewController.props, path);
    };

    _this.viewControllerWillUnmount = function (viewController, path) {
      _this.topbarConfigMap.delete(path);
      _this.forceUpdate();
    };

    _this.viewControllerDidUpdate = function (viewController, path) {
      _this.updateTopbarConfig(viewController.props, path);
    };

    _this.topbarConfigMap = new Map();
    return _this;
  }

  _createClass(NavigationController, [{
    key: 'updateTopbarConfig',
    value: function updateTopbarConfig(viewControllerProps, path) {
      var topbarConfig = this.topbarConfigMap.get(path);

      var newTopbarConfig = {
        title: viewControllerProps.title,
        rightBarItem: viewControllerProps.rightBarItem
      };

      if (Object.keys((0, _deepObjectDiff.diff)(newTopbarConfig, topbarConfig)).length) {
        this.topbarConfigMap.set(path, newTopbarConfig);
        this.forceUpdate();
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var classes = this.props.classes;


      return _react2.default.createElement(
        _reactTabs.Tabs,
        {
          className: classes.tabs,
          forceRenderTabPanel: true,
          selectedIndex: this.props.matches.length - 1,
          onSelect: function onSelect() {}
        },
        _react2.default.createElement(
          _AppBar2.default,
          { color: 'default', position: 'fixed', className: classes.appBar },
          _react2.default.createElement(
            _Toolbar2.default,
            { className: classes.toolBar, disableGutters: true },
            _react2.default.createElement(
              _reactTabs.TabList,
              null,
              this.tabs
            ),
            this.rightBarItem
          )
        ),
        _react2.default.createElement(
          'main',
          { className: classes.main },
          this.props.matches.map(function (match) {
            return _react2.default.createElement(
              _reactTabs.TabPanel,
              { key: match.path },
              _react2.default.createElement(_reactRouterDom.Route, {
                key: match.path,
                path: match.path,
                render: function render(props) {
                  return _react2.default.createElement(match.component, _extends({
                    onMount: _this2.viewControllerDidMount,
                    onUnmount: _this2.viewControllerWillUnmount,
                    onUpdate: _this2.viewControllerDidUpdate,
                    mountPath: match.path
                  }, props));
                }
              })
            );
          })
        )
      );
    }
  }, {
    key: 'tabs',
    get: function get() {
      var _this3 = this;

      var classes = this.props.classes;


      var matches = this.props.matches;
      return matches.map(function (match, i) {
        var title = '';
        var topbarConfig = _this3.topbarConfigMap.get(match.path);
        if (topbarConfig && topbarConfig.title) {
          title = topbarConfig.title;
        }

        var tabComponent = null;
        if (i < matches.length - 1) {
          tabComponent = _react2.default.createElement(
            _reactRouterDom.Link,
            { to: match.url },
            title
          );
        } else {
          tabComponent = _react2.default.createElement(
            'span',
            { className: classes.activeTitle },
            title
          );
        }

        return _react2.default.createElement(
          _reactTabs.Tab,
          { key: match.path, className: _this3.props.classes.tab },
          tabComponent
        );
      });
    }
  }, {
    key: 'rightBarItem',
    get: function get() {
      if (this.props.matches.length) {
        var activeMatch = this.props.matches[this.props.matches.length - 1];
        var topbarConfig = this.topbarConfigMap.get(activeMatch.path);
        if (topbarConfig && topbarConfig.rightBarItem) {
          return topbarConfig.rightBarItem;
        }
      }

      return null;
    }
  }]);

  return NavigationController;
}(_react2.default.Component);

NavigationController.propTypes = {
  classes: _propTypes2.default.object.isRequired,
  matches: _propTypes2.default.array.isRequired
};

NavigationController.defaultProps = {
  matches: []
};

exports.default = (0, _styles.withStyles)(function (theme) {
  return theme.navigationController;
})(NavigationController);