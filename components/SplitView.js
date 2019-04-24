'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _styles = require('@material-ui/core/styles');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function SplitView(props) {
  var classes = props.classes;


  var children = _react2.default.Children.toArray(props.children);
  return _react2.default.createElement(
    'div',
    { className: classes.splitView },
    _react2.default.createElement(
      'div',
      { className: classes.sideBar },
      children[0]
    ),
    _react2.default.createElement(
      'div',
      { className: classes.mainContent },
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
    splitView: theme.splitView.root,
    sideBar: theme.splitView.sideBar,
    mainContent: theme.splitView.mainContent

  };
})(SplitView);