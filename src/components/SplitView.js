import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

function SplitView(props) {
  const {
    bar,
    barSize,
    children,
    placement,
    scrollContent,
  } = props;

  const splitViewStyle = {
    display: 'grid',
    height: '100%',
  };


  const barStyles = {};
  const contentStyles = {};

  switch (placement) {
      case 'top':
        splitViewStyle.gridTemplateRows = `${barSize}px auto`;
        break;
      case 'bottom':
        splitViewStyle.gridTemplateRows = `auto ${barSize}px`;
        contentStyles.order = 0;
        barStyles.order = 1;
        break;
      case 'left':
        splitViewStyle.gridTemplateColumns = `${barSize}px auto`;
        break;
      case 'right':
        splitViewStyle.gridTemplateColumns = `auto ${barSize}px`;
        contentStyles.order = 0;
        barStyles.order = 1;
        break;
  }

  if (scrollContent) {
    contentStyles.overflow = 'auto';
  }


  return (
    <div style={splitViewStyle}>
      <div className={props.barClassName} style={barStyles}>
        {bar}
      </div>

      <div className={props.contentClassName} style={contentStyles}>
        {children}
      </div>
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
  scrollContent: true,
};

export default SplitView;
