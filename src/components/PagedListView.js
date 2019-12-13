/**
*
* PagedListView
*
*/

import isEqual from 'lodash.isequal';
import PropTypes from 'prop-types';

import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import List from '@material-ui/core/List';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import TablePagination from '@material-ui/core/TablePagination';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import GpsFixedIcon from '@material-ui/icons/GpsFixed';
import SortIcon from '@material-ui/icons/Sort';

import NavManager from '../managers/NavManager';
import ServiceAgent from '../util/ServiceAgent';
import { makeChoices } from '../util/array';

import PagedListViewDialog from './PagedListViewDialog';
import SimpleListItem from './SimpleListItem';
import TileList from './TileList';
import ToolbarItem from './ToolbarItem';


const sortControlStyles = makeStyles((theme) => ({
  sortControl: {
    fontSize: theme.typography.pxToRem(12),
    fontWeight: 'normal',
  },

  sortIcon: {
    marginLeft: 5,
  },
}));

function SortControl(props) {
  const classes = sortControlStyles();

  let orderingLabel = '';
  props.choices.forEach((choice) => {
    if (choice[0] === props.selectedOrdering) {
      orderingLabel = choice[1];
    }
  });

  return (
    <Button
      className={classes.sortControl}
      color="primary"
      onClick={props.onClick}
    >
      {orderingLabel}
      <SortIcon className={classes.sortIcon} />
    </Button>
  );
}

SortControl.propTypes = {
  choices: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired,
};

//------------------------------------------------------------------------------
const styles = makeStyles((theme) => ({
  paginationToolbar: {
    height: theme.spacing(4),
    minHeight: theme.spacing(4),
    paddingLeft: theme.spacing(1),
  },

  paginationActions: {
    marginLeft: theme.spacing(1),

    '& button': {
      padding: theme.spacing(1),
    },
  },
}));

