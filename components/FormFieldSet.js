'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _TextField = require('@material-ui/core/TextField');

var _TextField2 = _interopRequireDefault(_TextField);

var _withStyles = require('@material-ui/core/styles/withStyles');

var _withStyles2 = _interopRequireDefault(_withStyles);

var _component = require('../util/component');

var _ItemListField = require('./ItemListField');

var _ItemListField2 = _interopRequireDefault(_ItemListField);

var _object = require('../util/object');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function FormFieldSet(props) {
  var classes = props.classes,
      errors = props.errors,
      fieldArrangementMap = props.fieldArrangementMap,
      fieldInfoMap = props.fieldInfoMap,
      fieldNames = props.fieldNames,
      representedObject = props.representedObject;


  var fields = [];
  fieldNames.forEach(function (fieldName) {
    var fieldInfo = fieldInfoMap[fieldName];
    if (!fieldInfo.read_only) {
      var field = null;
      var fieldArrangementInfo = fieldArrangementMap[fieldName];

      // Establish the field's default value by _EITHER_ following a given key path
      // from the field arrangement or simply the parameter
      var defaultValueKeyPath = fieldArrangementInfo.defaultValueKeyPath || fieldName;
      var defaultValue = (0, _object.valueForKeyPath)(representedObject, defaultValueKeyPath) || '';

      if (fieldInfo.hidden) {
        field = _react2.default.createElement('input', { type: 'hidden', name: fieldName, defaultValue: defaultValue });
      } else if (fieldInfo.type === 'itemlist') {
        field = _react2.default.createElement(_ItemListField2.default, _extends({
          defaultItems: representedObject[fieldName],
          key: fieldName,
          listUrl: fieldInfo.related_endpoint.singular + '/',
          name: fieldName,
          label: fieldInfo.ui.label
        }, fieldArrangementInfo));
      } else {
        var textFieldProps = {
          disabled: props.saving,
          key: fieldName,
          fullWidth: true,
          InputLabelProps: { classes: { root: classes.inputLabel } },
          label: fieldInfo.ui.label,
          margin: "normal",
          name: fieldName,
          defaultValue: defaultValue,
          variant: "outlined"
        };

        if (fieldInfo.choices) {
          textFieldProps.select = true;
          textFieldProps.SelectProps = { native: true };
        } else {
          var inputType = fieldInfo.type;
          if (inputType === 'textarea') {
            textFieldProps.multiline = true;
            textFieldProps.rows = 2;
            textFieldProps.rowsMax = 20;
          } else {
            textFieldProps.type = inputType;
          }
        }

        if (fieldInfo.type === 'number') {
          textFieldProps.inputProps = { min: 0, step: 'any' };
        }

        field = _react2.default.createElement(
          _TextField2.default,
          textFieldProps,
          fieldInfo.choices && _react2.default.createElement(
            _react2.default.Fragment,
            null,
            _react2.default.createElement('option', null),
            fieldInfo.choices.map(function (choice) {
              return _react2.default.createElement(
                'option',
                { key: choice.value, value: choice.value },
                choice.label
              );
            })
          )
        );
      }

      fields.push((0, _component.decorateErrors)(field, errors));
    }
  });

  return fields;
}

FormFieldSet.propTypes = {
  classes: _propTypes2.default.object.isRequired,
  errors: _propTypes2.default.object,
  fieldArrangementMap: _propTypes2.default.object,
  fieldInfoMap: _propTypes2.default.object,
  fieldNames: _propTypes2.default.array,
  representedObject: _propTypes2.default.object,
  saving: _propTypes2.default.bool
};

exports.default = (0, _withStyles2.default)(function (theme) {
  return theme.form;
})(FormFieldSet);