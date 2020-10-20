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

import SearchField from './SearchField';
import Spacer from './Spacer';

import EditDialog from './EditDialog';
import PagedListView from './PagedListView';

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

  dialogTitleContentContainer: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(0.5, 2),
  },

  dialogTitleContent: {
    fontSize: theme.typography.pxToRem(20),
    fontWeight: 500,
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
    filterParams,
    dialogProps,
    fullHeight,
    onDismiss,
    listItemProps,
    searchFilterParam,
    ...pagedListViewProps
  } = props;

  const [listViewConfig, setListViewConfig] = useState(null);
  const [listViewToolbarItems, setListViewToolbarItems] = useState(null);
  const [loading, setLoading] = useState(false);
  const [addDialogIsOpen, setAddDialogIsOpen] = useState(false);
  const [appliedFilterParams, setAppliedFilterParams] = useState(filterParams);
  const [dialogTitle, setDialogTitle] = useState(null);

  const dialogRef = useRef(null);

  useEffect(() => {
    if (listViewConfig) {
      let title = typeof(props.title) === 'function' ? props.title() : props.title;
      setDialogTitle(title);
    } else {
      setDialogTitle('Loading...');
    }
  }, [listViewConfig]);


  //----------------------------------------------------------------------------
  const commit = () => {
    const selection = Array.from(listViewConfig.selection);
    onDismiss(selection);
  };

  //----------------------------------------------------------------------------
  const handleSelectionChange = (selection) => {
    if (commitOnSelect) {
      onDismiss(Array.from(selection));
    }
  };

  //----------------------------------------------------------------------------
  const handlePageChange = (page) => {
    setAppliedFilterParams({
      ...appliedFilterParams,
      page
    });
  };

  //----------------------------------------------------------------------------
  const handleSearchFieldChange = (value) => {
    setAppliedFilterParams({
      ...appliedFilterParams,
      [searchFilterParam]: value
    });
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
    listViewConfig.extendSelection(record);
  };

  //----------------------------------------------------------------------------
  const classes = styles();

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
          <Box className={classes.dialogTitleContentContainer}>
            <Box flex="1">
              <Typography component="h3" className={classes.dialogTitleContent}>
                {dialogTitle}
              </Typography>

              {(props.selectionMode === 'multiple' && listViewConfig) &&
                <Typography variant="subtitle2" color="textSecondary">
                  {`${listViewConfig.selection.size} selected`}
                </Typography>
              }
            </Box>

            <IconButton onClick={() => onDismiss(null)} edge="end">
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
              <SearchField
                autoFocus
                fullWidth
                margin="dense"
                onTimeout={handleSearchFieldChange}
              />
            </Box>
          }

          {(listViewToolbarItems && listViewToolbarItems.tabsControl) &&
            <Box className={classes.tabsControlContainer}>
              {listViewToolbarItems.tabsControl}
            </Box>
          }
        </DialogTitle>

        <DialogContent className={classes.dialogContent}>
          <PagedListView
            {...pagedListViewProps}
            filterParams={appliedFilterParams}
            listItemProps={{
              ...(listItemProps || {}),
              commitOnSelect: props.commitOnSelect,
            }}
            onConfig={setListViewConfig}
            onPageChange={handlePageChange}
            onSelectionChange={handleSelectionChange}
            onToolbarChange={setListViewToolbarItems}
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

          {(listViewToolbarItems && listViewToolbarItems.paginationControl) ? (
            listViewToolbarItems.paginationControl
          ) : (
            <Spacer />
          )}

          {!commitOnSelect &&
            <Button
              color="primary"
              disabled={!(listViewConfig && listViewConfig.selection.size)}
              key="commitButton"
              onClick={() => commit()}
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
