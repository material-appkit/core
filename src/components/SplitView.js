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
  splitView: theme.splitView.root,
  sideBar: theme.splitView.sideBar,
  mainContent: theme.splitView.mainContent,

}))(SplitView);
