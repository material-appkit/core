import React  from 'react';

import { isWidthUp } from '@material-ui/core/withWidth';

import { timestamp } from '../util/date';


class DialogManager extends React.PureComponent {
  static init(ContextType) {
    this.contextType = ContextType;
  }

  constructor(props) {
    super(props);

    this.state = {
      dialogs: new Map(),
    };

    DialogManager.__instance = this;
  }

  // ---------------------------------------------------------------------------
  static show(dialogConfig) {
    const dialogId = timestamp();

    DialogManager.__instance.__enqueueDialog({
      id: dialogId,
      ...dialogConfig,
    });

    return dialogId;
  }

  __enqueueDialog = (dialogConfig) => {
    const updatedDialogs = new Map(this.state.dialogs);
    updatedDialogs.set(dialogConfig.id, dialogConfig);
    this.setState({ dialogs: updatedDialogs });
  };

  __destroyDialog = (dialogId) => {
    const updatedDialogs = new Map(this.state.dialogs);
    updatedDialogs.delete(dialogId);
    this.setState({ dialogs: updatedDialogs });
  }

  handleDialogClose = (dialogId) => (e, reason) => {
    if (reason === 'escapeKeyDown') {
      const dialogConfig = this.state.dialogs.get(dialogId);
      if (dialogConfig.onDismiss) {
        dialogConfig.onDismiss(null);
      }

      this.__destroyDialog(dialogId);
    }
  };

  dismissDialog = (dialogId) => (value) => {
    const dialogConfig = this.state.dialogs.get(dialogId);
    if (dialogConfig.onDismiss) {
      dialogConfig.onDismiss(value);
    }

    this.__destroyDialog(dialogId);
  };

  // ---------------------------------------------------------------------------
  render() {
    const dialogEntries = Array.from(this.state.dialogs.entries());
    const { breakpoint } = this.context;

    return dialogEntries.map((entry) => {
      const [dialogId, dialogConfig] = entry;
      const {
        DialogComponent,
        dialogProps,
        fullScreenBreakpoint,
        size,
      } = dialogConfig;

      const appliedDialogProps = {...(dialogProps || {})};

      const isFullScreen = !isWidthUp(fullScreenBreakpoint, breakpoint);
      if (isFullScreen) {
        appliedDialogProps.fullScreen = true;
      } else {
        appliedDialogProps.fullWidth = true;
        appliedDialogProps.maxWidth = size || 'sm';
      }

      return (
        <DialogComponent
          key={dialogId}
          dismiss={this.dismissDialog(dialogId)}
          onClose={this.handleDialogClose(dialogId)}
          open
          {...appliedDialogProps}
        />
      );
    });
  }
}

export default DialogManager;
