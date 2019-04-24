import PropTypes from 'prop-types';
import React from 'react';

import { withStyles } from '@material-ui/core/styles';


function SplitView(props) {
  const { classes } = props;

  const children = React.Children.toArray(props.children);
  return (
    <div className={classes.splitView}>
      <div className={classes.sideBar}>
        {children[0]}
      </div>
      <div className={classes.mainContent}>
        {children[1]}
      </div>
    </div>
  );
}

SplitView.propTypes = {
  children: PropTypes.array.isRequired,
  classes: PropTypes.object,
};

export default withStyles((theme) => ({
  splitView: {
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
    },
  },

  sideBar: {
    backgroundColor: '#fcfcfc',
    borderBottom: '1px solid #cacaca',
    padding: theme.spacing.unit * 2,

    [theme.breakpoints.up('md')]: {
      borderLeft: '1px solid #cacaca',
      borderBottomWidth: 0,
      height: `calc(100vh - ${theme.topBar.height + theme.navigationController.navBar.height}px)`,
      order: 1,
      overflow: 'scroll',
      position: 'fixed',
      right: 0,
      width: theme.sidebar.width,
    },
  },

  mainContent: {
    [theme.breakpoints.up('md')]: {
      width: `calc(100vw - ${theme.navbar.width}px - ${theme.sidebar.width}px)`,
    },
  },

}))(SplitView);
