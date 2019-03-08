'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _IconButton = require('@material-ui/core/IconButton');

var _IconButton2 = _interopRequireDefault(_IconButton);

var _ListItem = require('@material-ui/core/ListItem');

var _ListItem2 = _interopRequireDefault(_ListItem);

var _withStyles = require('@material-ui/core/styles/withStyles');

var _withStyles2 = _interopRequireDefault(_withStyles);

var _RadioButtonUnchecked = require('@material-ui/icons/RadioButtonUnchecked');

var _RadioButtonUnchecked2 = _interopRequireDefault(_RadioButtonUnchecked);

var _RadioButtonChecked = require('@material-ui/icons/RadioButtonChecked');

var _RadioButtonChecked2 = _interopRequireDefault(_RadioButtonChecked);

var _CheckBoxOutlineBlank = require('@material-ui/icons/CheckBoxOutlineBlank');

var _CheckBoxOutlineBlank2 = _interopRequireDefault(_CheckBoxOutlineBlank);

var _CheckBox = require('@material-ui/icons/CheckBox');

var _CheckBox2 = _interopRequireDefault(_CheckBox);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; } /**
                                                                                                                                                                                                                             *
                                                                                                                                                                                                                             * VirtualizedListItem
                                                                                                                                                                                                                             *
                                                                                                                                                                                                                             */

function VirtualizedListItem(props) {
  var classes = props.classes,
      item = props.item,
      contextProvider = props.contextProvider,
      onItemClick = props.onItemClick,
      onSelectControlClick = props.onSelectControlClick,
      selectionMode = props.selectionMode,
      rest = _objectWithoutProperties(props, ['classes', 'item', 'contextProvider', 'onItemClick', 'onSelectControlClick', 'selectionMode']);

  var listItemProps = {};
  if (contextProvider) {
    listItemProps = contextProvider(item);
  }

  if (onItemClick) {
    listItemProps.onClick = function () {
      onItemClick(item);
    };
  }

  var SelectionIcon = null;
  if (selectionMode === 'single') {
    SelectionIcon = props.selected ? _RadioButtonChecked2.default : _RadioButtonUnchecked2.default;
  } else if (selectionMode === 'multiple') {
    SelectionIcon = props.selected ? _CheckBox2.default : _CheckBoxOutlineBlank2.default;
  }

  return _react2.default.createElement(
    _ListItem2.default,
    _extends({}, listItemProps, rest),
    SelectionIcon && _react2.default.createElement(
      _IconButton2.default,
      {
        className: classes.selectionControl,
        onClick: function onClick(e) {
          e.preventDefault();
          onSelectControlClick(item);
        }
      },
      _react2.default.createElement(SelectionIcon, null)
    ),
    props.children
  );
}

VirtualizedListItem.propTypes = {
  classes: _propTypes2.default.object,
  contextProvider: _propTypes2.default.func,
  onItemClick: _propTypes2.default.func,
  onSelectControlClick: _propTypes2.default.func,
  selected: _propTypes2.default.bool,
  selectionMode: _propTypes2.default.oneOf(['single', 'multiple'])
};

exports.default = (0, _withStyles2.default)({
  selectionControl: {
    padding: 4
  }
})(VirtualizedListItem);