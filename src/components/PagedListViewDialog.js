/**
*
* PagedListViewDialog
*
*/

import PropTypes from 'prop-types';
import React, {
  Fragment,
  useEffect,
  useRef,
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

import EditDialog from './EditDialog';
import PagedListView from './PagedListView';
import TextField from './TextField';

const styles = makeStyles((theme) => ({
  filterFieldContainer: {
    backgroundColor: theme.palette.background.paper,
    borderBottom: `2px solid ${theme.palette.grey[200]}`,
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

  dialogActions: {
    borderTop: `1px solid ${theme.palette.grey[300]}`,
    justifyContent: 'space-between',
  },

  tabsControlContainer: {
    backgroundColor: theme.palette.grey[200],
    borderBottom: `1px solid ${theme.palette.grey[300]}`
  },
}));

function PagedListViewDialog(props) {
  const {
    commitOnSelect,
    defaultFilterParams,
    dialogProps,
    fullHeight,
    onDismiss,
    listItemProps,
    ...pagedListViewProps
  } = props;

  const [listViewInfo, setListViewInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [addDialogIsOpen, setAddDialogIsOpen] = useState(false);
  const [filterTerm, setFilterTerm] = useState('');
  const [dialogTitle, setDialogTitle] = useState(null);

  const dialogRef = useRef(null);

  useEffect(() => {
    if (listViewInfo) {
      let title = typeof(props.title) === 'function' ? props.title() : props.title;
      setDialogTitle(title);
    } else {
      setDialogTitle('Loading...');
    }

  }, [listViewInfo]);


  //----------------------------------------------------------------------------
  const commit = () => {
    const selection = Array.from(listViewInfo.selection);
    onDismiss(selection);
  };

  //----------------------------------------------------------------------------
  const handleSelectionChange = (selection) => {
    if (commitOnSelect) {
      onDismiss(Array.from(selection));
    }
  };

  //----------------------------------------------------------------------------
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();

      commit();
    }
  };

  //----------------------------------------------------------------------------
  const handleEditDialogClose = () => {
    setAddDialogIsOpen(false);
  };

  const handleEditDialogSave = (record) => {
    // Add the newly saved item to the list's selection
    listViewInfo.extendSelection(record);
  };

  //----------------------------------------------------------------------------
  const classes = styles();

  const filterParams = { ...defaultFilterParams };
  if (filterTerm) {
    filterParams[props.searchFilterParam] = filterTerm;
  }

  return (
    <Fragment>
      <Dialog open
        classes={fullHeight ? { paper: classes.fullHeight } : null}
        onClose={() => { onDismiss(null); }}
        onKeyDown={handleKeyDown}
        ref={dialogRef}
        {...dialogProps}
      >
        <DialogTitle className={classes.dialogTitle} disableTypography>
          <Box className={classes.dialogTitleContent}>
            <Box flex="1">
              <Typography component="h2" variant="h6">
                {dialogTitle}
              </Typography>

              {listViewInfo &&
                <Typography variant="subtitle2" color="textSecondary">
                  {`${listViewInfo.selection.size} selected`}
                </Typography>
              }
            </Box>

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
            {...pagedListViewProps}
            defaultFilterParams={filterParams}
            listItemProps={{
              ...(listItemProps || {}),
              commitOnSelect: props.commitOnSelect,
              isLink: false,
            }}
            onConfig={(config) => { setListViewInfo(config); }}
            onSelectionChange={handleSelectionChange}
            paginated={props.paginated}
            selectionDisabled={false}
            selectionMode={commitOnSelect ? 'single' : props.selectionMode}
            selectOnClick
          />
        </DialogContent>

        <DialogActions className={classes.dialogActions}>
          {props.apiCreateUrl &&
            <Button onClick={() => { setAddDialogIsOpen(true); }}>
              Create
            </Button>
          }

          {(listViewInfo && listViewInfo.toolbarItems.paginationControl) ? (
            listViewInfo.toolbarItems.paginationControl
          ) : (
            <Spacer />
          )}

          {!commitOnSelect &&
            <Button
              color="primary"
              disabled={!(listViewInfo && listViewInfo.selection.size)}
              key="commitButton"
              onClick={() => { commit(); }}
            >
              Choose
            </Button>
          }
        </DialogActions>
      </Dialog>

      {addDialogIsOpen &&
        <EditDialog
          apiCreateUrl={props.apiCreateUrl}
          entityType={props.entityType}
          onClose={handleEditDialogClose}
          onSave={handleEditDialogSave}
          {...props.editDialogProps}
        />
      }

    </Fragment>


  );
}

PagedListViewDialog.propTypes = {
  apiCreateUrl: PropTypes.string,
  commitOnSelect: PropTypes.bool,
  dialogProps: PropTypes.object,
  displayMode: PropTypes.string,
  fullHeight: PropTypes.bool,
  onDismiss: PropTypes.func,
  paginated: PropTypes.bool,
  searchFilterParam: PropTypes.string,
  selectOnClick: PropTypes.bool,
  selectionMode: PropTypes.oneOf(['single', 'multiple']),
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
};

PagedListViewDialog.defaultProps = {
  commitOnSelect: false,
  dialogProps: { fullWidth: true },
  displayMode: 'list',
  fullHeight: true,
  paginated: true,
  selectionMode: 'multiple',
  selectOnClick: true,
};

export default PagedListViewDialog;
