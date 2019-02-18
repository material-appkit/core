import PropTypes from 'prop-types';
import React from 'react';

import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

//------------------------------------------------------------------------------
function _SidebarSection(props) {
  return (
    <section className={props.classes.section}>
      {props.children}
    </section>
  );
}

_SidebarSection.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.any,
};

const SidebarSection = withStyles({
  section: {
    '&:not(:last-child)': {
      marginBottom: 24,
    },
  },
})(_SidebarSection);

// -----------------------------------------------------------------------------
function _SidebarHeading(props) {
  return (
    <Typography
      variant="h3"
      classes={{ h3: props.classes.h3 }}
    >
      {props.text}
    </Typography>
  );
}

_SidebarHeading.propTypes = {
  classes: PropTypes.object.isRequired,
  text: PropTypes.string.isRequired,
};

const SidebarHeading = withStyles({
  h3: {
    fontSize: '1.1rem',
    fontWeight: 500,
    marginBottom: 5,
  },
})(_SidebarHeading);

// -----------------------------------------------------------------------------
export {
  SidebarHeading,
  SidebarSection,
};
