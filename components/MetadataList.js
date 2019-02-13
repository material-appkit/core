'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _titleCase = require('title-case');

var _titleCase2 = _interopRequireDefault(_titleCase);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _withStyles = require('@material-ui/core/styles/withStyles');

var _withStyles2 = _interopRequireDefault(_withStyles);

var _object = require('../util/object');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// -----------------------------------------------------------------------------
function _MetadataListItem(props) {
  var classes = props.classes,
      fieldInfo = props.fieldInfo,
      nullValue = props.nullValue,
      representedObject = props.representedObject;


  var value = representedObject[fieldInfo.name];
  if (!value) {
    if (!nullValue) {
      // If no value exists for the given field and nothing has been specified
      // to display for null values, returning null skips rendering of the list item.
      return null;
    } else {
      value = nullValue;
    }
  }

  var listItemId = fieldInfo.name + 'MetadataListItem';

  var label = fieldInfo.label;
  if (label === undefined) {
    label = (0, _titleCase2.default)(fieldInfo.name);
  }

  if (fieldInfo.transform) {
    value = fieldInfo.transform(value);
  } else if (fieldInfo.dateFormat) {
    value = (0, _moment2.default)(value).format(fieldInfo.dateFormat);
  } else if (fieldInfo.keyPath) {
    value = (0, _object.valueForKeyPath)(value, fieldInfo.keyPath);
  }

  return _react2.default.createElement(
    'li',
    { key: fieldInfo.name, id: listItemId, className: classes.li },
    _react2.default.createElement(
      'label',
      { htmlFor: listItemId, className: classes.label },
      label
    ),
    value
  );
}

_MetadataListItem.propTypes = {
  classes: _propTypes2.default.object.isRequired,
  fieldInfo: _propTypes2.default.object.isRequired,
  nullValue: _propTypes2.default.string,
  representedObject: _propTypes2.default.object.isRequired
};

var MetadataListItem = (0, _withStyles2.default)({
  li: {
    fontSize: '0.85rem',
    margin: '2px 0'
  },

  label: {
    display: 'inline-block',
    fontWeight: 500,
    "&:after": {
      content: '":"'
    },
    marginRight: 5
  }
})(_MetadataListItem);

// -----------------------------------------------------------------------------
function MetadataList(props) {
  return _react2.default.createElement(
    'ul',
    null,
    props.arrangement.map(function (fieldInfo) {
      return _react2.default.createElement(MetadataListItem, {
        key: fieldInfo.name,
        fieldInfo: fieldInfo,
        nullValue: props.nullValue,
        representedObject: props.representedObject
      });
    })
  );
}

MetadataList.propTypes = {
  arrangement: _propTypes2.default.array.isRequired,
  nullValue: _propTypes2.default.string,
  representedObject: _propTypes2.default.object.isRequired
};

MetadataList.defaultProps = {
  nullValue: 'None'
};

exports.default = MetadataList;