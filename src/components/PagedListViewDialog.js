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
    border: `1px solid ${theme.palette.grey[200]}`,
    display: 'flex',
    padding: `${theme.spacing(0.5)}px 0`,
  },

  dialogContent: {
    padding: theme.spacing(1),
  },

  dialogTitleTypography: {
    fontSize: theme.typography.pxToRem(16),
    flex: 1,
    paddingLeft: theme.spacing(2),
  },

}));

function PagedListViewDialog(props) {
  const {
    onDismiss,
    dialogProps,
    ...pagedListViewProps
  } = props;


  const [selectedItems, setSelectedItems] = useState([]);
  const [listViewInfo, setListViewInfo] = useState({});

  /**
   *
   */
  const handleSelectionChange = (selection) => {
    if (!selection) {
      setSelectedItems([]);
    } else {
      if (Array.isArray(selection)) {
        setSelectedItems(selection);
      } else {
        setSelectedItems([selection]);
      }
    }
  };


  let title = props.title;
  if (typeof(title) === 'function') {
    title = title();
  }

  const classes = styles();

  return (
    <Dialog
      onClose={() => { onDismiss(null); }}
      open
      {...dialogProps}
    >
      <DialogTitle className={classes.dialogTitle} disableTypography>
        <Typography component="h1" className={classes.dialogTitleTypography}>
          {title}
        </Typography>

        <IconButton onClick={() => { onDismiss(null); }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent className={classes.dialogContent}>
        <PagedListView
          onConfig={(config) => { setListViewInfo(config); }}
          onSelectionChange={handleSelectionChange}
          {...pagedListViewProps}

        />
      </DialogContent>

      <DialogActions>
        {listViewInfo.toolbarItems}
        <Spacer />
        <Button
          color="primary"
          disabled={!selectedItems.length}
          onClick={() => { onDismiss(selectedItems); }}
        >
          Choose
        </Button>
      </DialogActions>
    </Dialog>
  );
}

PagedListViewDialog.propTypes = {
  dialogProps: PropTypes.object,
  onDismiss: PropTypes.func,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
};

PagedListViewDialog.defaultProps = {
  dialogProps: {},
};

export default PagedListViewDialog;
