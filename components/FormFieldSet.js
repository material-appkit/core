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
      form = props.form,
      widgets = props.widgets;
  var formData = form.state.formData;

  /**
   * Given a field's metadata description, construct a component widget
   * @param fieldInfo
   */

  var constructFormField = function constructFormField(fieldInfo) {
    var fieldName = fieldInfo.key;
    var fieldValue = formData[fieldName];

    var _ref = fieldInfo.ui || {},
        label = _ref.label,
        widget = _ref.widget;

    var WidgetComponent = widgets[fieldName];
    if (WidgetComponent) {
      // If a widget component has been been specified, use it
      console.log(WidgetComponent);
    }

    if (fieldInfo.hidden) {
      return _react2.default.createElement('input', _extends({ type: 'hidden' }, commonFieldProps));
    }

    var commonFieldProps = {
      key: fieldName,
      label: label,
      name: fieldName
    };

    if (widget === 'itemlist') {
      var fieldArrangementInfo = fieldArrangementMap[fieldName];
      return _react2.default.createElement(_ItemListField2.default, _extends({
        items: fieldValue,
        listUrl: fieldInfo.related_endpoint.singular + '/',
        onChange: function onChange(value) {
          form.setValue(fieldName, value);
        }
      }, commonFieldProps, fieldArrangementInfo));
    }

    var textFieldProps = _extends({}, commonFieldProps, {
      disabled: props.saving,
      fullWidth: true,
      InputLabelProps: { classes: { root: classes.inputLabel } },
      margin: "normal",
      onChange: function onChange(e) {
        form.setValue(fieldName, e.target.value);
      },
      type: fieldInfo.type,
      value: fieldValue,
      variant: "outlined"
    });

    if (fieldInfo.choices) {
      textFieldProps.select = true;
      textFieldProps.SelectProps = { native: true };
    } else {
      if (widget === 'textarea') {
        textFieldProps.multiline = true;
        textFieldProps.rows = 2;
        textFieldProps.rowsMax = 20;
      }
    }

    if (fieldInfo.type === 'number') {
      textFieldProps.inputProps = { min: 0, step: 'any' };
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
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = fieldNames[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var fieldName = _step.value;

      var fieldInfo = fieldInfoMap[fieldName];
      if (fieldInfo.read_only) {
        continue;
      }

      var field = constructFormField(fieldInfo);
      fields.push((0, _component.decorateErrors)(field, errors));
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return fields;
}

FormFieldSet.propTypes = {
  classes: _propTypes2.default.object.isRequired,
  errors: _propTypes2.default.object,
  form: _propTypes2.default.object.isRequired,
  fieldArrangementMap: _propTypes2.default.object,
  fieldInfoMap: _propTypes2.default.object,
  fieldNames: _propTypes2.default.array,
  saving: _propTypes2.default.bool,
  widgets: _propTypes2.default.object.isRequired
};

exports.default = (0, _withStyles2.default)(function (theme) {
  return theme.form;
})(FormFieldSet);