function PagedListView(props) {
  const classes = styles();

  const qsPageParam = parseInt(NavManager.qsParams.page || 1);
  const [filterParams, setFilterParams] = useState(null);
  const [items, setItems] = useState(null);
  const [page, setPage] = useState(props.location ? qsPageParam : 1);
  const [paginationInfo, setPaginationInfo] = useState(null);
  const [selectedItemIds, setSelectedItemIds] = useState(new Set());
  const [selectionDisabled, setSelectionDisabled] = useState(true);
  const [sortDialogOpen, setSortDialogOpen] = useState(false);
  const [toolbarItems, setToolbarItems] = useState({});

  // Maintain a reference to the fetch request so it can be aborted
  // if this component is unmounted while it is in flight.
  const fetchRequestRef = useRef();

  let defaultOrdering = props.defaultOrdering;
  if (NavManager.qsParams.sort) {
    defaultOrdering = NavManager.qsParams.sort;
  } else if (props.filterMetadata) {
    defaultOrdering = props.filterMetadata.primary_ordering;
  }
  const [ordering, setOrdering] = useState(defaultOrdering);

  /**
   * Sort the items using the given sorting function
   * Export: yes
   */
  const sort = useCallback((sortFunc) => {
    const sortedItems = [...items];
    sortedItems.sort(sortFunc);
    setItems(sortedItems);
  }, [items]);


  /**
   * @param item
   * @returns {*} Unique identifier of given item
   */
  const keyForItem = (item) => {
    const { itemIdKey } = props;
    return (typeof itemIdKey === 'function') ? itemIdKey(item) : item[itemIdKey];
  };


  /**
   *
   * @param item
   * Helper function to locate the index of the given item
   */
  const findItemIndex = (item) => {
    const sourceItemKey = keyForItem(item);
    return items.findIndex((item) => {
      const itemKey = keyForItem(item);
      if (itemKey === sourceItemKey) {
        return true;
      }
    });
  };

  /**
   *
   * @param item
   * Helper function to add the given item to the beginning of the list
   */
  const addItem = (item) => {
    const updatedItems = [...items];
    updatedItems.unshift(item);
    setItems(updatedItems);

    if (paginationInfo) {
      const updatedPaginationInfo = { ...paginationInfo };
      updatedPaginationInfo.total += 1;
      setPaginationInfo(updatedPaginationInfo);
    }
  };


  /**
   *
   * @param item
   * Helper function to remove the given item from the list
   */
  const removeItem = (item) => {
    const sourceItemIndex = findItemIndex(item);
    if (sourceItemIndex === -1) {
      throw new Error(`Unable to locate source for item with key: ${keyForItem(item)}`);
    }

    const updatedItems = [...items];
    updatedItems.splice(sourceItemIndex, 1);
    setItems(updatedItems);

    if (paginationInfo) {
      const updatedPaginationInfo = { ...paginationInfo };
      updatedPaginationInfo.total -= 1;
      setPaginationInfo(updatedPaginationInfo);
    }
  };

  /**
   *
   * @param oldItem
   * @param newItem
   * Helper function to replace the item 'oldItem' with the given 'newItem'
   */
  const updateItem = (source, target) => {
    const sourceItemIndex = findItemIndex(source);
    if (sourceItemIndex === -1) {
      throw new Error(`Unable to locate source for item with key: ${keyForItem(item)}`);
    }

    const updatedItems = [...items];
    updatedItems[sourceItemIndex] = target;
    setItems(updatedItems);
  };


  /**
   * When the component is being unmounted,
   * abort the current fetch request if it is in flight.
   */
  useEffect(() => {
    return (() => {
      if (fetchRequestRef.current) {
        fetchRequestRef.current.abort();
      }
    });
  }, []);

  /**
   * Update filter params when the page changes or ordering
   * is modified.
   */
  useEffect(() => {
    const params = { ...props.defaultFilterParams };

    if (props.pageSize) {
      params.page_size = props.pageSize;
      params.page = page;

      if (props.location && page !== qsPageParam) {
        NavManager.updateUrlParam('page', page);
      }
    }

    if (ordering) {
      params.sort = ordering;
    }

    if (!isEqual(params, filterParams)) {
      setFilterParams(params);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.defaultFilterParams, ordering, page, props.pageSize]);



  const updateSelection = (newSelectedItemIds) => {
    setSelectedItemIds(newSelectedItemIds);

    if (props.onSelectionChange) {
      const selectedItems = items.filter((item) => {
        const itemId = keyForItem(item);
        return newSelectedItemIds.has(itemId);
      });

      if (props.selectionMode === 'single') {
        props.onSelectionChange(selectedItems.pop());
      } else {
        props.onSelectionChange(selectedItems);
      }
    }
  };

  /**
   * Handle changes to the selection
   * @param item Record whose selection control has been clicked
   */
  const handleSelectionControlClick = (item) => {
    const itemId = keyForItem(item);

    let newSelection = null;
    if (props.selectionMode === 'single') {

      if (selectedItemIds.has(itemId)) {
        newSelection = new Set();
      } else {
        newSelection = new Set([itemId]);
      }
    } else {
      newSelection = new Set(selectedItemIds);
      if (selectedItemIds.has(itemId)) {
        newSelection.delete(itemId);
      } else {
        newSelection.add(itemId);
      }
    }

    updateSelection(newSelection);
  };


  const handleSortDialogDismiss = (selection) => {
    setSortDialogOpen(false);

    if (selection && selection.length === 1) {
      const selectedOrdering = selection[0].value;
      setOrdering(selectedOrdering);
      NavManager.updateUrlParam('sort', selectedOrdering);
    }
  };


  const handleItemUpdate = (change) => {
    if (change.old && change.new === null) {
      removeItem(change.old);
    } else if (change.old === null && change.new) {
      addItem(change.new);
    }else {
      updateItem(change.old, change.new);
    }
  };

  const fetchItems = async() => {
    return new Promise((resolve, reject) => {
      const request = ServiceAgent.get(props.src, filterParams);

      fetchRequestRef.current = request;
      request.then((response) => {
        fetchRequestRef.current = null;

        const responseInfo = response.body;

        let loadedItems = null;
        if (responseInfo.data) {
          loadedItems = responseInfo.data;
        } else {
          loadedItems = responseInfo;
        }

        if (responseInfo.meta && responseInfo.meta.pagination) {
          setPaginationInfo(responseInfo.meta.pagination);
        }

        resolve(loadedItems);
      }).catch((err) => {
        if (err.code !== 'ABORTED') {
          reject(err);
        }
      });
    });
  };

  const refreshItems = () => {
    const filteredItems = [...props.src];
    // TODO: Filter the source array with the given params
    const updatedItems = filteredItems;
    return updatedItems;
  };

  /**
   * Instruct the list to reload using the currently set filterParams
   */
  const reload = async() => {
    if (!filterParams) {
      return;
    }

    if (props.onLoad) {
      props.onLoad(filterParams);
    }

    let updatedItems = null;

    if (typeof(props.src) === 'string') {
      updatedItems = await fetchItems();
    } else {
      updatedItems = refreshItems();
    }

    // If a transformer has been supplied, apply it to the
    // newly assigned records.
    if (props.itemTransformer) {
      updatedItems = updatedItems.map(props.itemTransformer);
    }
    setItems(updatedItems);

    // Refresh the selection to ensure that it only includes items
    // that are currently loaded
    const updatedSelectedItemIds = new Set();
    updatedItems.forEach((item) => {
      const itemId = keyForItem(item);
      if (selectedItemIds.has(itemId)) {
        updatedSelectedItemIds.add(itemId);
      }
    });
    setSelectedItemIds(updatedSelectedItemIds);

    if (props.onComplete) {
      props.onComplete(updatedItems);
    }
  };


  /**
   * Reload the list whenever the filterParams are altered
   */
  useEffect(() => {
    if (props.src) {
      reload();
    }
  }, [props.src, filterParams]);


  /**
   * Update the list's configuration whenever the filterParams or ordering change.
   * In particular, update the paging control.
   */
  useEffect(() => {
    const newToolbarItems = {};

    if (!props.selectionAlways) {
      newToolbarItems.selectionControl = (
        <ToolbarItem
          control={(
            <IconButton
              color={selectionDisabled ? 'default' : 'primary' }
              onClick={() => {
                // Clear current selection when selection mode is enabled/disabled
                updateSelection(new Set());
                setSelectionDisabled(!selectionDisabled);
              }}
            >
              <GpsFixedIcon />
            </IconButton>
          )}
          key="selectionControl"
          tooltip={`Selection mode is: ${selectionDisabled ? 'Off' : 'On'}`}
        />
      );
    }

    if (paginationInfo) {
      newToolbarItems.paginationControl = (
        <TablePagination
          classes={{
            toolbar: classes.paginationToolbar,
            actions: classes.paginationActions,
          }}
          count={paginationInfo.total}
          component="div"
          key="paginationControl"
          page={page - 1}
          rowsPerPage={paginationInfo.per_page}
          rowsPerPageOptions={[paginationInfo.per_page]}
          onChangePage={(e, value) => { setPage(value + 1); }}
        />
      );
    }

    if (props.filterMetadata) {
      newToolbarItems.sortControl = (
        <SortControl
          choices={props.filterMetadata.ordering_fields}
          selectedOrdering={ordering}
          onClick={() => { setSortDialogOpen(true); }}
        />
      );
    }

    setToolbarItems(newToolbarItems);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort, filterParams, ordering, selectedItemIds, selectionDisabled, paginationInfo]);

  /**
   * Invoke the onConfig callback when any exported state properties are affected
   */
  useEffect(() => {
    if (props.onConfig) {

      let totalCount = null;
      if (paginationInfo) {
        totalCount = paginationInfo.total;
      } else if (Array.isArray(items)) {
        totalCount = items.length;
      }

      props.onConfig({
        onItemUpdate: handleItemUpdate,
        selectedItemIds,
        selectionDisabled,
        sort,
        toolbarItems,
        totalCount,
      });
    }
  }, [paginationInfo, selectedItemIds, selectionDisabled, sort, toolbarItems]);

  //----------------------------------------------------------------------------
  if (items === null) {
    return null;
  }

  if (!items.length) {
    return <Typography>No items to show</Typography>;
  }

  // Let the active view mode determine whether to render a List or a Grid
  const itemProps = (item) => {
    const {
      itemContextProvider,
      listItemProps,
      selectionAlways,
      selectionMode
    } = props;
    let context = itemContextProvider ? itemContextProvider(item) : {};

    return {
      item: item,
      onSelectionChange: handleSelectionControlClick,
      selected: !!selectedItemIds.has(keyForItem(item)),
      selectionMode: selectionAlways ? selectionMode : selectionDisabled ? null : selectionMode,
      ...context,
      ...listItemProps,
    };
  };

  return (
    <Fragment>
      {props.displayMode === 'list' ? (
        <List disablePadding>
          {items.map((item) => (
            <props.listItemRenderer
              key={keyForItem(item)}
              selectOnClick={props.selectOnClick}
              {...itemProps(item)}
            />
          ))}
        </List>
      ) : (
        <TileList {...props.tileListProps}>
          {items.map((item) => (
            <props.tileItemRenderer
              key={keyForItem(item)}
              {...itemProps(item)}
            />
          ))}
        </TileList>
      )}

      {sortDialogOpen &&
        <PagedListViewDialog
          commitOnSelect
          displayMode="list"
          dialogProps={{
            fullWidth: true,
            maxWidth: 'xs',
          }}
          itemIdKey="value"
          listItemRenderer={SimpleListItem}
          listItemProps={{ labelField: 'label' }}
          onDismiss={handleSortDialogDismiss}
          selectOnClick
          src={makeChoices(props.filterMetadata.ordering_fields)}
          title="Change sort order"
        />
      }
    </Fragment>
  );
}

PagedListView.propTypes = {
  defaultFilterParams: PropTypes.object,
  defaultOrdering: PropTypes.string,
  displayMode: PropTypes.oneOf(['list', 'tile']).isRequired,

  filterMetadata: PropTypes.object,

  itemContextProvider: PropTypes.func,
  itemIdKey: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]),
  itemTransformer: PropTypes.func,
  listItemProps: PropTypes.object,
  listItemRenderer: PropTypes.func,

  location: PropTypes.object,

  onLoad: PropTypes.func,
  onComplete: PropTypes.func,
  onConfig: PropTypes.func,
  onSelectionChange: PropTypes.func,

  pageSize: PropTypes.number,
  selectionMode: PropTypes.oneOf(['single', 'multiple']),
  selectionAlways: PropTypes.bool,
  selectOnClick: PropTypes.bool,
  src: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  tileItemRenderer: PropTypes.func,
  tileListProps: PropTypes.object,
};

PagedListView.defaultProps = {
  defaultFilterParams: {},
  tileListProps: {},
  itemIdKey: 'id',
  selectionAlways: false,
  selectOnClick: false,
};

export default PagedListView;
