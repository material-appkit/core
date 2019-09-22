import PropTypes from 'prop-types';
import React from 'react';

import Tooltip from '@material-ui/core/Tooltip';

//------------------------------------------------------------------------------
function ToolbarItem(props) {
  if (!props.tooltip) {
    return props.control;
  }

  return (
    <Tooltip title={props.tooltip}>
      {props.control}
    </Tooltip>
  );
}

ToolbarItem.propTypes = {
  control: PropTypes.object.isRequired,
  tooltip: PropTypes.string,
};

export default ToolbarItem;
