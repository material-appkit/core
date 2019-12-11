/**
*
* PagedListViewDialog
*
*/

import PropTypes from 'prop-types';
import React, {
  useState,
} from 'react';


import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';

import Spacer from '@material-appkit/core/components/Spacer';

import PagedListView from './PagedListView';

const styles = makeStyles((theme) => ({
  dialogTitle: {
    alignItems: 'center',
    backgroundColor: theme.palette.grey[200],
    borderBottom: `1px solid ${theme.palette.grey[400]}`,
    display: 'flex',
    justifyContent: 'space-between',
    padding: `${theme.spacing(0.5)}px ${theme.spacing(2)}px`,
  },

  dialogContent: {
    padding: theme.spacing(1),
  },

  dialogTitleTypography: {
    fontSize: theme.typography.pxToRem(16),
  },

}));

function PagedListViewDialog(props) {
  const {
    commitOnSelect,
    onDismiss,
    dialogProps,
    ...pagedListViewProps
  } = props;

  const [selectedItems, setSelectedItems] = useState([]);
  const [listViewInfo, setListViewInfo] = useState({});

  const handleSelectionChange = (selection) => {
    if (!selection) {
      setSelectedItems([]);
      return;
    }

    let newSelection = selection;
    if (!Array.isArray(selection)) {
      newSelection = [newSelection];
    }
    setSelectedItems(newSelection);

    if (commitOnSelect) {
      onDismiss(newSelection);
    }
  };


  let title = props.title;
  if (typeof(title) === 'function') {
    title = title();
  }

  const toolbarItems = [];
  if (listViewInfo.toolbarItems && pagedListViewProps.pageSize) {
    let pagingToolbarItem = null;
    if (pagedListViewProps.selectionAlways) {
      pagingToolbarItem = listViewInfo.toolbarItems[0];
    } else {
      pagingToolbarItem = listViewInfo.toolbarItems[1];
    }
    toolbarItems.push(pagingToolbarItem);
  }

  if (!commitOnSelect) {
    toolbarItems.push(<Spacer key="spacer" />);
    toolbarItems.push(
      <Button
        color="primary"
        disabled={!selectedItems.length}
        key="commitButton"
        onClick={() => { onDismiss(selectedItems); }}
      >
        Choose
      </Button>
    )
  }

  const classes = styles();

  return (
    <Dialog
      open
      onClose={() => { onDismiss(null); }}
      {...dialogProps}
    >
      <DialogTitle className={classes.dialogTitle} disableTypography>
        <Typography component="h2" variant="h6">
          {title}
        </Typography>

        <IconButton onClick={() => { onDismiss(null); }} edge="end">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent className={classes.dialogContent}>
        <PagedListView
          onConfig={(config) => { setListViewInfo(config); }}
          onSelectionChange={handleSelectionChange}
          selectionAlways
          {...pagedListViewProps}
        />
      </DialogContent>

      <DialogActions>
        {toolbarItems}
      </DialogActions>
    </Dialog>
  );
}

PagedListViewDialog.propTypes = {
  commitOnSelect: PropTypes.bool,
  dialogProps: PropTypes.object,
  onDismiss: PropTypes.func,
  selectionMode: PropTypes.oneOf(['single', 'multiple']),
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
};

PagedListViewDialog.defaultProps = {
  commitOnSelect: false,
  dialogProps: {},
  selectionMode: 'single',
};

export default PagedListViewDialog;
