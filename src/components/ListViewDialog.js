import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

import SimpleDialog from "./SimpleDialog";
import SearchField from './widgets/SearchField';
import EditDialog from './EditDialog';
import ListView from './ListView';
import Spacer from './Spacer';


const styles = makeStyles((theme) => ({
  filterFieldContainer: {
    backgroundColor: theme.palette.grey[100],
    padding: theme.spacing(0.5, 2),
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
    flexDirection: 'row !important',
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
    commitOnSelect = false,
    filterParams,
    dialogProps,
    dismiss,
    maxWidth = 'xs',
    onDismiss,
    listItemProps,
    searchFilterParam,
    selectionMode = 'multiple',
    title,
    ...listViewProps
  } = props;

  const [listViewConfig, setListViewConfig] = useState(null);
  const [listViewSelection, setListViewSelection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [addDialogIsOpen, setAddDialogIsOpen] = useState(false);
  const [appliedFilterParams, setAppliedFilterParams] = useState(null);
  const [paginationControlProps] = useState({});

  const dialogTitle = useMemo(() => (
    typeof(title) === 'function' ? title() : title
  ), [title]);

  //----------------------------------------------------------------------------
  useEffect(() => {
    if (filterParams) {
      setAppliedFilterParams(filterParams);
    } else {
      setAppliedFilterParams({});
    }
  }, [filterParams]);

  const dismissDialog = useCallback((value = null) => {
    if (dismiss) {
      dismiss(value);
    } else if (onDismiss) {
      onDismiss(value);
    } else {
      throw new Error('ListViewDialog requires prop "dismiss" or "onDismiss"');
    }
  }, [dismiss, onDismiss]);


  //----------------------------------------------------------------------------
  const commit = useCallback(() => {
    dismissDialog(Array.from(listViewSelection));
  }, [listViewSelection, dismissDialog]);

  //----------------------------------------------------------------------------
  const handleSelectionChange = useCallback((selection) => {
    setListViewSelection(selection);

    if (commitOnSelect) {
      dismissDialog(Array.from(selection));
    }
  }, [commitOnSelect, dismissDialog]);

  //----------------------------------------------------------------------------
  const handlePageChange = useCallback((page) => {
    setAppliedFilterParams({ ...appliedFilterParams, page });
  }, []);

  //----------------------------------------------------------------------------
  const handleSearchFieldChange = useCallback((value) => {
    setAppliedFilterParams({
      ...appliedFilterParams,
      [searchFilterParam]: value
    });
  }, [appliedFilterParams, searchFilterParam]);

  //----------------------------------------------------------------------------
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();

      commit();
    }
  }, [commit]);

  //----------------------------------------------------------------------------
  const handleEditDialogClose = () => {
    setAddDialogIsOpen(false);
  };

  const handleEditDialogSave = (record) => {
    // Add the newly saved item to the list's selection
    listViewConfig.extendSelection(record);
  };

  const dialogActions = useMemo(() => {
    let paginationControl = null;
    if (listViewConfig) {
      paginationControl = listViewConfig.constructToolbarItem('paginationControl');
    }

    return (
      <>
        {apiCreateUrl &&
          <Button onClick={() => setAddDialogIsOpen(true)}>
            Create
          </Button>
        }

        {paginationControl}

        <Spacer />

        {!commitOnSelect &&
          <Button
            color="primary"
            disabled={!(listViewSelection && listViewSelection.size)}
            onClick={commit}
            variant="contained"
          >
            Choose
          </Button>
        }
      </>
    );
  }, [listViewConfig]);

  //----------------------------------------------------------------------------
  let subtitle = null;
  if (selectionMode === 'multiple' && listViewSelection) {
    subtitle = `${listViewSelection.size} selected`;
  }

  let searchControl = null;
  if (searchFilterParam) {
    searchControl = (
      <div className={classes.filterFieldContainer}>
        <SearchField
          clearable
          fullWidth
          onChange={handleSearchFieldChange}
          margin="none"
          propagateChangeEvent={false}
          size="small"
        />
      </div>
    );
  }

  return (
    <>
      <SimpleDialog
        open
        classes={{
          dialogContent: classes.dialogContent,
          dialogActions: classes.dialogActions,
        }}
        loading={loading}
        maxWidth={maxWidth}
        title={dialogTitle}
        subtitle={subtitle}
        onKeyDown={handleKeyDown}
        onClose={() => dismissDialog()}
        actions={dialogActions}
        {...dialogProps}
      >
        {searchControl}
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
          paginationControlProps={paginationControlProps}
          selectionDisabled={false}
          selectionMode={commitOnSelect ? 'single' : selectionMode}
          selectOnClick
        />
      </SimpleDialog>

      {addDialogIsOpen &&
        <EditDialog
          apiCreateUrl={apiCreateUrl}
          entityType={props.entityType}
          onClose={handleEditDialogClose}
          onSave={handleEditDialogSave}
          {...props.editDialogProps}
        />
      }
    </>
  );
}

ListViewDialog.propTypes = {
  apiCreateUrl: PropTypes.string,
  commitOnSelect: PropTypes.bool,
  dialogProps: PropTypes.object,
  entityType: PropTypes.string,
  maxWidth: PropTypes.string,
  onDismiss: PropTypes.func,
  searchFilterParam: PropTypes.string,
  selectionMode: PropTypes.oneOf(['single', 'multiple']),
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
};

export default ListViewDialog;
