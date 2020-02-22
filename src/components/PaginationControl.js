import PropTypes from 'prop-types';
import React from 'react';

import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

const styles = makeStyles((theme) => ({
  label: {
    fontWeight: 'normal',
  },

  paginationButton: {
    padding: theme.spacing(0.5),
  }
}));

function PaginationControl(props) {
  const classes = styles();

  const {
    count,
    onPageChange,
    page,
    pageSize,
    typographyProps,
  } = props;

  const offset = page * pageSize;
  const pageCount = Math.floor(count / pageSize);

  return (
    <Box display="flex" alignItems="center">
      <IconButton
        className={classes.paginationButton}
        disabled={page <= 0 }
        onClick={() => { onPageChange(page - 1); }}
      >
        <ChevronLeftIcon />
      </IconButton>

      <Typography className={classes.label} {...typographyProps}>
        {offset + 1} - {Math.min(offset + pageSize, count)} of {count}
      </Typography>

      <IconButton
        className={classes.paginationButton}
        disabled={page >= pageCount}
        onClick={() => { onPageChange(page + 1); }}
      >
        <ChevronRightIcon />
      </IconButton>
    </Box>
  );
}

PaginationControl.propTypes = {
  count: PropTypes.number,
  page: PropTypes.number,
  pageSize: PropTypes.number,
  pageSizeChoices: PropTypes.array,
  onPageChange: PropTypes.func,
  onPageSizeChange: PropTypes.func,
  typographyProps: PropTypes.object,
};

PaginationControl.defaultProps = {
  page: 0,
  typographyProps: {
    variant: 'subtitle2',
  }
};

export default PaginationControl;
