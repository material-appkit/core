import PropTypes from 'prop-types';
import React from 'react';

import Grid from '@material-ui/core/Grid';

import FormField from './FormField';
import { getFieldInfoMap, getFieldNames } from './Form';


const getFieldArrangementMap = (metadata, fieldArrangement, fieldInfoProvider) => {

  const fieldArrangementMap = {};
  if (fieldArrangement) {
    fieldArrangement.forEach((fieldInfo) => {
      if (typeof(fieldInfo) === 'string') {
        fieldInfo = { name: fieldInfo };
      }
      fieldArrangementMap[fieldInfo.name] = fieldInfo;
    });
  } else if (metadata) {
    metadata.forEach((fieldInfo) => {
      if (!fieldInfo.read_only) {
        const fieldName = fieldInfo.key;
        if (fieldInfoProvider) {
          fieldArrangementMap[fieldName] = fieldInfoProvider(fieldInfo);
        } else {
          fieldArrangementMap[fieldName] = { name: fieldName };
        }
      }
    });
  }
  return fieldArrangementMap;
};


function FormFieldSet(props) {
  const {
    errors,
    fieldArrangement,
    fieldInfoProvider,
    form,
    onFieldChange,
    metadata,
  } = props;

  const fieldInfoMap = getFieldInfoMap(metadata);
  const fieldNames = getFieldNames(metadata, fieldArrangement);
  const fieldArrangementMap = getFieldArrangementMap(metadata, fieldArrangement, fieldInfoProvider);


  const handleFormFieldChange = (value, fieldInfo) => {
    onFieldChange(value, fieldInfo);
  };


  const fields = [];
  let fieldCount = 0;
  fieldNames.forEach((fieldName, fieldIndex) => {
    const fieldInfo = fieldInfoMap[fieldName];
    if (!fieldInfo.read_only) {
      if (!fieldInfo.ui) {
        fieldInfo.ui = {};
      }
      if (fieldCount === 0) {
        fieldInfo.ui.autoFocus = true;
      }
      fields.push(
        <Grid
          container
          item
          key={fieldName}
          xs={12}
        >
          <FormField
            errorText={errors[fieldName]}
            form={form}
            fieldInfo={fieldInfo}
            fieldArrangementInfo={fieldArrangementMap[fieldName]}
            onChange={handleFormFieldChange}
          />
        </Grid>
      );

      fieldCount += 1;
    }
  });

  return fields;
}

FormFieldSet.propTypes = {
  errors: PropTypes.object,
  form: PropTypes.object.isRequired,
  fieldArrangement: PropTypes.array,
  fieldInfoProvider: PropTypes.func,
  onFieldChange: PropTypes.func.isRequired,
  metadata: PropTypes.array,
};

export default FormFieldSet;
