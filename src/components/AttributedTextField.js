import debounce from 'lodash.debounce';

import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';

import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import MuiTextField from '@material-ui/core/TextField';
import CancelIcon from '@material-ui/icons/Cancel';
import SearchIcon from '@material-ui/icons/Search';

function AttributedTextField(props) {
  const {
    clearable,
    onChange,
    onChangeDelay,
    StartIcon,
    value,
    ...textFieldProps
  } = props;

  const [searchTerm, setSearchTerm] = useState(value || '');

  useEffect(() => {
    if (value !== searchTerm) {
      updateSearchTerm(value);
    }
  }, [value]);

  const searchTermChangeHandlerRef = useRef(
    debounce((value) => {
      onChange(value);
    }, onChangeDelay, { leading: false, trailing: true })
  );


  const updateSearchTerm = (value) => {
    setSearchTerm(value);
    if (onChangeDelay) {
      searchTermChangeHandlerRef.current(value);
    } else {
      onChange(value);
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
    InputProps.endAdornment = searchTerm ? (
      <InputAdornment position="end">
        <IconButton
          onClick={() => updateSearchTerm('')}
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
      onChange={(e) => updateSearchTerm(e.target.value)}
      value={searchTerm}
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
  value: PropTypes.string,
  variant: PropTypes.string,
};

AttributedTextField.defaultProps = {
  clearable: true,
  onChangeDelay: 300,
  placeholder: 'Filter by search term...',
  value: '',
  variant: 'standard',
};

export default AttributedTextField;
