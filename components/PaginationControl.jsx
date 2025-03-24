import PropTypes from 'prop-types';
import React, { Fragment, useCallback, useState } from 'react';

import Box from '@material-ui/core/Box';
import ButtonBase from '@material-ui/core/ButtonBase';
import Fade from '@material-ui/core/Fade';
import IconButton from '@material-ui/core/IconButton';
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
    fontWeight: 500,
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.fontSize,
    minWidth: 'unset',
    padding: theme.spacing(1),

    '&:hover': {
      textDecoration: 'underline',
    },
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
    const previousPageIndex = page - 1;
    if (searchParams && setSearchParams) {
      const updatedSearchParams = new URLSearchParams(searchParams);
      updatedSearchParams.set('page', previousPageIndex);
      setSearchParams(updatedSearchParams);
    } else if (onPageChange) {
      onPageChange(previousPageIndex);
    }
  }, [onPageChange, page, searchParams, setSearchParams]);


  const handleNextButtonClick = useCallback(() => {
    const nextPageIndex = page + 1;
    if (searchParams && setSearchParams) {
      const updatedSearchParams = new URLSearchParams(searchParams);
      updatedSearchParams.set('page', nextPageIndex);
      setSearchParams(updatedSearchParams);
    } else if (onPageChange) {
      onPageChange(nextPageIndex);
    }
  }, [onPageChange, page, searchParams, setSearchParams]);


  const handlePageSizeButtonClick = useCallback((e) => {
    setPageSizeAnchorEl(e.currentTarget);
  }, []);

  const handlePageSizeMenuItemClick = useCallback((value) => () => {
    if (value) {
      if (searchParams && setSearchParams) {
        const updatedSearchParams = new URLSearchParams(searchParams);
        updatedSearchParams.set('page', 1);
        updatedSearchParams.set('page_size', value);
        setSearchParams(updatedSearchParams);
      } else if (onPageSizeChange) {
        onPageSizeChange(value);
      }
    }
    setPageSizeAnchorEl(null);
  }, [onPageSizeChange, searchParams, setSearchParams]);


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
        <ButtonBase
          aria-haspopup="true"
          onClick={handlePageSizeButtonClick}
          className={classes.pageSizeSelectButton}
        >
          {labelText}
        </ButtonBase>

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
  label: PropTypes.string,
  pageSizeChoices: PropTypes.array,
  paginationInfo: PropTypes.object,
  onPageChange: PropTypes.func,
  onPageSizeChange: PropTypes.func,
  searchParams: PropTypes.object,
  setSearchParams: PropTypes.func,
};


export default React.memo(PaginationControl);
