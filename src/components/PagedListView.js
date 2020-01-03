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
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
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

  tabs: {
    flex: 1,
  }
}));

function PagedListView(props) {
  const classes = styles();

  const qsParams = NavManager.qsParams;
  const qsPageParam = parseInt(qsParams[props.pageParamName] || 1);

  const [filterParams, setFilterParams] = useState(null);
  const [items, setItems] = useState(null);
  const [ordering, setOrdering] = useState(null);
  const [page, setPage] = useState(qsPageParam);
  const [paginationInfo, setPaginationInfo] = useState(null);
  const [selectedSubsetArrangementIndex, setSelectedSubsetArrangementIndex] = useState(null);
  const [selectedItemIds, setSelectedItemIds] = useState(new Set());
  const [selectionDisabled, setSelectionDisabled] = useState(true);
  const [sortControlEl, setSortControlEl] = useState(null);
  const [toolbarItems, setToolbarItems] = useState({});

  // Maintain a reference to the fetch request so it can be aborted
  // if this component is unmounted while it is in flight.
  const [fetchRequestContext, setFetchRequestContext] = useState(null);


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
   * Initialization
   */
  useEffect(() => {
    if (props.onOptionsLoad && typeof(props.src) === 'string') {
      const fetchOptions = async(requestUrl) => {
        const res = await ServiceAgent.options(requestUrl);
        props.onOptionsLoad(res.body);
      };
      fetchOptions(props.src);
    }

    let initialOrdering = props.defaultOrdering;
    if (NavManager.qsParams[props.orderParamName]) {
      initialOrdering = NavManager.qsParams[props.orderParamName];
    } else if (props.filterMetadata) {
      initialOrdering = props.filterMetadata.primary_ordering;
    }
    setOrdering(initialOrdering);

    return (() => {
      // When the component is being unmounted,
      // abort the current fetch request if it is in flight.
      if (fetchRequestContext) {
        const inFlightRequest = fetchRequestContext.request;
        inFlightRequest.abort();
      }
    });
  }, []);


  useEffect(() => {
    // Let the querystring params determine the initially selected tab
    if (props.subsetFilterArrangement) {
      let initialSubsetArrangementIndex = -1;

      const initialSubsetLabel = NavManager.qsParams[props.subsetParamName];
      if (initialSubsetLabel) {
        initialSubsetArrangementIndex = props.subsetFilterArrangement.findIndex(
          (arrangementInfo) => arrangementInfo.label === initialSubsetLabel
        );
      }
      initialSubsetArrangementIndex = Math.max(0, initialSubsetArrangementIndex);
      setSelectedSubsetArrangementIndex(initialSubsetArrangementIndex);
    }
  }, [props.subsetFilterArrangement]);

  /**
   * Update filter params when:
   * - The page changes
   * - Ordering is modified
   * - Selected subset arrangement is changed.
   */
  useEffect(() => {
    const params = { ...props.defaultFilterParams };

    let defaultFilterParamsChanged = false;
    let pageIndex = page;
    if (filterParams) {
      const keysToExclude = [props.pageParamName, 'page_size', props.orderParamName];
      const currentDefaultFilterParams = filterExcludeKeys(filterParams, keysToExclude);

      defaultFilterParamsChanged = !isEqual(params, currentDefaultFilterParams);
    }

    if (props.pageSize) {
      if (defaultFilterParamsChanged) {
        pageIndex = 1;
        setPage(pageIndex);
      }

      // params.page_size = props.pageSize;
      // params[props.pageParamName] = pageIndex;
      if (props.location && pageIndex !== qsPageParam) {
        NavManager.updateUrlParam(props.pageParamName, pageIndex);
      }
    }

    if (props.subsetFilterArrangement && (selectedSubsetArrangementIndex !== null)) {
      const subsetInfo = props.subsetFilterArrangement[selectedSubsetArrangementIndex];
      Object.assign(params, subsetInfo.params);
      if (props.location && qsParams[props.subsetParamName] !== subsetInfo.label) {
        NavManager.updateUrlParam(props.subsetParamName, subsetInfo.label);
      }
    }

    if (!isEqual(params, filterParams)) {
      setFilterParams(params);
    }

  }, [
    props.defaultFilterParams,
    ordering,
    page,
    props.pageSize,
    selectedSubsetArrangementIndex
  ]);



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
    } else {
      updateItem(change.old, change.new);
    }
  };


  const fetchItems = async(requestUrl, requestParams) => {
    return new Promise((resolve, reject) => {
      if (fetchRequestContext) {
        const inFlightRequest = fetchRequestContext.request;
        inFlightRequest.abort();
      }

      const requestContext = {};
      setFetchRequestContext(requestContext);

      ServiceAgent.get(requestUrl, requestParams, requestContext)
        .then((response) => {
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
          })
          .catch((err) => {
            setFetchRequestContext(null);
            reject(err);
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
    if (!(props.src && filterParams)) {
      return;
    }

    const requestParams = {...filterParams};

    if (props.pageSize) {
      requestParams.page_size = props.pageSize;
      requestParams[props.pageParamName] = page;
    }

    if (ordering) {
      requestParams[props.orderParamName] = ordering;
    }

    if (props.onLoad) {
      props.onLoad(requestParams);
    }

    let updatedItems = null;

    if (typeof(props.src) === 'string') {
      updatedItems = await fetchItems(props.src, requestParams);
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
    reload();
  }, [
    props.src,
    filterParams,
    ordering,
    page
  ]);


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

    if (props.filterMetadata && props.filterMetadata.ordering_fields && props.filterMetadata.ordering_fields.length) {
      newToolbarItems.sortControl = (
        <SortControl
          choices={props.filterMetadata.ordering_fields}
          selectedOrdering={ordering}
          onClick={(e) => { setSortControlEl(e.currentTarget); }}
        />
      );
    }

    if (props.subsetFilterArrangement && (selectedSubsetArrangementIndex !== null)) {
      newToolbarItems.tabsControl = (
        <Tabs
          className={classes.tabs}
          onChange={(e, tabIndex) => { setSelectedSubsetArrangementIndex(tabIndex); }}
          scrollButtons="auto"
          value={selectedSubsetArrangementIndex}
          variant="scrollable"
        >
          {props.subsetFilterArrangement.map((subsetInfo) => (
            <Tab key={subsetInfo.label} label={subsetInfo.label} />
          ))}
        </Tabs>
      );
    }

    setToolbarItems(newToolbarItems);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    sort,
    filterParams,
    ordering,
    selectedItemIds,
    selectionDisabled,
    selectedSubsetArrangementIndex,
    paginationInfo
  ]);

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

  onComplete: PropTypes.func,
  onConfig: PropTypes.func,
  onOptionsLoad: PropTypes.func,
  onLoad: PropTypes.func,
  onSelectionChange: PropTypes.func,

  orderParamName: PropTypes.string,
  pageParamName: PropTypes.string,
  pageSize: PropTypes.number,

  selectionMode: PropTypes.oneOf(['single', 'multiple']),
  selectionAlways: PropTypes.bool,
  selectOnClick: PropTypes.bool,

  src: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),

  subsetParamName: PropTypes.string,
  subsetFilterArrangement: PropTypes.array,

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
  subsetParamName: 'subset',
  tileListProps: {},
};

export default PagedListView;
