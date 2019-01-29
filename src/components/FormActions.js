/**
*
* FormActions
*
*/

import PropTypes from 'prop-types';
import React from 'react';

import { withStyles } from '@material-ui/core/styles';

function FormActions(props) {
  const { classes } = props;
  return (
    <div className={classes.root}>
      {props.children}
    </div>
  );
}

FormActions.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.any,
};

export default withStyles({
  root: {
    alignItems: 'center',
    display: 'flex',
    flex: '0 0 auto',
    justifyContent: 'flex-end',
    margin: 0,
  },
})(FormActions);
