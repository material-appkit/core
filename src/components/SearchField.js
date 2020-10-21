import debounce from 'lodash.debounce';

import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';

import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import CancelIcon from '@material-ui/icons/Cancel';
import SearchIcon from '@material-ui/icons/Search';

function SearchField(props) {
  const {
    value,
    onTimeout,
    onChange,
    timeoutDelay,
    ...textFieldProps
  } = props;

  const [searchTerm, setSearchTerm] = useState(value);

  const searchTermChangeHandlerRef = useRef(
    debounce((value) => {
      onTimeout(value);
    }, timeoutDelay, { leading: false, trailing: true })
  );


  const updateSearchTerm = (value) => {
    setSearchTerm(value);
    searchTermChangeHandlerRef.current(value);
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
  timeoutDelay: 500,
  value: '',
  variant: 'outlined',
};

export default SearchField;
