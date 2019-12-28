/**
*
* TileList
*
*/

import PropTypes from 'prop-types';
import React, { useRef } from 'react';

import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';

function TileList(props) {
  const gridStyles = Object.assign(props.styles || {}, {
    gridGap: props.gridGap,
    gridTemplateColumns: `repeat(${props.columns}, 1fr)`,
  });

  return (
    <Box display="grid" style={gridStyles}>
      {props.children}
    </Box>
  );
}

TileList.propTypes = {
  children: PropTypes.array.isRequired,
  columns: PropTypes.number,
  gridGap: PropTypes.number,
};

TileList.defaultProps = {
  columns: 3,
  gridGap: 2,
};

export default TileList;

