import PropTypes from 'prop-types';
import React from 'react';

import TextField from '@material-ui/core/TextField';
import withStyles from '@material-ui/core/styles/withStyles';

import { decorateErrors } from '../util/component';

import ItemListField from './ItemListField';

function FormFieldSet(props) {
  const {
    classes,
    errors,
    fieldArrangementMap,
    fieldInfoMap,
    fieldNames,
    form,
    widgets,
  } = props;

  const { formData } = form.state;

  /**
   * Given a field's metadata description, construct a component widget
   * @param fieldInfo
   */

  const constructFormField = (fieldInfo)  => {
    const fieldName = fieldInfo.key;
    const fieldValue = formData[fieldName];
    const { label, widget } = fieldInfo.ui || {};

    const WidgetComponent = widgets[fieldName];
    if (WidgetComponent) {
      // If a widget component has been been specified, use it
      console.log(WidgetComponent);
    }

    if (fieldInfo.hidden) {
      return <input type="hidden" {...commonFieldProps} />;
    }

    const commonFieldProps = {
      key: fieldName,
      label,
      name: fieldName,
    };

    if (widget === 'itemlist') {
      const fieldArrangementInfo = fieldArrangementMap[fieldName];
      return (
        <ItemListField
          items={fieldValue}
          listUrl={`${fieldInfo.related_endpoint.singular}/`}
          onChange={(value) => { form.setValue(fieldName, value); }}
          {...commonFieldProps}
          {...fieldArrangementInfo}
        />
      );
    }

    const textFieldProps = {
      ...commonFieldProps,
      disabled: props.saving,
      fullWidth: true,
      InputLabelProps: { classes: { root: classes.inputLabel } },
      margin: "normal",
      onChange: (e) => { form.setValue(fieldName, e.target.value); },
      type: fieldInfo.type,
      value: fieldValue,
      variant: "outlined",
    };

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
  saving: PropTypes.bool,
  widgets: PropTypes.object.isRequired,
};

export default withStyles((theme) => {
  return theme.form;
})(FormFieldSet);
