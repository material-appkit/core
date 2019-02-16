'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _SideBar = require('./SideBar');

var _SideBar2 = _interopRequireDefault(_SideBar);

var _styles = require('@material-ui/core/styles');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function SplitView(props) {
  var children = _react2.default.Children.toArray(props.children);
  return _react2.default.createElement(
    _react2.default.Fragment,
    null,
    _react2.default.createElement(
      _SideBar2.default,
      null,
      children[0]
    ),
    _react2.default.createElement(
      'div',
      { className: props.classes.mainContent },
      children[1]
    )
  );
}

SplitView.propTypes = {
  children: _propTypes2.default.array.isRequired,
  classes: _propTypes2.default.object
};

exports.default = (0, _styles.withStyles)(function (theme) {
  return {
    mainContent: _defineProperty({}, theme.breakpoints.up('md'), {
      marginRight: theme.sidebar.width
    })
  };
})(SplitView);