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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function FormFieldSet(props) {
  var classes = props.classes,
      errors = props.errors,
      fieldArrangementMap = props.fieldArrangementMap,
      fieldInfoMap = props.fieldInfoMap,
      fieldNames = props.fieldNames,
      form = props.form;


  var formData = form.state.formData;

  var fields = [];
  fieldNames.forEach(function (fieldName) {
    var fieldInfo = fieldInfoMap[fieldName];
    if (!fieldInfo.read_only) {
      var field = null;
      var value = formData[fieldName];
      var label = fieldInfo.ui ? fieldInfo.ui.label : null;

      var commonFieldProps = {
        key: fieldName,
        label: label,
        name: fieldName
      };

      if (fieldInfo.hidden) {
        field = _react2.default.createElement('input', _extends({ type: 'hidden' }, commonFieldProps));
      } else if (fieldInfo.type === 'itemlist') {
        var fieldArrangementInfo = fieldArrangementMap[fieldName];

        field = _react2.default.createElement(_ItemListField2.default, _extends({
          items: value,
          listUrl: fieldInfo.related_endpoint.singular + '/',
          onChange: function onChange(value) {
            form.setValue(fieldName, value);
          }
        }, commonFieldProps, fieldArrangementInfo));
      } else {
        var textFieldProps = _extends({}, commonFieldProps, {
          disabled: props.saving,
          fullWidth: true,
          InputLabelProps: { classes: { root: classes.inputLabel } },
          margin: "normal",
          onChange: function onChange(e) {
            form.setValue(fieldName, e.target.value);
          },
          value: value,
          variant: "outlined"
        });

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
  form: _propTypes2.default.object.isRequired,
  fieldArrangementMap: _propTypes2.default.object,
  fieldInfoMap: _propTypes2.default.object,
  fieldNames: _propTypes2.default.array,
  saving: _propTypes2.default.bool
};

exports.default = (0, _withStyles2.default)(function (theme) {
  return theme.form;
})(FormFieldSet);