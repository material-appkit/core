import PropTypes from 'prop-types';
import React, { useRef } from 'react';

import Grid from '@material-ui/core/Grid';

function TileView(props) {
  const {
    children,
    columns,
    selectionDisabled,
  } = props;

  return (
    <Grid container>
      {children.map((tileItemView) => {
        return React.cloneElement(
          tileItemView,
          {
            selectionDisabled,
            ...columns
          },
        );
      })}

    </Grid>
  );
}

TileView.propTypes = {
  children: PropTypes.array.isRequired,
  columns: PropTypes.object,
  selectionDisabled: PropTypes.bool,
};

TileView.defaultProps = {
  columns: { xs: 12, sm: 6, md: 4, lg: 3 },
};

export default TileView;

