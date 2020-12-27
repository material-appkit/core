import PropTypes from 'prop-types';
import React, { useRef } from 'react';

import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles({
  box: {
    display: 'grid',
  },

  selectionEnabled: {
    cursor: 'pointer',
  }
});

function TileView(props) {
  const classes = styles();

  const {
    columns,
    dataSource,
    selectionDisabled,
    spacing,
  } = props;

  return (
    <Grid container>
      {dataSource.map((tileItemProps) => {
        const {
          Component,
          key,
          item,

        } = tileItemProps;

        return (
          <Component
            key={key}
            item={item}
            {...columns}
          />
        );
      })}
    </Grid>
  );
}

TileView.propTypes = {
  columns: PropTypes.object,
  dataSource: PropTypes.array.isRequired,
  selectionDisabled: PropTypes.bool,
  spacing: PropTypes.number,
};

TileView.defaultProps = {
  columns: { xs: 4 },
  spacing: 2,
};

export default TileView;

