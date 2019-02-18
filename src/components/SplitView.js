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
    backgroundColor: '#fafafa',
    borderBottom: '1px solid #cacaca',
    padding: theme.spacing.unit * 2,

    [theme.breakpoints.up('md')]: {
      borderLeft: '1px solid #cacaca',
      borderBottomWidth: 0,
      order: 1,
      minHeight: `calc(100vh - ${theme.topBar.height + theme.navigationController.navBar.height}px)`,
      width: theme.sidebar.width,
    },
  },

  mainContent: {
    flexGrow: 1,
  },
}))(SplitView);
