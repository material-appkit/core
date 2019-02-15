import PropTypes from 'prop-types';
import React from 'react';

import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import withWidth from '@material-ui/core/withWidth';
import { withStyles } from '@material-ui/core/styles';

//------------------------------------------------------------------------------
function SideBar(props) {
  const { classes, width } = props;

  if (width === 'xs' || width === 'sm') {
    return (
      <div className={classes.smallContainer}>
        {props.children}
      </div>
    );
  }

  return (
    <Drawer
      variant="permanent"
      classes={{ paper: classes.drawerPaper }}
      anchor="right"
    >
      {props.children}
    </Drawer>
  );
}

SideBar.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.any,
  width: PropTypes.string.isRequired,
};

export default withStyles((theme) => ({
  drawerPaper: {
    backgroundColor: '#fafafa',
    width: theme.sidebar.width,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
    paddingTop: theme.topBar.height + theme.navigationController.navBar.height + 20,
  },

  smallContainer: {
    backgroundColor: '#fafafa',
    borderBottom: '1px solid #cacaca',
    padding: 20,
  },
}))(withWidth()(SideBar));

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
      marginBottom: 30,
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
    fontSize: '1.15rem',
    marginBottom: 5,
  },
})(_SidebarHeading);

// -----------------------------------------------------------------------------
export {
  SidebarHeading,
  SidebarSection,
};
