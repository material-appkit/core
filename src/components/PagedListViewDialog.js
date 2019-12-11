/**
*
* PagedListViewDialog
*
*/

import PropTypes from 'prop-types';
import React, {
  useState,
} from 'react';


import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';

import Spacer from '@material-appkit/core/components/Spacer';

import PagedListView from './PagedListView';
import TextField from './TextField';

const styles = makeStyles((theme) => ({
  fullHeight: {
    height: `calc(100% - ${theme.spacing(12)}px)`,
  },

  dialogTitle: {
    alignItems: 'center',
    backgroundColor: theme.palette.grey[200],
    display: 'flex',
    justifyContent: 'space-between',
    padding: `${theme.spacing(0.5)}px ${theme.spacing(2)}px`,
  },

  dialogContent: {
    padding: 0,
  },
}));

function PagedListViewDialog(props) {
  const {
    commitOnSelect,
    fullHeight,
    onDismiss,
    dialogProps,
    ...pagedListViewProps
  } = props;

  const [selectedItems, setSelectedItems] = useState([]);
  const [listViewInfo, setListViewInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [filterTerm, setFilterTerm] = useState('');

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

  const handleSearchFilterChange = (value) => {
    setFilterTerm(value);
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

  const defaultFilterParams = {};
  if (filterTerm) {
    defaultFilterParams[props.searchFilterParam] = filterTerm;
  }

  const dialogClasses = {};
  if (fullHeight) {
    dialogClasses.paper = classes.fullHeight;
  }

  return (
    <Dialog open
      classes={dialogClasses}
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
        {props.searchFilterParam &&
          <Box px={2} py={1}>
            <TextField
              autoFocus
              className={classes.filterField}
              fullWidth
              margin="dense"
              onTimeout={handleSearchFilterChange}
              timeoutDelay={500}
              placeholder="Filter by search term..."
              variant="outlined"
            />
          </Box>
        }

        <LinearProgress
          className={classes.progressBar}
          variant={loading ? 'indeterminate' : 'determinate' }
          value={0}
        />

        <PagedListView
          defaultFilterParams={defaultFilterParams}
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
  fullHeight: PropTypes.bool,
  onDismiss: PropTypes.func,
  searchFilterParam: PropTypes.string,
  selectionMode: PropTypes.oneOf(['single', 'multiple']),
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
};

PagedListViewDialog.defaultProps = {
  commitOnSelect: false,
  fullHeight: true,
  dialogProps: {},
  selectionMode: 'single',
};

export default PagedListViewDialog;
