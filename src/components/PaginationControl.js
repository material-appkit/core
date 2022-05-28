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
    color: theme.palette.text.secondary,
    fontSize: 'inherit',
    fontWeight: 500,
    padding: theme.spacing(0, 2),
  },

  pageSizeSelectButton: {
    color: theme.palette.text.secondary,
    minWidth: 'unset',
    padding: theme.spacing(0, 1),
  },
}));

function PaginationControl(props) {
  const classes = styles();

  const {
    count,
    onPageChange,
    onPageSizeChange,
    paginationInfo,
    pageSizeChoices,
    searchParams,
    setSearchParams,
  } = props;

  const [pageSizeAnchorEl, setPageSizeAnchorEl] = useState(null);


  let page, pageSize;
  if (paginationInfo) {
    page = paginationInfo.current_page;
    pageSize = paginationInfo.per_page;
  } else {
    page = props.page;
    pageSize = props.pageSize;
  }

  const handlePreviousButtonClick = useCallback(() => {
    const updatedSearchParams = new URLSearchParams(searchParams);
    updatedSearchParams.set('page', page - 1);
    setSearchParams(updatedSearchParams);
  }, [page, searchParams, setSearchParams]);


  const handleNextButtonClick = useCallback(() => {
    const updatedSearchParams = new URLSearchParams(searchParams);
    updatedSearchParams.set('page', page + 1);
    setSearchParams(updatedSearchParams);
  }, [page, searchParams, setSearchParams]);


  const handlePageSizeButtonClick = useCallback((e) => {
    setPageSizeAnchorEl(e.currentTarget);
  }, []);

  const handlePageSizeMenuItemClick = useCallback((value) => () => {
    if (value) {
      const updatedSearchParams = new URLSearchParams(searchParams);
      updatedSearchParams.set('page', 1);
      updatedSearchParams.set('page_size', value);
      setSearchParams(updatedSearchParams);
    // onPageSizeChange(value);
    }
    setPageSizeAnchorEl(null);
  }, [searchParams, setSearchParams]);


  let previousPageButton = null;
  let nextPageButton = null;

  let labelText = count !== undefined ? `${count} items` : '---';

  if (pageSize) {
    const offset = (page - 1) * pageSize;

    if (count) {
      labelText = `${offset + 1} - ${Math.min(offset + pageSize, count)} of ${count}`;
    }

    previousPageButton = (
      <IconButton
        disabled={page <= 1}
        onClick={handlePreviousButtonClick}
        size="small"
      >
        <ChevronLeftIcon />
      </IconButton>
    );

    nextPageButton = (
      <IconButton
        disabled={!((offset + pageSize) < count)}
        onClick={handleNextButtonClick}
        size="small"
      >
        <ChevronRightIcon />
      </IconButton>
    );
  }

  if (props.label) {
    // An explicitly provided label takes precedence over all
    labelText = props.label;
  }

  let pageControl;
  if (pageSize && pageSizeChoices && pageSizeChoices.length > 1) {
    pageControl = (
      <Fragment>
        <Link
          aria-haspopup="true"
          onClick={handlePageSizeButtonClick}
          className={classes.pageSizeSelectButton}
          component={Button}
        >
          {labelText}
        </Link>

        <Menu
          anchorEl={pageSizeAnchorEl}
          keepMounted
          open={Boolean(pageSizeAnchorEl)}
          onClose={handlePageSizeMenuItemClick(null)}
          TransitionComponent={Fade}
        >
          {pageSizeChoices.map((value) => (
            <MenuItem
              key={value}
              onClick={handlePageSizeMenuItemClick(value)}
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
      <Typography className={classes.label}>
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
  label: PropTypes.string,
  pageSize: PropTypes.number,
  pageSizeChoices: PropTypes.array.isRequired,
  paginationInfo: PropTypes.object,
  onPageChange: PropTypes.func,
  onPageSizeChange: PropTypes.func,
  searchParams: PropTypes.object,
  setSearchParams: PropTypes.func,
};


export default React.memo(PaginationControl);
