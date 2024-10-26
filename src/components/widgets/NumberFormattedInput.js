import PropTypes from 'prop-types';
import React from 'react';

import { NumericFormat } from 'react-number-format';

function NumberFormattedInput(props) {
  const {
    inputRef,
    onChange,
    onValueChange,
    ...rest
  } = props;

  return (
    <NumericFormat
      getInputRef={inputRef}
      onChange={(e) => {
        if (onChange) {
          onChange({
            target: {
              name: props.name,
              value: e.target.value,
            },
          });
        }
      }}
      onValueChange={onValueChange}
      {...rest}
    />
  );
}

NumberFormattedInput.propTypes = {
  inputMode: PropTypes.string,
  inputRef: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  onValueChange: PropTypes.func,
};

NumberFormattedInput.defaultProps = {
  decimalScale: 0,
  valueIsNumericString: true,
  inputMode: null,
  thousandSeparator: true,
};

export default NumberFormattedInput;
