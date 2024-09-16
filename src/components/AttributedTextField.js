import clsx from 'clsx';
import debounce from 'lodash.debounce';

import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import MuiTextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';

const styles = makeStyles((theme) => ({
  containedInputLabelShrink: {
    transform: 'translate(14px, 8px) scale(0.75) !important',
  },

  containedInputInput: {
    padding: `24px 14px 12px 14px`,
  },

  root: {
    position: 'relative',
  },

  statusIndicatorContainer: {
    position: 'absolute',
    right: 4,
    top: 4,
  },

  statusIcon: {
    fontSize: theme.typography.pxToRem(16),
  },
}));

function AttributedTextField(props) {
  const classes = styles();

  const {
    className,
    clearable = false,
    InputLabelProps,
    InputProps,
    onChange,
    onChangeDelay = 0,
    propagateChangeEvent = true,
    StartIcon,
    status,
    textfieldClassName,
    value = '',
    valueTransformer,
    variant = 'standard',
    ...textFieldProps
  } = props;

  const [fieldValue, setFieldValue] = useState(value);


  const statusIndicator = useMemo(() => {
    switch (status) {
      case 'working':
        return <CircularProgress size={14} disableShrink />;
      case 'valid':
        return <CheckIcon className={classes.statusIcon} color="primary" />;
      case 'invalid':
        return <CloseIcon className={classes.statusIcon} color="error" />;
      default:
        return null;
    }
  }, [classes, status]);


  useEffect(() => {
    let appliedValue = value;
    if (valueTransformer) {
      appliedValue = valueTransformer(appliedValue);
    }
    if (appliedValue !== fieldValue) {
      setFieldValue(appliedValue);
    }
  }, [value]);


  const delayedChangeHandler = useMemo(() => {
    return debounce((v) => {
      if (onChange) {
        onChange(v);
      }
    }, onChangeDelay, { leading: false, trailing: true });
  }, [onChange, onChangeDelay]);


  const handleFieldChange = useCallback((e) => {
    if (!propagateChangeEvent) {
      e.stopPropagation();
    }

    const _fieldValue = e.target.value;
    setFieldValue(_fieldValue);

    let updatedValue = _fieldValue;
    if (valueTransformer) {
      updatedValue = valueTransformer(updatedValue);
    }

    if (onChange) {
      if (onChangeDelay) {
        delayedChangeHandler(updatedValue);
      } else {
        onChange(updatedValue)
      }
    }
  }, [delayedChangeHandler, onChange, onChangeDelay, valueTransformer]);


  const handleClearButtonClick = useCallback(() => {
    setFieldValue('');

    if (onChange) {
      onChange('');
    }
  }, [onChange]);

  // ---------------------------------------------------------------------------

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
          onClick={handleClearButtonClick}
          size="small"
        >
        <CancelIcon fontSize="small" />
        </IconButton>
      </InputAdornment>
    ) : null;
  }

  const fieldContainerStyles = {};
  if (textFieldProps.fullWidth) {
    fieldContainerStyles['width'] = '100%';
  }

  return (
    <div
      className={clsx(classes.root, className)}
      style={fieldContainerStyles}
    >
      {statusIndicator &&
        <span className={classes.statusIndicatorContainer}>
          {statusIndicator}
        </span>
      }

      <MuiTextField
        className={textfieldClassName}
        InputProps={FinalInputProps}
        InputLabelProps={FinalInputLabelProps}
        onChange={handleFieldChange}
        value={fieldValue}
        variant={derivedVariant}
        {...textFieldProps}
      />
    </div>
  );
}

AttributedTextField.propTypes = {
  className: PropTypes.string,
  clearable: PropTypes.bool,
  onChange: PropTypes.func,
  onChangeDelay: PropTypes.number,
  propagateChangeEvent: PropTypes.bool,
  StartIcon: PropTypes.elementType,
  status: PropTypes.oneOf(['working', 'valid', 'invalid']),
  textfieldClassName: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  valueTransformer: PropTypes.func,
  variant: PropTypes.oneOf(['contained', 'filled', 'outlined', 'standard']),
};

export default AttributedTextField;
