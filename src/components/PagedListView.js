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

import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import TablePagination from '@material-ui/core/TablePagination';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import GpsFixedIcon from '@material-ui/icons/GpsFixed';
import SortIcon from '@material-ui/icons/Sort';

import NavManager from '../managers/NavManager';
import ServiceAgent from '../util/ServiceAgent';
import { makeChoices } from '../util/array';
import { filterExcludeKeys } from '../util/object'

import PlaceholderView from './PlaceholderView';
import TileList from './TileList';
import ToolbarItem from './ToolbarItem';

//------------------------------------------------------------------------------
function SortControl(props) {
  let orderingLabel = '';
  props.choices.forEach((choice) => {
    if (choice[0] === props.selectedOrdering) {
      orderingLabel = choice[1];
    }
  });

  return (
    <Tooltip title={orderingLabel}>
      <IconButton
        color="primary"
        onClick={props.onClick}
        style={{ borderRadius: 0 }}
      >
        <SortIcon />
      </IconButton>
    </Tooltip>
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

  const qsPageParam = parseInt(NavManager.qsParams[props.pageParamName] || 1);
  const [filterParams, setFilterParams] = useState(null);
  const [items, setItems] = useState(null);
  const [page, setPage] = useState(props.location ? qsPageParam : 1);
  const [paginationInfo, setPaginationInfo] = useState(null);
  const [selectedItemIds, setSelectedItemIds] = useState(new Set());
  const [selectionDisabled, setSelectionDisabled] = useState(true);
  const [sortControlEl, setSortControlEl] = useState(null);
  const [toolbarItems, setToolbarItems] = useState({});

  // Maintain a reference to the fetch request so it can be aborted
  // if this component is unmounted while it is in flight.
  const [fetchRequestContext, setFetchRequestContext] = useState(null);

  let defaultOrdering = props.defaultOrdering;
  if (NavManager.qsParams[props.orderParamName]) {
    defaultOrdering = NavManager.qsParams[props.orderParamName];
  } else if (props.filterMetadata) {
    defaultOrdering = props.filterMetadata.primary_ordering;
  }
  const [ordering, setOrdering] = useState(defaultOrdering);


  /**
   * Sort the items using the given sorting function
   * Exported: yes
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
      // This situation is most likely to occur when a record has been updated
      // that is not within the loaded page
      return;
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
      // This situation is most likely to occur when a record has been updated
      // that is not within the loaded page
      return;
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
      if (fetchRequestContext) {
        const inFlightRequest = fetchRequestContext.request;
        inFlightRequest.abort();
      }
    });
  }, []);

  /**
   * Update filter params when the page changes or ordering
   * is modified.
   */
  useEffect(() => {
    const params = { ...props.defaultFilterParams };

    let pageIndex = page;
    if (filterParams) {
      const keysToExclude = [props.pageParamName, 'page_size', props.orderParamName];
      const currentDefaultFilterParams = filterExcludeKeys(filterParams, keysToExclude);

      if (!isEqual(params, currentDefaultFilterParams)) {
        pageIndex = 1;
        setPage(pageIndex);
      }
    }

    if (props.pageSize) {
      params.page_size = props.pageSize;

      params[props.pageParamName] = pageIndex;
      if (props.location && pageIndex !== qsPageParam) {
        NavManager.updateUrlParam(props.pageParamName, pageIndex);
      }
    }

    if (ordering) {
      params[props.orderParamName] = ordering;
    }

    if (!isEqual(params, filterParams)) {
      setFilterParams(params);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.defaultFilterParams, ordering, props.pageSize]);



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


  const handleSortDialogDismiss = (choice) => {
    setSortControlEl(null);

    if (choice) {
      setOrdering(choice.value);
      NavManager.updateUrlParam(props.orderParamName, choice.value);
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


  const handlePageChange = (e, value) => {
    setPage(value + 1);

    const updatedFilterParams = {...filterParams};
    updatedFilterParams[props.pageParamName] = value + 1;
    setFilterParams(updatedFilterParams);
  };


  const fetchItems = async() => {
    return new Promise((resolve, reject) => {
      if (fetchRequestContext) {
        const inFlightRequest = fetchRequestContext.request;
        inFlightRequest.abort();
      }

      const requestContext = {};
      setFetchRequestContext(requestContext);
      const request = ServiceAgent.get(props.src, filterParams, requestContext);

      request.then((response) => {
        setFetchRequestContext(null);
        if (response === null) {
          return;
        }

        const responseInfo = response.body;

        const loadedItems = responseInfo.data ? responseInfo.data : responseInfo;

        if (responseInfo.meta && responseInfo.meta.pagination) {
          setPaginationInfo(responseInfo.meta.pagination);
        }

        resolve(loadedItems);
      }).catch((err) => {
        setFetchRequestContext(null);
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
    if (!(props.src && filterParams)) {
      return;
    }

    reload();

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
          onChangePage={handlePageChange}
        />
      );
    }

    if (props.filterMetadata && props.filterMetadata.ordering_fields) {
      newToolbarItems.sortControl = (
        <SortControl
          choices={props.filterMetadata.ordering_fields}
          selectedOrdering={ordering}
          onClick={(e) => { setSortControlEl(e.currentTarget); }}
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
        loading: !!fetchRequestContext,
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
  if (!items) {
    return null;
  }

  if (!items.length) {
    return (
      <PlaceholderView padding={2}>
        <Typography variant="body2">
          No items to display
        </Typography>
      </PlaceholderView>
    );
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
            <props.listItemComponent
              key={keyForItem(item)}
              selectOnClick={props.selectOnClick}
              {...itemProps(item)}
            />
          ))}
        </List>
      ) : (
        <TileList
          selectionDisabled={selectionDisabled}
          {...props.tileListProps}
        >
          {items.map((item) => (
            <props.tileItemComponent
              key={keyForItem(item)}
              {...itemProps(item)}
            />
          ))}
        </TileList>
      )}

      {toolbarItems.sortControl &&
        <Menu
          anchorEl={sortControlEl}
          getContentAnchorEl={null}
          id="sort-menu"
          open={Boolean(sortControlEl)}
          onClose={() => { handleSortDialogDismiss(null); }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          {makeChoices(props.filterMetadata.ordering_fields).map((sortChoice) => (
            <MenuItem
              key={sortChoice.value}
              onClick={() => { handleSortDialogDismiss(sortChoice); }}
            >
              {sortChoice.label}
            </MenuItem>
          ))}
        </Menu>
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
  listItemComponent: PropTypes.func,

  location: PropTypes.object,

  onLoad: PropTypes.func,
  onComplete: PropTypes.func,
  onConfig: PropTypes.func,
  onSelectionChange: PropTypes.func,

  orderParamName: PropTypes.string,
  pageParamName: PropTypes.string,

  pageSize: PropTypes.number,
  selectionMode: PropTypes.oneOf(['single', 'multiple']),
  selectionAlways: PropTypes.bool,
  selectOnClick: PropTypes.bool,
  src: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  tileItemComponent: PropTypes.func,
  tileListProps: PropTypes.object,
};

PagedListView.defaultProps = {
  defaultFilterParams: {},
  itemIdKey: 'id',
  orderParamName: 'order',
  pageParamName: 'page',
  selectionAlways: false,
  selectOnClick: false,
  tileListProps: {},
};

export default PagedListView;
