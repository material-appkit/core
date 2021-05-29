/**
*
* Select
* See: https://material-ui.com/components/autocomplete/
*/

import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import Autocomplete from '@material-ui/lab/Autocomplete';

import TextField from '@material-ui/core/TextField';
import { isWidthUp } from '@material-ui/core/withWidth';

import ServiceAgent from '../util/ServiceAgent';
import { useWidth } from '../util/hooks';

const BREAKPOINTS = ['xs', 'sm', 'md', 'lg', 'xl'];

function Select(props) {
  const {
    autocompleteClasses,
    disabled,
    emptySelectionPlaceholder,
    endpoint,
    filterParams,
    isClearable,
    labelKey,
    nativeBreakpoint,
    onChange,
    onLoadError,
    options,
    placeholder,
    SelectProps,
    value,
    valueKey,
    ...textfieldProps
  } = props;

  const width = useWidth();

  const [activeOptions, setActiveOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchRequestContextRef = useRef(null);

  const shouldUseNativeSelect = !isWidthUp(nativeBreakpoint, width);

  useEffect(() => {
    return () => {
      ServiceAgent.abortRequest(fetchRequestContextRef.current);
    };
  }, []);

  useEffect(() => {
    if (endpoint && options) {
      throw new Error('An "endpoint" or "options" prop must be specified; never both.');
    }

    if (options) {
      setActiveOptions(options);
    } else if (endpoint) {
      setLoading(true);

      const requestParams = { disable_paging: true };
      if (filterParams) {
        Object.assign(requestParams, filterParams);
      }

      fetchRequestContextRef.current = {};
      ServiceAgent.get(endpoint, requestParams, fetchRequestContextRef.current)
        .then((res) => {
          setActiveOptions(res.jsonData);
        })
        .catch((err) => {
          if (onLoadError) {
            onLoadError(err);
          }
        }).finally(() => {
          fetchRequestContextRef.current = null;
          setLoading(false);
        });
    }
  }, [endpoint, filterParams, options]);


  useEffect(() => {
    if (value === undefined) {
      return;
    }

    if (value) {
      const option = activeOptions.find((option) => option[valueKey] === value);
      setSelectedOption(option || null);
    } else {
      setSelectedOption(null);
    }
  }, [activeOptions, value, valueKey]);


  const handleNativeSelectChange = (e) => {
    const option = activeOptions.find(
      (o) => `${o[valueKey]}` === e.target.value
    );

    if (value === undefined) {
      // If uncontrolled, it is safe to the selected option directly
      setSelectedOption(option);
    }

    if (onChange) {
      onChange(option);
    }
  };


  const handleAutocompleteChange = (e, newValue) => {
    if (value === undefined) {
      // If uncontrolled, it is safe to the selected option directly
      setSelectedOption(newValue);
    }

    if (onChange) {
      onChange(newValue);
    }
  };


  if (shouldUseNativeSelect) {
    return (
      <TextField
        disabled={disabled || loading}
        label={placeholder}
        onChange={handleNativeSelectChange}
        select
        SelectProps={{ ...SelectProps, native: true }}
        value={selectedOption ? selectedOption[valueKey] : ''}
        {...textfieldProps}
      >
        {isClearable &&
          <option aria-label="None" value="">
            {emptySelectionPlaceholder}
          </option>
        }
        {activeOptions.map((option) => (
          <option key={option[valueKey]} value={option[valueKey]}>
            {option[labelKey]}
          </option>
        ))}
      </TextField>
    )
  }

  return (
    <Autocomplete
      classes={autocompleteClasses}
      disabled={disabled || loading}
      onChange={handleAutocompleteChange}
      options={activeOptions}
      getOptionLabel={(option) => option ? option[labelKey] : '------'}
      renderInput={(params) => {
        const { inputProps } = params;
        inputProps.placeholder = emptySelectionPlaceholder;
        return (
          <TextField
            {...params}
            {...textfieldProps}
            inputProps={inputProps}
            SelectProps={SelectProps}
          />
        );
      }}
      value={selectedOption}
    />
  );

}

Select.propTypes = {
  autocompleteClasses: PropTypes.object,
  disabled: PropTypes.bool,
  emptySelectionPlaceholder: PropTypes.string,
  endpoint: PropTypes.string,
  filterParams: PropTypes.object,
  isClearable: PropTypes.bool,
  labelKey: PropTypes.string,
  nativeBreakpoint: PropTypes.oneOf(BREAKPOINTS),
  onChange: PropTypes.func,
  onLoadError: PropTypes.func,
  options: PropTypes.array,
  placeholder: PropTypes.string,
  SelectProps: PropTypes.object,
  size: PropTypes.oneOf(['small', 'medium']),
  value: PropTypes.any,
  valueKey: PropTypes.string,
  variant: PropTypes.oneOf(['standard', 'outlined', 'filled']),
};

Select.defaultProps = {
  emptySelectionPlaceholder: '',
  isClearable: true,
  labelKey: 'label',
  SelectProps: {},
  size: 'medium',
  valueKey: 'value',
  variant: 'standard',
};

export default Select;
