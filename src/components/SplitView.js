import PropTypes from 'prop-types';
import React, { Fragment } from 'react';


function SplitView(props) {
  const {
    bar,
    barSize,
    children,
    layout = 'position',
    placement,
    scrollContent = false,
    style = {},
  } = props;

  const splitViewStyle = {
    ...style,
    height: '100%',
  };

  const contentStyles = {};
  const barStyles = {};


  switch (layout) {
    case 'grid':
      splitViewStyle.display = 'grid';
      contentStyles.overflow = 'auto';

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
      break;
    case 'position':
      splitViewStyle.position = 'relative';
      contentStyles.overflow = scrollContent ? 'auto' : 'visible';

      switch (placement) {
        case 'top':
          Object.assign(barStyles, {
            top: 0,
            right: 0,
            left: 0,
            height: barSize,
            position: 'absolute',
          });
          Object.assign(contentStyles, {
            top: barSize,
            right: 0,
            bottom: 0,
            left: 0,
            position: 'absolute',
          });
          break;
        case 'bottom':
          Object.assign(barStyles, {
            bottom: 0,
            right: 0,
            left: 0,
            height: barSize,
            position: 'absolute',
          });
          Object.assign(contentStyles, {
            top: 0,
            right: 0,
            left: 0,
            position: 'absolute',
          });
          break;
        case 'left':
          Object.assign(barStyles, {
            top: 0,
            left: 0,
            bottom: 0,
            width: barSize,
            position: 'absolute',
          });
          Object.assign(contentStyles, {
            top: 0,
            right: 0,
            left: barSize,
            bottom: 0,
            position: 'absolute',
          });
          break;
        case 'right':
          Object.assign(barStyles, {
            position: 'absolute',
            top: 0,
            width: barSize,
            bottom: 0,
            right: 0,
          });
          Object.assign(contentStyles, {
            position: 'absolute',
            top: 0,
            left: 0,
            right: barSize,
            bottom: 0,
          });
          break;
      }
      break;
    default:
      throw new Error(`Unexpected layout property: ${layout}`);
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
  classes: PropTypes.object,
  contentClassName: PropTypes.string,
  layout: PropTypes.oneOf(['grid', 'position']),
  placement: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
  scrollContent: PropTypes.bool,
  style: PropTypes.object,
};

export default React.memo(SplitView);
