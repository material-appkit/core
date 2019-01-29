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

var _Button = require('@material-ui/core/Button');

var _Button2 = _interopRequireDefault(_Button);

var _ClickAwayListener = require('@material-ui/core/ClickAwayListener');

var _ClickAwayListener2 = _interopRequireDefault(_ClickAwayListener);

var _Grow = require('@material-ui/core/Grow');

var _Grow2 = _interopRequireDefault(_Grow);

var _IconButton = require('@material-ui/core/IconButton');

var _IconButton2 = _interopRequireDefault(_IconButton);

var _ListItemIcon = require('@material-ui/core/ListItemIcon');

var _ListItemIcon2 = _interopRequireDefault(_ListItemIcon);

var _ListItemText = require('@material-ui/core/ListItemText');

var _ListItemText2 = _interopRequireDefault(_ListItemText);

var _MenuItem = require('@material-ui/core/MenuItem');

var _MenuItem2 = _interopRequireDefault(_MenuItem);

var _MenuList = require('@material-ui/core/MenuList');

var _MenuList2 = _interopRequireDefault(_MenuList);

var _Paper = require('@material-ui/core/Paper');

var _Paper2 = _interopRequireDefault(_Paper);

var _Popper = require('@material-ui/core/Popper');

var _Popper2 = _interopRequireDefault(_Popper);

var _Toolbar = require('@material-ui/core/Toolbar');

var _Toolbar2 = _interopRequireDefault(_Toolbar);

var _Typography = require('@material-ui/core/Typography');

var _Typography2 = _interopRequireDefault(_Typography);

var _styles = require('@material-ui/core/styles');

var _KeyboardArrowRight = require('@material-ui/icons/KeyboardArrowRight');

var _KeyboardArrowRight2 = _interopRequireDefault(_KeyboardArrowRight);

var _MoreHoriz = require('@material-ui/icons/MoreHoriz');

