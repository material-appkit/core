import clsx from 'clsx';

import PropTypes from 'prop-types';
import React, { useCallback } from 'react';

import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import { isWidthUp } from '@material-ui/core/withWidth';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';

import { useWidth } from '../util/hooks';
import { SlideUpTransition } from "../util/transitions";


const styles = makeStyles(
  (theme) => theme.mixins.simpleDialog,
);

function SimpleDialog(props) {
  const coreClasses  = styles();
  const breakpoint = useWidth();

  const {
    actions,
    classes = {},
    contentPadding = 16,
    dialogActionsProps = { disableSpacing: true },
    dialogContentRef,
    dismiss,
    fullscreenBreakpoint = 'sm',
    height,
    loading,
    onClose,
    PaperProps,
    subtitle,
    title,
    titleIcon,
    titleAccessoryView = null,
    transitionProps,
    ...dialogProps
  } = props;

  const handleCloseButtonClick = useCallback((e) => {
    if (dismiss) {
      dismiss(null);
    } else {
      onClose(e, 'closeButtonClick');
    }
  }, [dismiss, onClose]);

  const fullScreen = fullscreenBreakpoint && !isWidthUp(fullscreenBreakpoint, breakpoint);

  const appliedPaperProps = PaperProps || {};
  if (height && !fullScreen) {
    appliedPaperProps.style = { height };
  }

  return (
    <Dialog
      fullScreen={fullScreen}
      onClose={onClose}
      PaperProps={appliedPaperProps}
      TransitionComponent={fullScreen ? SlideUpTransition : undefined }
      TransitionProps={transitionProps}
      {...dialogProps}
    >
      <DialogTitle
        className={clsx(coreClasses.dialogTitle, classes.dialogTitle)}
        disableTypography
      >
        <Box display="flex" alignItems="center" width="100%" px={2} py={1} gap={8}>
          {titleIcon}
          <div className={coreClasses.headingContainer}>
            <Typography component="h1" variant="h3" className={classes.dialogHeading}>
              {title}
            </Typography>

            {subtitle && (
              <Typography className={clsx(coreClasses.dialogSubtitle, classes.dialogSubtitle)}>
                {subtitle}
              </Typography>
            )}
          </div>

          <IconButton edge="end" onClick={handleCloseButtonClick}>
            <CloseIcon />
          </IconButton>
        </Box>

        {titleAccessoryView}

        {loading &&
          <LinearProgress />
        }

      </DialogTitle>

      <DialogContent
        className={classes.dialogContent}
        dividers
        ref={dialogContentRef}
        style={{ padding: contentPadding }}
      >
        {props.children}
      </DialogContent>

      {actions &&
        <DialogActions
          className={clsx(coreClasses.dialogActions, classes.dialogActions)}
          {...dialogActionsProps}
        >
          {actions}
        </DialogActions>
      }
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  breakpoint: PropTypes.string,
  actions: PropTypes.any,
  children: PropTypes.any,
  classes: PropTypes.object,
  contentPadding: PropTypes.number,
  dialogActionsProps: PropTypes.object,
  dialogContentRef: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  dismiss: PropTypes.func,
  fullscreenBreakpoint: PropTypes.string,
  fullWidth: PropTypes.bool,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  loading: PropTypes.bool,
  maxWidth: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  subtitle: PropTypes.string,
  title: PropTypes.string.isRequired,
  titleIcon: PropTypes.element,
  titleAccessoryView: PropTypes.element,
  transitionProps: PropTypes.object,
};

SimpleDialog.defaultProps = {
  fullWidth: true,
  maxWidth: 'sm',
};

export default SimpleDialog;
