import PropTypes from 'prop-types';
import React from 'react';

import SideBar from './SideBar';
import { withStyles } from '@material-ui/core/styles';


function SplitView(props) {
  const children = React.Children.toArray(props.children);
  return (
    <React.Fragment>
      <SideBar>
        {children[0]}
      </SideBar>
      <div className={props.classes.mainContent}>
        {children[1]}
      </div>
    </React.Fragment>
  );
}

SplitView.propTypes = {
  children: PropTypes.array.isRequired,
  classes: PropTypes.object,
};


export default withStyles((theme) => ({
  mainContent: {
    [theme.breakpoints.up('md')]: {
      marginRight: theme.sidebar.width,
    },
  },
}))(SplitView);
