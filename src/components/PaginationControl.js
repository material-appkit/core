import PropTypes from 'prop-types';
import React, { Fragment, useCallback, useState } from 'react';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
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
    fontWeight: 500,
    padding: theme.spacing(0, 2),
  },

  pageStepButton: {
    padding: theme.spacing(0.75),
  },

  pageSizeSelectButton: {
    minWidth: 'unset',
    paddingLeft: theme.spacing(0.5),
    paddingRight: theme.spacing(0.5),
  },
}));

function PaginationControl(props) {
  const classes = styles();

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

  const [pageSizeAnchorEl, setPageSizeAnchorEl] = useState(null);


  const handlePageSizeButtonClick = useCallback((e) => {
    setPageSizeAnchorEl(e.currentTarget);
  }, []);


  const handlePageSizeMenuClose = useCallback(() => {
    setPageSizeAnchorEl(null);
  }, []);


  const handlePageSizeMenuItemClick = (value) => {
    onPageSizeChange(value);
    handlePageSizeMenuClose();
  };


  let previousPageButton = null;
  let nextPageButton = null;

  let labelText = count !== null ? `${count} items` : '---';

  if (pageSize) {
    const offset = page * pageSize;

    if (count) {
      labelText = `${offset + 1} - ${Math.min(offset + pageSize, count)} of ${count}`;
    }

    previousPageButton = (
      <IconButton
        className={classes.pageStepButton}
        disabled={page <= 0 }
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeftIcon />
      </IconButton>
    );

    nextPageButton = (
      <IconButton
        className={classes.pageStepButton}
        disabled={!((offset + pageSize) < count)}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRightIcon />
      </IconButton>
    )
  }


  if (pageLabel) {
    // An explicitly provided label takes precedence over all
    labelText = pageLabel;
  }


  let pageControl = null;
  if (pageSize && pageSizeChoices && pageSizeChoices.length > 1) {
    pageControl = (
      <Fragment>
        <Link
          aria-controls="page-size-menu"
          aria-haspopup="true"
          onClick={handlePageSizeButtonClick}
          className={classes.pageSizeSelectButton}
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
          TransitionComponent={Fade}
        >
          {pageSizeChoices.map((value) => (
            <MenuItem
              key={value}
              onClick={() => handlePageSizeMenuItemClick(value)}
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

  return (
    <Box display="flex" alignItems="center">
      {previousPageButton}

      {pageControl}

      {nextPageButton}
    </Box>
  );
}

PaginationControl.propTypes = {
  count: PropTypes.number,
  page: PropTypes.number,
  pageLabel: PropTypes.string,
  pageSize: PropTypes.number,
  pageSizeChoices: PropTypes.array.isRequired,
  onPageChange: PropTypes.func,
  onPageSizeChange: PropTypes.func,
  totalPages: PropTypes.number,
  typographyProps: PropTypes.object,
};

PaginationControl.defaultProps = {
  page: 0,
  typographyProps: {
    color: 'textSecondary',
    variant: 'subtitle2',
  }
};

export default React.memo(PaginationControl);
