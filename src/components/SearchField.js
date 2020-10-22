import debounce from 'lodash.debounce';

import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';

import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import CancelIcon from '@material-ui/icons/Cancel';
import SearchIcon from '@material-ui/icons/Search';

function SearchField(props) {
  const {
    onChange,
    timeoutDelay,
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
      console.log('delayed change');
      onChange(value);
    }, timeoutDelay, { leading: false, trailing: true })
  );


  const updateSearchTerm = (value) => {
    setSearchTerm(value);
    if (timeoutDelay) {
      searchTermChangeHandlerRef.current(value);
    } else {
      onChange(value);
    }
  };

  return (
    <TextField
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon/>
          </InputAdornment>
        ),
        endAdornment: searchTerm ? (
          <InputAdornment position="end">
            <IconButton
              onClick={() => updateSearchTerm('')}
              size="small"
            >
            <CancelIcon fontSize="small" />
            </IconButton>
          </InputAdornment>
        ) : null
      }}
      onChange={(e) => updateSearchTerm(e.target.value)}
      value={searchTerm}
      {...textFieldProps}
    />
  );
}

SearchField.propTypes = {
  onTimeout: PropTypes.func,
  placeholder: PropTypes.string,
  timeoutDelay: PropTypes.number,
  value: PropTypes.string,
  variant: PropTypes.string,
};

SearchField.defaultProps = {
  placeholder: 'Filter by search term...',
  timeoutDelay: 200,
  value: '',
  variant: 'standard',
};

export default SearchField;
