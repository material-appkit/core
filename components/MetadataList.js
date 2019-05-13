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

var _ListItemIcon = require('@material-ui/core/ListItemIcon');

var _ListItemIcon2 = _interopRequireDefault(_ListItemIcon);

var _ListItemText = require('@material-ui/core/ListItemText');

var _ListItemText2 = _interopRequireDefault(_ListItemText);

var _Typography = require('@material-ui/core/Typography');

var _Typography2 = _interopRequireDefault(_Typography);

var _withStyles = require('@material-ui/core/styles/withStyles');

var _withStyles2 = _interopRequireDefault(_withStyles);

var _object = require('../util/object');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// -----------------------------------------------------------------------------
function _MetadataListItem(props) {
  var classes = props.classes,
      fieldInfo = props.fieldInfo,
      representedObject = props.representedObject;


  function renderValue(value) {
    if (Array.isArray(value)) {
      return value.map(function (item) {
        return _react2.default.createElement(
          _ListItem2.default,
          { key: item.id, classes: { root: classes.nestedListItemRoot } },
          renderValue(item)
        );
      });
    } else if (fieldInfo.transform) {
      return fieldInfo.transform(value);
    } else if (fieldInfo.dateFormat) {
      return (0, _moment2.default)(value).format(fieldInfo.dateFormat);
    } else if (fieldInfo.keyPath) {
      return (0, _object.valueForKeyPath)(value, fieldInfo.keyPath);
    } else {
      return value;
    }
  }

  var value = representedObject[fieldInfo.name];
  if (value === undefined || value === null || Array.isArray(value) && !value.length) {
    if (!fieldInfo.nullValue) {
      // If no value exists for the given field and nothing has been specified
      // to display for null values, returning null skips rendering of the list item.
      return null;
    } else {
      value = fieldInfo.nullValue;
    }
  }

  var LabelContent = fieldInfo.label;
  if (LabelContent === undefined) {
    LabelContent = (0, _titleCase2.default)(fieldInfo.name);
  }

  var labelComponent = null;
  if (LabelContent) {
    if (typeof LabelContent === 'string') {
      labelComponent = _react2.default.createElement(
        _Typography2.default,
        { className: classes.label },
        LabelContent
      );
    } else {
      labelComponent = _react2.default.createElement(
        _ListItemIcon2.default,
        { classes: { root: classes.listItemIconRoot } },
        _react2.default.createElement(LabelContent, { className: classes.listItemIcon })
      );
    }
  }

  var PrimaryComponent = _Typography2.default;
  var primaryComponentProps = {};
  if (fieldInfo.type === 'link' && value.path) {
    PrimaryComponent = _Link2.default;
    primaryComponentProps.component = _reactRouterDom.Link;
    primaryComponentProps.to = value.path;
  } else if (Array.isArray(value)) {
    PrimaryComponent = _List2.default;
    primaryComponentProps.disablePadding = true;
  }

  return _react2.default.createElement(
    _ListItem2.default,
    { classes: { root: classes.listItemRoot } },
    labelComponent,
    _react2.default.createElement(_ListItemText2.default, {
      classes: { root: classes.listItemTextRoot },
      disableTypography: true,
      primary: _react2.default.createElement(
        PrimaryComponent,
        primaryComponentProps,
        renderValue(value)
      )
    })
  );
}

_MetadataListItem.propTypes = {
  classes: _propTypes2.default.object.isRequired,
  fieldInfo: _propTypes2.default.object.isRequired,
  nullValue: _propTypes2.default.string,
  representedObject: _propTypes2.default.object.isRequired
};

var MetadataListItem = (0, _withStyles2.default)(function (theme) {
  return {
    listItemRoot: {
      display: 'flex',
      padding: '1px 0'
    },

    listItemIconRoot: {
      marginRight: 5
    },

    listItemIcon: {
      height: 18,
      width: 18
    },

    listItemTextRoot: {
      padding: 0
    },

    label: {
      fontWeight: 500,
      marginRight: 5,
      "&:after": {
        content: '":"'
      }
    },

    nestedListItemRoot: {
      display: 'inline',
      fontSize: '0.875rem',
      padding: 0,
      '&:not(:last-child)': {
        marginRight: 5,
        '&:after': {
          content: '","'
        }
      }
    },

    nestedListItemTextRoot: {
      padding: 0
    },

    nestedListItemContent: {
      display: 'inline'
    }

  };
})(_MetadataListItem);

// -----------------------------------------------------------------------------
var listItemKey = function listItemKey(fieldInfo) {
  var key = fieldInfo.name;
  if (fieldInfo.keyPath) {
    key = key + '-' + fieldInfo.keyPath;
  }
  return key;
};

function MetadataList(props) {
  return _react2.default.createElement(
    _List2.default,
    { disablePadding: true },
    props.arrangement.map(function (fieldInfo) {
      return _react2.default.createElement(MetadataListItem, {
        key: listItemKey(fieldInfo),
        fieldInfo: fieldInfo,
        representedObject: props.representedObject
      });
    })
  );
}

MetadataList.propTypes = {
  arrangement: _propTypes2.default.array.isRequired,
  representedObject: _propTypes2.default.object.isRequired
};

exports.default = MetadataList;