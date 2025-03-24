import PropTypes from 'prop-types';
import React, { useState } from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';

const styles = makeStyles((theme) => ({
  dialogTitle: {
    padding: 0,
  },

  dialogTitleHeader: {
    alignItems: 'center',
    borderBottom: `1px solid ${theme.palette.divider}`,
    display: 'flex',
    padding: theme.spacing(1, 3),
  },

  titleHeading: {
    flex: 1,
  },

  stepper: {
    padding: theme.spacing(3, 2, 1),
  },

  dialogContent: {
    padding: theme.spacing(2, 3),
  },


  dialogActions: {
    borderTop: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(1, 2),
  },
}));

function WizardDialog(props) {
  const classes = styles();

  const {
    onDismiss,
    steps,
    title,
    ...dialogProps
  } = props;

  const [activeStep, setActiveStep] = useState(0);

  const activeStepConfig = steps[activeStep];

  if (activeStepConfig.dialogProps) {
    Object.assign(dialogProps, activeStepConfig.dialogProps);
  }

  let commitButtonTitle = activeStepConfig.commitButtonTitle;
  if (!commitButtonTitle) {
    if (activeStep === steps.length - 1) {
      commitButtonTitle = 'Done';
    } else {
      commitButtonTitle = 'Next';
    }
  }
  let commitButtonDisabled = false;
  if (activeStepConfig.valid !== undefined && !activeStepConfig.valid) {
    commitButtonDisabled = true;
  }


  const handleCommitButtonClick = () => {
    if (activeStep === steps.length - 1) {
      onDismiss(true);
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  return (
    <Dialog {...dialogProps}>
      <DialogTitle
        className={classes.dialogTitle}
        disableTypography
      >
        <header className={classes.dialogTitleHeader}>
          <Typography variant="h2" className={classes.titleHeading}>
            {title}
          </Typography>
          <IconButton
            edge="end"
            onClick={() => onDismiss(null)}
          >
            <CloseIcon />
          </IconButton>
        </header>

        <Stepper
          alternativeLabel
          activeStep={activeStep}
          className={classes.stepper}
        >
          {steps.map((step) => (
            <Step key={step.title}>
              <StepLabel>{step.title}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </DialogTitle>

      <DialogContent className={classes.dialogContent}>
        {activeStepConfig.content}
      </DialogContent>

      <DialogActions className={classes.dialogActions}>
        <Button onClick={() => onDismiss(null)}>
          Cancel
        </Button>

        {activeStep > 0 &&
          <Button onClick={() => setActiveStep(activeStep - 1)}>
            Previous
          </Button>
        }

        <Button
          color="primary"
          disabled={commitButtonDisabled}
          onClick={handleCommitButtonClick}
          variant="contained"
        >
          {commitButtonTitle}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

WizardDialog.propTypes = {
  onDismiss: PropTypes.func.isRequired,
  steps: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
};

export default WizardDialog;
