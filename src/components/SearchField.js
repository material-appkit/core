import debounce from 'lodash.debounce';

import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';

import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
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
    debounce((e) => {
      onTimeout(e.target.value);
    }, timeoutDelay, { leading: false, trailing: true })
  );


  const handleTextFieldChange = (e) => {
    setSearchTerm(e.target.value);
    searchTermChangeHandlerRef.current(e);
  };

  return (
    <TextField
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon/>
          </InputAdornment>
        )
      }}
      onChange={handleTextFieldChange}
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
