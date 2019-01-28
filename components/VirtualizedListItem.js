'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ListItem = require('@material-ui/core/ListItem');

var _ListItem2 = _interopRequireDefault(_ListItem);

var _withStyles = require('@material-ui/core/styles/withStyles');

var _withStyles2 = _interopRequireDefault(_withStyles);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; } /**
                                                                                                                                                                                                                             *
                                                                                                                                                                                                                             * VirtualizedListItem
                                                                                                                                                                                                                             *
                                                                                                                                                                                                                             */

function VirtualizedListItem(props) {
  var classes = props.classes,
      contextProvider = props.contextProvider,
      onItemClick = props.onItemClick,
      rest = _objectWithoutProperties(props, ['classes', 'contextProvider', 'onItemClick']);

  var listItemProps = {};
  if (onItemClick) {
    listItemProps.onClick = function (e) {
      onItemClick(props.item);
    };
  }

  return _react2.default.createElement(
    _ListItem2.default,
    _extends({}, listItemProps, rest),
    props.children
  );
}

VirtualizedListItem.propTypes = {
  classes: _propTypes2.default.object,
  contextProvider: _propTypes2.default.func
};

exports.default = (0, _withStyles2.default)({
  radioButton: {
    padding: 8
  }
})(VirtualizedListItem);