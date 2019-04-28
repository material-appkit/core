import PropTypes from 'prop-types';
import React from 'react';

import TextField from '@material-ui/core/TextField';
import withStyles from '@material-ui/core/styles/withStyles';

import { decorateErrors } from '../util/component';

const fromRepresentation = (fieldInfo, value) => {
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
  const {
    classes,
    errors,
    fieldArrangementMap,
    fieldInfoMap,
    fieldNames,
    form,
  } = props;

  const { formData } = form.state;

  /**
   * Given a field's metadata description, construct a component widget
   * @param fieldInfo
   */

  const constructFormField = (fieldInfo)  => {
    const fieldName = fieldInfo.key;
    const fieldValue = fromRepresentation(fieldInfo, formData[fieldName]);
    const fieldArrangementInfo = fieldArrangementMap[fieldName];

    const { label, widget } = fieldInfo.ui || {};
    const commonFieldProps = {
      key: fieldName,
      label,
      value: fieldValue,
      name: fieldName,
    };

    if (fieldInfo.hidden || widget === 'hidden') {
      return <input type="hidden" {...commonFieldProps} />;
    }

    let WidgetComponent = fieldArrangementInfo.widget;
    if (!WidgetComponent) {
      WidgetComponent = form.constructor.widgetClassForType(widget);
    }
    if (WidgetComponent) {
      // If a widget component has been been specified, use it
      return (
        <WidgetComponent
          fieldInfo={fieldInfo}
          onChange={(value) => { form.setValue(fieldName, value); }}
          {...commonFieldProps}
          {...fieldArrangementInfo}
        />
      );
    }

    const textFieldProps = {
      ...commonFieldProps,
      fullWidth: true,
      InputLabelProps: { classes: { root: classes.inputLabel } },
      margin: "normal",
      onChange: (e) => { form.setValue(fieldName, e.target.value); },
      type: fieldInfo.type,
      variant: "outlined",
    };

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
      fieldInfo.choices = [
        { 'label': 'Yes', value: 'true' },
        { 'label': 'No', value: 'false' },
      ]
    }

    return (
      <TextField {...textFieldProps }>
        {fieldInfo.choices &&
          <React.Fragment>
            <option />
            {fieldInfo.choices.map((choice) => (
              <option key={choice.value} value={choice.value}>{choice.label}</option>
            ))}
          </React.Fragment>
        }
      </TextField>
    );
  };

  const fields = [];
  for (const fieldName of fieldNames) {
    const fieldInfo = fieldInfoMap[fieldName];
    if (fieldInfo.read_only) {
      continue;
    }

    const field = constructFormField(fieldInfo);
    fields.push(decorateErrors(field, errors));
  }

  return fields;
}

FormFieldSet.propTypes = {
  classes: PropTypes.object.isRequired,
  errors: PropTypes.object,
  form: PropTypes.object.isRequired,
  fieldArrangementMap: PropTypes.object,
  fieldInfoMap: PropTypes.object,
  fieldNames: PropTypes.array,
};

export default withStyles((theme) => {
  return theme.form;
})(FormFieldSet);
