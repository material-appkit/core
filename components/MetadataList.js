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

var _reactRouterDom = require('react-router-dom');

var _Link = require('@material-ui/core/Link');

var _Link2 = _interopRequireDefault(_Link);

var _List = require('@material-ui/core/List');

var _List2 = _interopRequireDefault(_List);

var _ListItem = require('@material-ui/core/ListItem');

var _ListItem2 = _interopRequireDefault(_ListItem);

var _ListItemText = require('@material-ui/core/ListItemText');

var _ListItemText2 = _interopRequireDefault(_ListItemText);

var _Typography = require('@material-ui/core/Typography');

var _Typography2 = _interopRequireDefault(_Typography);

var _withStyles = require('@material-ui/core/styles/withStyles');

var _withStyles2 = _interopRequireDefault(_withStyles);

var _object = require('../util/object');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// -----------------------------------------------------------------------------
var MetadataListItem = (0, _withStyles2.default)({
  listItemRoot: {
    padding: '2px 0'
  },

  listItemTextRoot: {
    padding: 0
  },

  listItemTextPrimary: {
    fontSize: '0.85rem'
  },

  label: {
    fontSize: '0.85rem',
    fontWeight: 600,
    "&:after": {
      content: '":"'
    },
    marginRight: 5
  }
})(function (props) {
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

  var PrimaryComponent = _Typography2.default;
  var primaryComponentProps = {};
  if (fieldInfo.type === 'link' && representedObject.path) {
    PrimaryComponent = _Link2.default;
    primaryComponentProps.component = _reactRouterDom.Link;
    primaryComponentProps.to = representedObject.path;
  }

  var primaryContent = _react2.default.createElement(
    PrimaryComponent,
    primaryComponentProps,
    value
  );

  return _react2.default.createElement(
    _ListItem2.default,
    { classes: { root: classes.listItemRoot } },
    _react2.default.createElement(
      _Typography2.default,
      { className: classes.label },
      label
    ),
    _react2.default.createElement(_ListItemText2.default, {
      classes: {
        root: classes.listItemTextRoot,
        primary: classes.listItemTextPrimary
      },
      primary: primaryContent
    })
  );
});

MetadataListItem.propTypes = {
  classes: _propTypes2.default.object.isRequired,
  fieldInfo: _propTypes2.default.object.isRequired,
  nullValue: _propTypes2.default.string,
  representedObject: _propTypes2.default.object.isRequired
};

// -----------------------------------------------------------------------------
function MetadataList(props) {
  return _react2.default.createElement(
    _List2.default,
    { disablePadding: true },
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

exports.default = MetadataList;