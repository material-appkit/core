import clsx from 'clsx';
import PropTypes from 'prop-types';

import React, { useCallback } from 'react';

import MUIDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';

const styles = makeStyles((theme) => ({
  root: {
    alignItems: 'center',
    backgroundColor: theme.palette.grey[100],
    borderBottom: `1px solid ${theme.palette.divider}`,
    display: 'flex',
    padding: theme.spacing(2),
    position: 'relative',
  },

  closable: {
    padding: theme.spacing(1, 2),
  },

  title: {
    flex: 1,
  },
}));

function DialogTitle(props) {
  const classes = styles();

  const {
    closable = true,
    onCloseButtonClick,
    title
  } = props;

  const handleCloseButtonClick = useCallback((e) => {
    onCloseButtonClick(e);
  }, [onCloseButtonClick]);

  return (
    <MUIDialogTitle
      className={clsx(
        classes.root,
        closable ? classes.closable : null,
      )}
      disableTypography
    >
      <Typography
        className={classes.title}
        component="h2"
        variant="h3"
      >
        {title}
      </Typography>

      {closable && (
        <IconButton
          edge="end"
          onClick={handleCloseButtonClick}
        >
          <CloseIcon />
        </IconButton>
      )}
    </MUIDialogTitle>
  );
}

DialogTitle.propTypes = {
  closable: PropTypes.bool,
  onCloseButtonClick: PropTypes.func,
  title: PropTypes.string.isRequired,
};

export default DialogTitle;
