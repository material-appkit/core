import PropTypes from 'prop-types';
import React from 'react';

import FormField from './FormField';

function FormFieldSet(props) {
  const {
    errors,
    fieldArrangementMap,
    fieldInfoMap,
    fieldNames,
    form,
    onFieldChange,
  } = props;

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
        <FormField
          errorText={errors[fieldName]}
          form={form}
          fieldInfo={fieldInfo}
          fieldArrangementInfo={fieldArrangementMap[fieldName]}
          key={fieldName}
          onChange={handleFormFieldChange}
        />
      );

      fieldCount += 1;
    }
  });

  return fields;
}

FormFieldSet.propTypes = {
  errors: PropTypes.object,
  form: PropTypes.object.isRequired,
  fieldArrangementMap: PropTypes.object,
  fieldInfoMap: PropTypes.object,
  fieldNames: PropTypes.array,
  onFieldChange: PropTypes.func.isRequired,
};

export default FormFieldSet;
