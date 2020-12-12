import debounce from 'lodash.debounce';

import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';

import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import MuiTextField from '@material-ui/core/TextField';
import CancelIcon from '@material-ui/icons/Cancel';

function AttributedTextField(props) {
  const {
    clearable,
    onChange,
    onChangeDelay,
    StartIcon,
    value,
    valueTransformer,
    ...textFieldProps
  } = props;

  const [fieldValue, setFieldValue] = useState(value);

  useEffect(() => {
    if (value !== fieldValue) {
      updateFieldValue(value);
    }
  }, [value]);

  const searchTermChangeHandlerRef = useRef(
    debounce((v) => {
      onChange(v);
    }, onChangeDelay, { leading: false, trailing: true })
  );


  const updateFieldValue = (v) => {
    let updatedValue = v;
    if (valueTransformer) {
      updatedValue = valueTransformer(updatedValue);
    }

    setFieldValue(updatedValue);
    if (onChangeDelay) {
      searchTermChangeHandlerRef.current(updatedValue);
    } else {
      onChange(updatedValue);
    }
  };

  const InputProps = {};
  if (StartIcon) {
    InputProps.startAdornment = (
      <InputAdornment position="start">
        <StartIcon />
      </InputAdornment>
    );
  }

  if (clearable) {
    InputProps.endAdornment = fieldValue ? (
      <InputAdornment position="end">
        <IconButton
          edge="end"
          onClick={() => updateFieldValue('')}
          size="small"
        >
        <CancelIcon fontSize="small" />
        </IconButton>
      </InputAdornment>
    ) : null;
  }

  return (
    <MuiTextField
      InputProps={InputProps}
      onChange={(e) => updateFieldValue(e.target.value)}
      value={fieldValue}
      {...textFieldProps}
    />
  );
}

AttributedTextField.propTypes = {
  clearable: PropTypes.bool,
  onTimeout: PropTypes.func,
  placeholder: PropTypes.string,
  onChangeDelay: PropTypes.number,
  StartIcon: PropTypes.elementType,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  valueTransformer: PropTypes.func,
  variant: PropTypes.string,
};

AttributedTextField.defaultProps = {
  clearable: true,
  onChangeDelay: 300,
  value: '',
  variant: 'standard',
};

export default AttributedTextField;
