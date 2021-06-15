import PropTypes from 'prop-types';
import React, {
  Fragment,
  useCallback,
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
import SearchIcon from '@material-ui/icons/Search';

import AttributedTextField from './AttributedTextField';
import Spacer from './Spacer';

import EditDialog from './EditDialog';
import ListView from './ListView';

const styles = makeStyles((theme) => ({
  filterFieldContainer: {
    backgroundColor: theme.palette.background.paper,
    borderBottom: `2px solid ${theme.palette.grey[200]}`,
    padding: theme.spacing(1, 2),
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

function ListViewDialog(props) {
  const classes = styles();

  const {
    apiCreateUrl,
    commitOnSelect,
    filterParams,
    dialogProps,
    fullHeight,
    onDismiss,
    listItemProps,
    searchFilterParam,
    selectionMode,
    title,
    ...listViewProps
  } = props;
  

  const [listViewConfig, setListViewConfig] = useState(null);
  const [listViewToolbarItems, setListViewToolbarItems] = useState(null);
  const [loading, setLoading] = useState(false);
  const [addDialogIsOpen, setAddDialogIsOpen] = useState(false);
  const [appliedFilterParams, setAppliedFilterParams] = useState(null);
  const [dialogTitle, setDialogTitle] = useState(() => (
    typeof(title) === 'function' ? title() : title
  ));

  const dialogRef = useRef(null);


  useEffect(() => {
    if (filterParams) {
      setAppliedFilterParams(filterParams);
    } else {
      setAppliedFilterParams({});
    }
  }, [filterParams]);

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
  const handleSearchFieldChange = useCallback((value) => {
    setAppliedFilterParams({
      ...appliedFilterParams,
      [searchFilterParam]: value
    });
  }, []);

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

              {(selectionMode === 'multiple' && listViewConfig) &&
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
            variant={loading ? 'indeterminate' : 'determinate'}
            value={0}
          />

          {props.searchFilterParam &&
            <Box className={classes.filterFieldContainer}>
              <AttributedTextField
                autoFocus
                fullWidth
                margin="dense"
                onChange={handleSearchFieldChange}
                onChangeDelay={500}
                propagateChangeEvent={false}
                StartIcon={SearchIcon}
                variant="outlined"
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
          <ListView
            {...listViewProps}
            displaySelectionCount={false}
            filterParams={appliedFilterParams}
            listItemProps={{
              ...(listItemProps || {}),
              commitOnSelect: props.commitOnSelect,
            }}
            loadingVariant="circular"
            onConfig={setListViewConfig}
            onLoad={() => setLoading(true)}
            onLoadComplete={() => setLoading(false)}
            onPageChange={handlePageChange}
            onSelectionChange={handleSelectionChange}
            onToolbarChange={setListViewToolbarItems}
            selectionDisabled={false}
            selectionMode={commitOnSelect ? 'single' : selectionMode}
            selectOnClick
          />
        </DialogContent>

        <DialogActions
          className={classes.dialogActions}
          disableSpacing
        >
          {apiCreateUrl &&
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
          apiCreateUrl={apiCreateUrl}
          entityType={props.entityType}
          onClose={handleEditDialogClose}
          onSave={handleEditDialogSave}
          {...props.editDialogProps}
        />
      }
    </Fragment>
  );
}

ListViewDialog.propTypes = {
  apiCreateUrl: PropTypes.string,
  commitOnSelect: PropTypes.bool,
  dialogProps: PropTypes.object,
  entityType: PropTypes.string,
  fullHeight: PropTypes.bool,
  onDismiss: PropTypes.func,
  searchFilterParam: PropTypes.string,
  selectionMode: PropTypes.oneOf(['single', 'multiple']),
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
};

ListViewDialog.defaultProps = {
  commitOnSelect: false,
  dialogProps: { fullWidth: true },
  fullHeight: true,
  selectionMode: 'multiple',
};

export default ListViewDialog;
