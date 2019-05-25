'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _FormField = require('./FormField');

var _FormField2 = _interopRequireDefault(_FormField);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function FormFieldSet(props) {
  var errors = props.errors,
      fieldArrangementMap = props.fieldArrangementMap,
      fieldInfoMap = props.fieldInfoMap,
      fieldNames = props.fieldNames,
      form = props.form,
      onFieldChange = props.onFieldChange;


  var handleFormFieldChange = function handleFormFieldChange(value, fieldInfo) {
    onFieldChange(value, fieldInfo);
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
      fields.push(_react2.default.createElement(_FormField2.default, {
        errorText: errors[fieldName],
        form: form,
        fieldInfo: fieldInfo,
        fieldArrangementInfo: fieldArrangementMap[fieldName],
        key: fieldName,
        onChange: handleFormFieldChange
      }));

      fieldCount += 1;
    }
  });

  return fields;
}

FormFieldSet.propTypes = {
  errors: _propTypes2.default.object,
  form: _propTypes2.default.object.isRequired,
  fieldArrangementMap: _propTypes2.default.object,
  fieldInfoMap: _propTypes2.default.object,
  fieldNames: _propTypes2.default.array,
  onFieldChange: _propTypes2.default.func.isRequired
};

exports.default = FormFieldSet;