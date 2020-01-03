/**
*
* PagedListViewDialog
*
*/

import PropTypes from 'prop-types';
import React, {
  Fragment,
  useEffect,
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
  filterFieldContainer: {
    backgroundColor: theme.palette.grey[200],
    borderBottom: `1px solid ${theme.palette.background.default}`,
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
  },

  fullHeight: {
    height: `calc(100% - ${theme.spacing(12)}px)`,
  },

  dialogTitle: {
    backgroundColor: theme.palette.grey[300],
    padding: 0,
  },

  dialogTitleContent: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    padding: `${theme.spacing(0.5)}px ${theme.spacing(2)}px`,
  },

  dialogContent: {
    padding: 0,
  },

  tabsControlContainer: {
    backgroundColor: theme.palette.grey[200],
    borderBottom: `1px solid ${theme.palette.grey[300]}`
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
  const [listViewInfo, setListViewInfo] = useState(null);
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


  const classes = styles();

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
        <Box className={classes.dialogTitleContent}>
          <Typography component="h2" variant="h6">
            {typeof(title) === 'function' ? props.title() : props.title}
          </Typography>

          <IconButton onClick={() => { onDismiss(null); }} edge="end">
            <CloseIcon />
          </IconButton>
        </Box>

        <LinearProgress
          className={classes.progressBar}
          variant={loading ? 'indeterminate' : 'determinate' }
          value={0}
        />

        {props.searchFilterParam &&
          <Box className={classes.filterFieldContainer}>
            <TextField
              autoFocus
              fullWidth
              margin="dense"
              onTimeout={(value) => { setFilterTerm(value); }}
              timeoutDelay={500}
              placeholder="Filter by search term..."
              variant="outlined"
            />
          </Box>
        }

        {(listViewInfo && listViewInfo.toolbarItems.tabsControl) &&
          <Box className={classes.tabsControlContainer}>
            {listViewInfo.toolbarItems.tabsControl}
          </Box>
        }
      </DialogTitle>

      <DialogContent className={classes.dialogContent}>
        <PagedListView
          defaultFilterParams={
            filterTerm ? { [props.searchFilterParam]: filterTerm } : null
          }
          listItemProps={{ isLink: false }}
          onConfig={(config) => { setListViewInfo(config); }}
          onSelectionChange={handleSelectionChange}
          selectionAlways
          selectOnClick
          {...pagedListViewProps}
        />
      </DialogContent>

      <DialogActions>
        {listViewInfo && (
          listViewInfo.toolbarItems.paginationControl
        )}

        <Spacer />

        {!commitOnSelect &&
          <Button
            color="primary"
            disabled={!selectedItems.length}
            key="commitButton"
            onClick={() => { onDismiss(selectedItems); }}
          >
            Choose
          </Button>
        }
      </DialogActions>
    </Dialog>
  );
}

PagedListViewDialog.propTypes = {
  commitOnSelect: PropTypes.bool,
  dialogProps: PropTypes.object,
  displayMode: PropTypes.string,
  fullHeight: PropTypes.bool,
  onDismiss: PropTypes.func,
  searchFilterParam: PropTypes.string,
  selectOnClick: PropTypes.bool,
  selectionAlways: PropTypes.bool,
  selectionMode: PropTypes.oneOf(['single', 'multiple']),
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
};

PagedListViewDialog.defaultProps = {
  commitOnSelect: false,
  dialogProps: { fullWidth: true },
  displayMode: 'list',
  fullHeight: true,
  selectionAlways: true,
  selectionMode: 'multiple',
  selectOnClick: true,
};

export default PagedListViewDialog;
