import debounce from 'lodash.debounce';

import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';

import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import MuiTextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

import CancelIcon from '@material-ui/icons/Cancel';

const styles = makeStyles({
  containedInputLabelShrink: {
    transform: 'translate(14px, 8px) scale(0.75) !important',
  },

  containedInputInput: {
    padding: `24px 14px 12px 14px`,
  },
});

function AttributedTextField(props) {
  const classes = styles();

  const {
    clearable,
    InputLabelProps,
    InputProps,
    onChange,
    onChangeDelay,
    propagateChangeEvent,
    StartIcon,
    value,
    valueTransformer,
    variant,
    ...textFieldProps
  } = props;

  const [fieldValue, setFieldValue] = useState(value);


  useEffect(() => {
    let appliedValue = value;
    if (valueTransformer) {
      appliedValue = valueTransformer(appliedValue);
    }
    if (appliedValue !== fieldValue) {
      setFieldValue(appliedValue);
    }
  }, [value]);


  const delayedChangeHandlerRef = useRef(
    debounce((v) => {
      onChange(v);
    }, onChangeDelay, { leading: false, trailing: true })
  );


  const updateFieldValue = (v, immediate) => {
    let updatedValue = v;
    if (valueTransformer) {
      updatedValue = valueTransformer(updatedValue);
    }

    setFieldValue(updatedValue);

    if (onChange) {
      if (immediate || !onChangeDelay) {
        onChange(updatedValue);
      } else {
        delayedChangeHandlerRef.current(updatedValue);
      }
    }
  };

  const handleFieldChange = (e) => {
    if (!propagateChangeEvent) {
      e.stopPropagation();
    }

    updateFieldValue(e.target.value);
  };


  const FinalInputProps = InputProps ? {...InputProps} : {};
  const FinalInputLabelProps = InputLabelProps ? {...InputLabelProps} : {};

  if (StartIcon) {
    FinalInputProps.startAdornment = (
      <InputAdornment position="start">
        <StartIcon />
      </InputAdornment>
    );
  }

  let derivedVariant = variant;
  if (derivedVariant === 'contained') {
    FinalInputProps.notched = false;

    if (FinalInputProps.classes) {
      FinalInputProps.classes.input = classes.containedInputInput
    } else {
      FinalInputProps.classes = { input: classes.containedInputInput };
    }

    if (FinalInputLabelProps.classes) {
      FinalInputLabelProps.classes.shrink = classes.containedInputLabelShrink
    } else {
      FinalInputLabelProps.classes = { shrink: classes.containedInputLabelShrink };
    }
    derivedVariant = 'outlined';
  }

  if (clearable) {
    FinalInputProps.endAdornment = fieldValue ? (
      <InputAdornment position="end">
        <IconButton
          edge="end"
          onClick={(e) => updateFieldValue('', true)}
          size="small"
        >
        <CancelIcon fontSize="small" />
        </IconButton>
      </InputAdornment>
    ) : null;
  }

  return (
    <MuiTextField
      InputProps={FinalInputProps}
      InputLabelProps={FinalInputLabelProps}
      onChange={handleFieldChange}
      value={fieldValue}
      variant={derivedVariant}
      {...textFieldProps}
    />
  );
}

AttributedTextField.propTypes = {
  clearable: PropTypes.bool,
  onTimeout: PropTypes.func,
  onChangeDelay: PropTypes.number,
  propagateChangeEvent: PropTypes.bool,
  StartIcon: PropTypes.elementType,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  valueTransformer: PropTypes.func,
  variant: PropTypes.oneOf(['contained', 'filled', 'outlined', 'standard']),
};

AttributedTextField.defaultProps = {
  clearable: false,
  onChangeDelay: 0,
  propagateChangeEvent: true,
  value: '',
  variant: 'standard',
};

export default AttributedTextField;
