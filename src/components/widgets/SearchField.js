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


  return (
    <AttributedTextField
      className={classes.textField}
      InputProps={{
        classes: {
          root: classes.inputRoot,
          adornedStart: classes.inputAdornedStart,
        },
      }}
      margin="dense"
      onChangeDelay={400}
      StartIcon={SearchIcon}
      variant="outlined"
      {...props}
    />
  )
}

SearchField.propTypes = {
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  value: PropTypes.string,
};

SearchField.defaultProps = {
  placeholder: 'Search...',
};

export default SearchField;