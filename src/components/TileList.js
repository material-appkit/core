/**
*
* TileList
*
*/

import classNames from 'classnames';

import PropTypes from 'prop-types';
import React, { useRef } from 'react';

import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles({
  box: {
    display: 'grid',
  },

  selectionEnabled: {
    cursor: 'pointer',
  }
});

function TileList(props) {
  const classes = styles();

  const gridStyles = Object.assign(props.styles || {}, {
    gridGap: props.gridGap,
    gridTemplateColumns: `repeat(${props.columns}, 1fr)`,
  });

  const boxClasses = [classes.box];
  if (!props.selectionDisabled) {
    boxClasses.push(classes.selectionEnabled);
  }

  return (
    <Box className={classNames(boxClasses)} style={gridStyles}>
      {props.children}
    </Box>
  );
}

TileList.propTypes = {
  children: PropTypes.array.isRequired,
  columns: PropTypes.number,
  gridGap: PropTypes.number,
  selectionDisabled: PropTypes.bool,
};

TileList.defaultProps = {
  columns: 3,
  gridGap: 2,
};

export default TileList;

