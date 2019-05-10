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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fromRepresentation = function fromRepresentation(fieldInfo, value) {
  if (fieldInfo.type === 'checkbox') {
    switch (value) {
      case true:
      case 'true':
      case 'True':
        return 'true';
      case false:
      case 'false':
      case 'False':
      case '':
        return 'false';
      default:
        break;
    }
  }
  return value;
};

function FormFieldSet(props) {
  var classes = props.classes,
      errors = props.errors,
      fieldArrangementMap = props.fieldArrangementMap,
      fieldInfoMap = props.fieldInfoMap,
      fieldNames = props.fieldNames,
      form = props.form;
  var formData = form.state.formData;

  /**
   * Given a field's metadata description, construct a component widget
   * @param fieldInfo
   */

  var constructFormField = function constructFormField(fieldInfo) {
    var fieldName = fieldInfo.key;
    var fieldValue = fromRepresentation(fieldInfo, formData[fieldName]);
    var fieldArrangementInfo = fieldArrangementMap[fieldName];

    var _fieldInfo$ui = fieldInfo.ui,
        autoFocus = _fieldInfo$ui.autoFocus,
        label = _fieldInfo$ui.label,
        widget = _fieldInfo$ui.widget;

    var commonFieldProps = {
      autoFocus: autoFocus,
      key: fieldName,
      label: label,
      value: fieldValue,
      name: fieldName
    };

    if (fieldInfo.hidden || widget === 'hidden') {
      return _react2.default.createElement('input', _extends({ type: 'hidden' }, commonFieldProps));
    }

    var WidgetComponent = fieldArrangementInfo.widget;
    if (!WidgetComponent) {
      WidgetComponent = form.constructor.widgetClassForType(widget);
    }
    if (WidgetComponent) {
      // If a widget component has been been specified, use it
      return _react2.default.createElement(WidgetComponent, _extends({
        fieldInfo: fieldInfo,
        onChange: function onChange(value) {
          form.setValue(fieldName, value);
        }
      }, commonFieldProps, fieldArrangementInfo));
    }

    var textFieldProps = _extends({}, commonFieldProps, {
      fullWidth: true,
      InputLabelProps: { classes: { root: classes.inputLabel } },
      margin: "normal",
      onChange: function onChange(e) {
        form.setValue(fieldName, e.target.value);
      },
      type: fieldInfo.type,
      variant: "outlined"
    });

    if (fieldInfo.choices) {
      textFieldProps.select = true;
      textFieldProps.SelectProps = { native: true };
    }

    if (widget === 'textarea') {
      textFieldProps.multiline = true;
      textFieldProps.rows = 2;
      textFieldProps.rowsMax = 20;
    }

    if (fieldInfo.type === 'number') {
      // Let numbers be input in any form
      textFieldProps.inputProps = { min: 0, step: 'any' };
    }

    if (fieldInfo.type === 'checkbox') {
      // Let boolean fields be rendered as a select element
      // with Yes/No as choices.
      textFieldProps.select = true;
      textFieldProps.SelectProps = { native: true };
      fieldInfo.choices = [{ 'label': 'Yes', value: 'true' }, { 'label': 'No', value: 'false' }];
    }

    return _react2.default.createElement(
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
  };

  var fields = [];
  var fieldCount = 0;
  fieldNames.forEach(function (fieldName, fieldIndex) {
    var fieldInfo = fieldInfoMap[fieldName];
    if (!fieldInfo.read_only) {
      if (!fieldInfo.ui) {
        fieldInfo.ui = {};
      }
      if (fieldCount === 0) {
        fieldInfo.ui.autoFocus = true;
      }
      var field = constructFormField(fieldInfo);
      fields.push((0, _component.decorateErrors)(field, errors));
      fieldCount += 1;
    }
  });

  return fields;
}

FormFieldSet.propTypes = {
  classes: _propTypes2.default.object.isRequired,
  errors: _propTypes2.default.object,
  form: _propTypes2.default.object.isRequired,
  fieldArrangementMap: _propTypes2.default.object,
  fieldInfoMap: _propTypes2.default.object,
  fieldNames: _propTypes2.default.array
};

exports.default = (0, _withStyles2.default)(function (theme) {
  return theme.form;
})(FormFieldSet);