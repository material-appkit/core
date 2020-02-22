import PropTypes from 'prop-types';
import React, { Fragment, useState } from 'react';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

const styles = makeStyles((theme) => ({
  label: {
    fontWeight: 400,
  },

  paginationButton: {
    padding: theme.spacing(0.75),
  }
}));

function PaginationControl(props) {
  const [pageSizeAnchorEl, setPageSizeAnchorEl] = useState(null);

  const {
    count,
    onPageChange,
    onPageSizeChange,
    page,
    pageLabel,
    pageSize,
    pageSizeChoices,
    typographyProps,
  } = props;

  const offset = page * pageSize;
  const pageCount = Math.floor(count / pageSize);


  const handlePageSizeButtonClick = (e) => {
    setPageSizeAnchorEl(e.currentTarget);
  };

  const handlePageSizeMenuClose = () => {
    setPageSizeAnchorEl(null);
  };

  const handlePageSizeMenuItemClick = (value) => {
    onPageSizeChange(value);
    handlePageSizeMenuClose();
  };

  const classes = styles();

  let pageControl = null;
  if (pageLabel) {
    pageControl = (
      <Typography className={classes.label} {...typographyProps}>
        {pageLabel}
      </Typography>
    );
  } else {
    const labelText = `${offset + 1} - ${Math.min(offset + pageSize, count)} of ${count}`;
    if (pageSizeChoices && pageSizeChoices.length > 1) {
      pageControl = (
        <Fragment>
          <Link
            aria-controls="page-size-menu"
            aria-haspopup="true"
            onClick={handlePageSizeButtonClick}
            component={Button}
            {...typographyProps}
          >
            {labelText}
          </Link>

          <Menu
            id="page-size-menu"
            anchorEl={pageSizeAnchorEl}
            keepMounted
            open={Boolean(pageSizeAnchorEl)}
            onClose={handlePageSizeMenuClose}
          >
            {pageSizeChoices.map((value) => (
              <MenuItem
                key={value}
                onClick={() => { handlePageSizeMenuItemClick(value); }}
                selected={value === pageSize}
              >
                {value}
              </MenuItem>
            ))}
          </Menu>
        </Fragment>
      );
    } else {
      pageControl = (
        <Typography className={classes.label} {...typographyProps}>
          {labelText}
        </Typography>
      );
    }
  }

  return (
    <Box display="flex" alignItems="center">
      <IconButton
        className={classes.paginationButton}
        disabled={page <= 0 }
        onClick={() => { onPageChange(page - 1); }}
      >
        <ChevronLeftIcon />
      </IconButton>

      {pageControl}

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
  pageLabel: PropTypes.string,
  pageSize: PropTypes.number,
  pageSizeChoices: PropTypes.array,
  onPageChange: PropTypes.func,
  onPageSizeChange: PropTypes.func,
  typographyProps: PropTypes.object,
};

PaginationControl.defaultProps = {
  page: 0,
  pageSizeChoices: [10, 25, 50, 100, 250, 500],
  typographyProps: {
    color: 'textSecondary',
    variant: 'subtitle2',
  }
};

export default PaginationControl;