var _MoreHoriz2 = _interopRequireDefault(_MoreHoriz);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NavigationController = function (_React$Component) {
  _inherits(NavigationController, _React$Component);

  function NavigationController(props) {
    _classCallCheck(this, NavigationController);

    var _this = _possibleConstructorReturn(this, (NavigationController.__proto__ || Object.getPrototypeOf(NavigationController)).call(this, props));

    _this.createContextMenu = function (topbarConfig) {
      if (!(topbarConfig && topbarConfig.contextMenuItems)) {
        return null;
      }

      return _react2.default.createElement(
        _react2.default.Fragment,
        null,
        _react2.default.createElement(
          _IconButton2.default,
          { onClick: function onClick(e) {
              _this.toggleContextMenu(e.target);
            } },
          _react2.default.createElement(_MoreHoriz2.default, null)
        ),
        _react2.default.createElement(
          _Popper2.default,
          {
            open: _this.state.contextMenuIsOpen,
            anchorEl: _this.state.contextMenuAnchorEl,
            transition: true,
            disablePortal: true
          },
          function (_ref) {
            var TransitionProps = _ref.TransitionProps,
                placement = _ref.placement;
            return _react2.default.createElement(
              _Grow2.default,
              _extends({}, TransitionProps, {
                style: { transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }
              }),
              _react2.default.createElement(
                _Paper2.default,
                null,
                _react2.default.createElement(
                  _ClickAwayListener2.default,
                  { onClickAway: function onClickAway() {
                      _this.toggleContextMenu(false);
                    } },
                  _react2.default.createElement(
                    _MenuList2.default,
                    null,
                    topbarConfig.contextMenuItems.map(_this.createContextMenuItem)
                  )
                )
              )
            );
          }
        )
      );
    };

    _this.createContextMenuItem = function (itemConfig) {
      var classes = _this.props.classes;

      var menuItemProps = {
        className: classes.contextMenuItem,
        key: itemConfig.key,
        onClick: function onClick() {
          _this.handleContextMenuClick(itemConfig);
        }
      };
      if (itemConfig.link) {
        menuItemProps.to = itemConfig.link;
        menuItemProps.component = _reactRouterDom.Link;
      }
      return _react2.default.createElement(
        _MenuItem2.default,
        menuItemProps,
        itemConfig.icon && _react2.default.createElement(
          _ListItemIcon2.default,
          { className: classes.contextMenuIcon },
          _react2.default.createElement(itemConfig.icon, null)
        ),
        _react2.default.createElement(_ListItemText2.default, { primary: itemConfig.title, className: classes.contextMenuText })
      );
    };

    _this.handleContextMenuClick = function (menuItemConfig) {
      if (menuItemConfig.onClick) {
        menuItemConfig.onClick(menuItemConfig);
      }
      _this.toggleContextMenu(false);
    };

    _this.toggleContextMenu = function (anchor) {
      if (anchor) {
        _this.setState({ contextMenuAnchorEl: anchor, contextMenuIsOpen: true });
      } else {
        _this.setState({ contextMenuAnchorEl: null, contextMenuIsOpen: false });
      }
    };

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

    _this.state = {
      contextMenuAnchorEl: null,
      contextMenuIsOpen: false
    };
    return _this;
  }

  _createClass(NavigationController, [{
    key: 'updateTopbarConfig',
    value: function updateTopbarConfig(viewControllerProps, path) {
      var topbarConfig = this.topbarConfigMap.get(path);

      var newTopbarConfig = {
        title: viewControllerProps.title,
        rightBarItem: viewControllerProps.rightBarItem,
        toolbarItems: viewControllerProps.toolbarItems,
        contextMenuItems: viewControllerProps.contextMenuItems
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
            { className: classes.navBar, disableGutters: true },
            _react2.default.createElement(
              _reactTabs.TabList,
              { className: classes.tabList },
              this.tabs
            ),
            this.rightBarItem
          ),
          this.contextToolbar
        ),
        _react2.default.createElement(
          'div',
          { style: { paddingTop: this.tabPanelContainerPaddingTop } },
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
        var contextMenu = null;

        if (i < matches.length - 1) {
          tabComponent = _react2.default.createElement(
            _react2.default.Fragment,
            null,
            _react2.default.createElement(
              _Button2.default,
              { component: _reactRouterDom.Link, to: match.url },
              title
            ),
            _react2.default.createElement(_KeyboardArrowRight2.default, null)
          );
        } else {
          tabComponent = _react2.default.createElement(
            _react2.default.Fragment,
            null,
            _react2.default.createElement(
              _Typography2.default,
              { className: classes.activeBreadCrumb },
              title
            ),
            _this3.createContextMenu(topbarConfig)
          );
        }

        return _react2.default.createElement(
          _reactTabs.Tab,
          { key: match.path, className: classes.tab },
          tabComponent
        );
      });
    }
  }, {
    key: 'activeTopBarConfig',
    get: function get() {
      var topbarConfig = null;
      if (this.props.matches.length) {
        var activeMatch = this.props.matches[this.props.matches.length - 1];
        topbarConfig = this.topbarConfigMap.get(activeMatch.path);
      }
      return topbarConfig || {};
    }
  }, {
    key: 'rightBarItem',
    get: function get() {
      return this.activeTopBarConfig.rightBarItem;
    }
  }, {
    key: 'toolbarItems',
    get: function get() {
      return this.activeTopBarConfig.toolbarItems;
    }
  }, {
    key: 'contextToolbar',
    get: function get() {
      var toolbarItems = this.toolbarItems;
      if (!toolbarItems) {
        return null;
      }

      return _react2.default.createElement(
        _Toolbar2.default,
        { variant: 'dense', className: this.props.classes.toolBar },
        toolbarItems
      );
    }
  }, {
    key: 'tabPanelContainerPaddingTop',
    get: function get() {
      var theme = this.props.theme.navigationController;

      var tabPanelContainerHeight = theme.navBar.height;
      if (this.contextToolbar) {
        tabPanelContainerHeight += theme.toolBar.height;
      }

      return tabPanelContainerHeight;
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
}, { withTheme: true })(NavigationController);