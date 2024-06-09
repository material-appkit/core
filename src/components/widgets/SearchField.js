import clsx from 'clsx';

import PropTypes from 'prop-types';
import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';

import AttributedTextField from '../AttributedTextField';

const styles = makeStyles((theme) => ({
  textField: {
    margin: theme.spacing(1, 0),

    [theme.breakpoints.down('sm')]: {
      flex: '1',
    },
  },

  inputRoot: {
    backgroundColor: theme.palette.common.white,
  },

  inputAdornedStart: {
    paddingLeft: theme.spacing(1),
  },
}));

function SearchField(props) {
  const classes = styles();

  const {
    className,
    fullWidth = true,
    margin = 'dense',
    onChangeDelay = 400,
    placeholder = 'Search...',
    variant = 'outlined',
    ...rest
  } = props;

  return (
    <AttributedTextField
      className={clsx(classes.textField, className)}
      fullWidth={fullWidth}
      InputProps={{
        classes: {
          root: classes.inputRoot,
          adornedStart: classes.inputAdornedStart,
        },
      }}
      margin={margin}
      onChangeDelay={onChangeDelay}
      placeholder={placeholder}
      StartIcon={SearchIcon}
      variant={variant}
      {...rest}
    />
  )
}

SearchField.propTypes = {
  className: PropTypes.string,
  onChange: PropTypes.func,
  onChangeDelay: PropTypes.number,
  placeholder: PropTypes.string,
  value: PropTypes.string,
};

export default SearchField;
