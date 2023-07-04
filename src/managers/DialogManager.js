import React  from 'react';

import { timestamp } from '../util/date';

const DEFAULT_DIALOG_CONFIG = {
  reasonsToClose: ['closeButtonClick', 'escapeKeyDown'],
};


class DialogManager extends React.PureComponent {
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
    updatedDialogs.set(dialogConfig.id, {
      ...DEFAULT_DIALOG_CONFIG,
      ...dialogConfig
    });
    this.setState({ dialogs: updatedDialogs });
  };

  __destroyDialog = (dialogId) => {
    const updatedDialogs = new Map(this.state.dialogs);
    updatedDialogs.delete(dialogId);
    this.setState({ dialogs: updatedDialogs });
  }

  handleDialogClose = (dialogId) => (e, reason) => {
    const dialogConfig = this.state.dialogs.get(dialogId);
    const { onDismiss, reasonsToClose } = dialogConfig;

    if (Array.isArray(reasonsToClose) && reasonsToClose.indexOf(reason) !== -1)  {
      if (onDismiss) {
        onDismiss(null);
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

    return dialogEntries.map((entry) => {
      const [dialogId, dialogConfig] = entry;
      const { DialogComponent, context } = dialogConfig;

      const dialogProps = {
        ...(context || {}),
        key: dialogId,
        dismiss: this.dismissDialog(dialogId),
        onClose: this.handleDialogClose(dialogId),
        open: true,
      };

      return <DialogComponent {...dialogProps} />;
    });
  }
}

export default DialogManager;
