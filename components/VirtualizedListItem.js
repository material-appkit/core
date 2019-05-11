'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Checkbox = require('@material-ui/core/Checkbox');

var _Checkbox2 = _interopRequireDefault(_Checkbox);

var _ListItem = require('@material-ui/core/ListItem');

var _ListItem2 = _interopRequireDefault(_ListItem);

var _Radio = require('@material-ui/core/Radio');

var _Radio2 = _interopRequireDefault(_Radio);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; } /**
                                                                                                                                                                                                                             *
                                                                                                                                                                                                                             * VirtualizedListItem
                                                                                                                                                                                                                             *
                                                                                                                                                                                                                             */

function VirtualizedListItem(props) {
  var item = props.item,
      contextProvider = props.contextProvider,
      onItemClick = props.onItemClick,
      onSelectionChange = props.onSelectionChange,
      selectionMode = props.selectionMode,
      selectOnClick = props.selectOnClick,
      rest = _objectWithoutProperties(props, ['item', 'contextProvider', 'onItemClick', 'onSelectionChange', 'selectionMode', 'selectOnClick']);

  var listItemProps = {};
  if (contextProvider) {
    listItemProps = contextProvider(item);
  }

  listItemProps.onClick = function () {
    if (selectOnClick && onSelectionChange) {
      onSelectionChange(item);
    }

    if (onItemClick) {
      onItemClick(item);
    }
  };

  var handleSelectionControlClick = function handleSelectionControlClick(e) {
    e.preventDefault();

    if (onSelectionChange) {
      onSelectionChange(item);
    }
  };

  var selectionControl = null;
  if (selectionMode === 'single') {
    selectionControl = _react2.default.createElement(_Radio2.default, {
      checked: props.selected,
      style: { padding: 8 },
      onClick: handleSelectionControlClick
    });
  }
  if (selectionMode === 'multiple') {
    selectionControl = _react2.default.createElement(_Checkbox2.default, {
      checked: props.selected,
      style: { padding: 8 },
      onClick: handleSelectionControlClick
    });
  }

  return _react2.default.createElement(
    _ListItem2.default,
    _extends({}, listItemProps, rest),
    selectionControl,
    props.children
  );
}

VirtualizedListItem.propTypes = {
  contextProvider: _propTypes2.default.func,
  onItemClick: _propTypes2.default.func,
  onSelectionChange: _propTypes2.default.func,
  selected: _propTypes2.default.bool,
  selectOnClick: _propTypes2.default.bool,
  selectionMode: _propTypes2.default.oneOf(['single', 'multiple'])
};

exports.default = VirtualizedListItem;