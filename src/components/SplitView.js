import classNames from 'classnames';

import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles((theme) => ({
  splitView: {
    height: '100%',
    width: '100%',

    // "-webkitOverflowScrolling": 'touch',
  }
}));

function SplitView(props) {
  const {
    bar,
    barSize,
    children,
    placement,
    scrollContent,
  } = props;

  const classes = styles();

  const splitViewStyles = {};
  const barStyles = {};
  const contentStyles = { };

  if (scrollContent) {
    contentStyles.overflow = 'auto';
  }

  switch (placement) {
    case 'top':
    case 'bottom':
      barStyles.height = barSize;
      contentStyles.height = `calc(100% - ${barSize}px)`;
      break;

    case 'left':
    case 'right':
      splitViewStyles.display = 'flex';
      barStyles.width = barSize;
      contentStyles.flex = 1;
      break;
  }

  const barView = (
    <div className={classNames(classes.bar, props.barClassName)} style={barStyles}>
      {bar}
    </div>
  );

  const contentView = (
    <div className={classNames(classes.content, props.contentClassName)} style={contentStyles}>
      {children}
    </div>
  );

  return (
    <div className={classes.splitView} style={splitViewStyles}>
      {(placement === 'bottom' || placement === 'right') ? (
        <Fragment>
          {contentView}
          {barView}
        </Fragment>
      ) : (
        <Fragment>
          {barView}
          {contentView}
        </Fragment>
      )}
    </div>
  );
}

SplitView.propTypes = {
  bar: PropTypes.object.isRequired,
  barSize: PropTypes.number.isRequired,
  barClassName: PropTypes.string,
  children: PropTypes.object,
  classes: PropTypes.object,
  contentClassName: PropTypes.string,
  placement: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
  scrollContent: PropTypes.bool,
};

SplitView.defaultProps = {
  scrollContent: false,
};

export default SplitView;
