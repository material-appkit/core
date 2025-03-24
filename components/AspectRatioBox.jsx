import clsx from 'clsx';

import PropTypes from 'prop-types';
import React from 'react';


import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles((theme) => ({
  root: {
    position: 'relative'
  },

  content: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
}));

function AspectRatioBox(props) {
  const classes = styles();

  const {
    aspectRatio,
    className,
    children,
    Component
  } = props;


  return (
    <Component
      className={clsx(classes.root, className)}
      style={{ paddingBottom: `${100 / aspectRatio}%` }}
    >
      <div className={classes.content}>
        {children}
      </div>
    </Component>
  );
}

AspectRatioBox.propTypes = {
  aspectRatio: PropTypes.number.isRequired,
  Component: PropTypes.any,
  children: PropTypes.any,
  className: PropTypes.string,
};

AspectRatioBox.defaultProps = {
  Component: 'div',
};

export default AspectRatioBox;
