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

import { VariableSizeList, VariableSizeGrid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import CircularProgress from '@material-ui/core/CircularProgress';
import List from '@material-ui/core/List';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import GpsFixedIcon from '@material-ui/icons/GpsFixed';
import SortIcon from '@material-ui/icons/Sort';

import NavManager from '../managers/NavManager';
import ServiceAgent from '../util/ServiceAgent';
import { makeChoices } from '../util/array';
import { filterExcludeKeys } from '../util/object'
import { find as setFind } from '../util/set';

import PaginationControl from './PaginationControl';
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
    <Tooltip title={`Ordered by: ${orderingLabel}`}>
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
const selectionControlStyles = makeStyles((theme) => ({
  button: {
    padding: `${theme.spacing(0.5)}px ${theme.spacing(1)}px`,
  },

  menuButton: {
    borderColor: `${theme.palette.grey[400]} !important`,
    minWidth: 0,
    padding: 0,
  },

  disabled: {
    color: theme.palette.text.secondary,
  },

  enabled: {
    color: theme.palette.primary.main,
  },
}));

function SelectionControl(props) {
  const [selectMenuEl, setSelectMenuEl] = useState(null);
  const { selectionDisabled } = props;


  const handleSelectionMenuDismiss = (choice) => {
    setSelectMenuEl(null);

    if (choice) {
      props.onSelectionMenuItemClick(choice);
    }
  };

  const classes = selectionControlStyles();

  if (!props.selectionMenu) {
    return (
      <ToolbarItem
        control={(
          <IconButton
            color={selectionDisabled ? 'default' : 'primary' }
            onClick={props.onClick}
          >
            <GpsFixedIcon />
          </IconButton>
        )}
        tooltip={`Selection mode is: ${selectionDisabled ? 'Off' : 'On'}`}
      />
    );
  }

  return (
    <Fragment>
      <ButtonGroup>
        <Tooltip title={`Selection mode is: ${selectionDisabled ? 'Off' : 'On'}`}>
          <Button
            classes={{
              root: classes.button,
              outlined: selectionDisabled ? classes.disabled : classes.enabled,
            }}
            onClick={props.onClick}
            variant="outlined"
          >
            <GpsFixedIcon />
          </Button>
        </Tooltip>

        <Button
          className={classes.menuButton}
          disabled={selectionDisabled}
          onClick={(e) => { setSelectMenuEl(e.currentTarget); }}
          size="small"
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>

      <Menu
        anchorEl={selectMenuEl}
        id="selection-menu"
        open={Boolean(selectMenuEl)}
        onClose={() => { handleSelectionMenuDismiss(null); }}
      >
        <MenuItem onClick={() => { handleSelectionMenuDismiss('all'); }}>
          Select All
        </MenuItem>
        <MenuItem onClick={() => { handleSelectionMenuDismiss('none'); }}>
          Deselect All
        </MenuItem>
      </Menu>
    </Fragment>
  );
}

SelectionControl.propTypes = {
  selectionDisabled: PropTypes.bool.isRequired,
  selectionMenu: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  onSelectionMenuItemClick: PropTypes.func.isRequired,
};

//------------------------------------------------------------------------------
function PagedListView(props) {
  const qsParams = NavManager.qsParams;
  const qsPageParam = qsParams[props.pageParamName] ? parseInt(qsParams[props.pageParamName]) : 1;
  const qsPageSizeParam = qsParams[props.pageSizeParamName] ? parseInt(qsParams[props.pageSizeParamName]) : null;

  const [filterParams, setFilterParams] = useState(null);

  const [items, setItems] = useState(null);
  const itemHeights = useRef(null);

  const [ordering, setOrdering] = useState(null);
  const [page, setPage] = useState(qsPageParam);
  const [pageSize, setPageSize] = useState(qsPageSizeParam);
  const [paginationInfo, setPaginationInfo] = useState(null);
  const [selectedSubsetArrangementIndex, setSelectedSubsetArrangementIndex] = useState(null);
  const [selection, setSelection] = useState(new Set());
  const [selectionDisabled, setSelectionDisabled] = useState(props.selectionDisabled);
  const [sortControlEl, setSortControlEl] = useState(null);
  const [toolbarItems, setToolbarItems] = useState({});

  // Maintain a reference to the fetch request so it can be aborted
  // if this component is unmounted while it is in flight.
  const [fetchRequestContext, setFetchRequestContext] = useState(null);

  // The view is assumed to be 'loading' whenever a fetchRequestContext is set.
  const loading = !!fetchRequestContext;

  const [viewWidth, setViewWidth] = useState(0);
  const [viewHeight, setViewHeight] = useState(0);

  const [measuring, setMeasuring] = useState(false);


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
   * Extend the selection to include the given item and
   * insert it into the item list
   * Exported: yes
   */
  const extendSelection = useCallback((item) => {
    const updatedItems = [...items];
    updatedItems.unshift(item);
    setItems(updatedItems);

    updateSelection(item);

  }, [selection, items]);


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
   * @returns {*} Path item should link to
   */
  const pathForItem = (item) => {
    const { itemLinkKey } = props;
    if (!itemLinkKey) {
      return null;
    }
    return (typeof itemLinkKey === 'function') ? itemLinkKey(item) : item[itemLinkKey];
  };


  /**
   * Function to generate the ListItem props for a given item
   * @param item
   * @returns Object containing properties to supply to the list item
   */
  const itemProps = (item) => {
    const {
      itemContextProvider,
      listItemProps,
      selectionMode,
    } = props;
    let context = itemContextProvider ? itemContextProvider(item) : {};

    const itemKey = keyForItem(item);
    let selected = Boolean(setFind(selection, (i) => keyForItem(i) === itemKey));

    return {
      item: item,
      onSelectionChange: handleSelectionControlClick,
      selected,
      selectionMode,
      selectionDisabled,
      ...context,
      ...listItemProps,
    };
  };


  const coerceFilterParams = (params) => {
    const coercedParams = { ...params };
    Object.keys(coercedParams).forEach((paramName) => {

      // Let params specified as arrays (typically M2M relationships)
      // be cast to comma-separated strings
      if (Array.isArray(coercedParams[paramName])) {
        coercedParams[paramName] = coercedParams[paramName].join(',');
      }
    });

    return coercedParams;
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

  // ---------------------------------------------------------------------------
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
   * - The page size changes
   * - Ordering is modified
   * - Selected subset arrangement is changed.
   */
  useEffect(() => {
    let params = { ...props.defaultFilterParams };

    if (props.paginated) {
      let pageIndex = page;

      // When the default filter params change, reset to page 1
      if (filterParams) {
        const keysToExclude = [props.pageParamName, props.pageSizeParamName, props.orderParamName];
        const currentDefaultFilterParams = filterExcludeKeys(filterParams, keysToExclude);
        if (!isEqual(params, currentDefaultFilterParams)) {
          pageIndex = 1;
        }
      }

      if (props.location) {
        const updatedQueryParams = {};
        if (pageIndex !== qsPageParam) {
          updatedQueryParams[props.pageParamName] = pageIndex;
        }
        if (pageSize !== qsPageSizeParam) {
          // When the page size changes, reset to page 1
          pageIndex = 1;
          updatedQueryParams[props.pageParamName] = pageIndex;
          updatedQueryParams[props.pageSizeParamName] = pageSize;
        }

        if (Object.keys(updatedQueryParams).length) {
          NavManager.updateUrlParams(updatedQueryParams, true);
        }
      }

      setPage(pageIndex);
    }

    if (props.subsetFilterArrangement && (selectedSubsetArrangementIndex !== null)) {
      const subsetInfo = props.subsetFilterArrangement[selectedSubsetArrangementIndex];
      Object.assign(params, subsetInfo.params);

      if (props.location && qsParams[props.subsetParamName] !== subsetInfo.label) {
        NavManager.updateUrlParam(props.subsetParamName, subsetInfo.label);
      }
    }

    // Let the filter params be transformed before they're committed
    params = coerceFilterParams(params);

    if (!isEqual(params, filterParams)) {
      setFilterParams(params);
    }

  }, [
    props.defaultFilterParams,
    ordering,
    page,
    pageSize,
    selectedSubsetArrangementIndex
  ]);


  const updateSelection = (item) => {
    const itemId = keyForItem(item);
    const selectedItem = setFind(selection, (i) => keyForItem(i) === itemId);

    let newSelection = null;

    if (props.selectionMode === 'single') {
      newSelection = new Set();
      if (!selectedItem) {
        newSelection.add(item);
      }
    } else {
      newSelection = new Set(selection);
      if (selectedItem) {
        newSelection.delete(selectedItem);
      } else {
        newSelection.add(item);
      }
    }

    setSelection(newSelection);

    if (props.onSelectionChange) {
      props.onSelectionChange(newSelection);
    }
  };

  // ---------------------------------------------------------------------------
  /**
   * Invoked whenever the list container dimensions change
   * @param height
   * @param width
   */
  const handleAutoSizerResize = ({ height, width }) => {
    setViewHeight(height);
    setViewWidth(width);
  };

  /**
   *
   */
  const handleListItemMount = (item, itemIndex, element) => {
    const listItemRect = element.getBoundingClientRect();
    itemHeights.current[itemIndex] = listItemRect.height;

    if (itemIndex === items.length - 1) {
      setMeasuring(false);
    }
  };

  /**
   * Handle changes to the selection
   * @param item Record whose selection control has been clicked
   */
  const handleSelectionControlClick = (item) => {
    updateSelection(item);
  };

  /**
   * Respond to selection menu by updating selection accordingly
   */
  const handleSelectionMenuItemClick = (action) => {
    switch (action) {
      case 'all':
        const newSelection = new Set(selection);
        items.forEach((item) => { newSelection.add(item); });
        setSelection(newSelection);
        break;
      case 'none':
        setSelection(new Set());
        break;
      default:
        throw new Error(`Unsupported selection action: ${action}`);
    }
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
      console.log('TODO: Remove items from selection if they were removed from the list');
      removeItem(change.old);
    } else if (change.old === null && change.new) {
      addItem(change.new);
    } else {
      updateItem(change.old, change.new);
    }
  };


  const handleTablePaginationPageChange = (value) => {
    setPage(value + 1);
  };

  const handleTablePaginationPageSizeChange = (value) => {
    setPageSize(value);
  };

  // ---------------------------------------------------------------------------
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

  /**
   * Instruct the list to reload using the currently set filterParams
   */
  const reload = async() => {
    if (!(props.src && filterParams)) {
      return;
    }

    // When in windowed mode, setting the 'measuring' flag causes the list
    // items to be rendered into a hidden  container so their individual
    // heights can be determined.
    // After all items have been measured the hidden container is replaced
    // with a VariableSizedList / VariableSizedGrid
    itemHeights.current = null;
    setItems(null);
    if (props.windowed) {
      setMeasuring(true);
    }

    const requestParams = {...filterParams};

    if (props.paginated) {
      requestParams[props.pageParamName] = page;
      requestParams[props.pageSizeParamName] = pageSize;
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
      // TODO: Filter the source array with the given params
      updatedItems = [...props.src];
    }

    // If a transformer has been supplied, apply it to the
    // newly assigned records.
    if (props.itemTransformer) {
      updatedItems = updatedItems.map(props.itemTransformer);
    }

    itemHeights.current = new Array(updatedItems.length).fill(0);

    setItems(updatedItems);

    if (props.onComplete) {
      props.onComplete(updatedItems);
    }
  };

  // ---------------------------------------------------------------------------
  /**
   * Reload the list whenever the listed dependent properties are altered
   */
  useEffect(() => {
    reload();
  }, [props.src, filterParams, ordering, page, pageSize]);


  /**
   * Update the list's configuration whenever the filterParams or ordering change.
   * In particular, update the paging control.
   */
  useEffect(() => {
    const newToolbarItems = {};

    newToolbarItems.selectionControl = (
      <SelectionControl
        key="selectionControl"
        onClick={() => {
          // When the selection control button is clicked, toggle selection mode.
          setSelectionDisabled(!selectionDisabled);

          // _Always_ clear current selection when selection mode is toggled
          setSelection(new Set());
        }}
        onSelectionMenuItemClick={handleSelectionMenuItemClick}
        selectionDisabled={selectionDisabled}
        selectionMenu={props.selectionMenu}
      />
    );

    if (paginationInfo) {
      let pageLabel = null;
      if (!selectionDisabled && props.selectionMode === 'multiple') {
        pageLabel = `${selection.size} of ${paginationInfo.total} selected`;
      }
      newToolbarItems.paginationControl = (
        <PaginationControl
          count={paginationInfo.total}
          key="paginationControl"
          page={(paginationInfo.current_page) - 1}
          pageLabel={pageLabel}
          pageSize={paginationInfo.per_page}
          onPageChange={handleTablePaginationPageChange}
          onPageSizeChange={handleTablePaginationPageSizeChange}
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
          style={{ flex: 1 }}
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
    extendSelection,
    filterParams,
    ordering,
    paginationInfo,
    selection,
    selectionDisabled,
    selectedSubsetArrangementIndex,
    sort,
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
        extendSelection,
        loading,
        onItemUpdate: handleItemUpdate,
        selection,
        selectionDisabled,
        sort,
        toolbarItems,
        totalCount,
      });
    }
  }, [
    extendSelection,
    paginationInfo,
    selection,
    selectionDisabled,
    sort,
    toolbarItems
  ]);

  //----------------------------------------------------------------------------
  /**
   * Produce a list item from the given item
   * @param item: Item to be rendered
   * @param itemIndex: Array index of item being rendered
   * @param style: Additional style params (primarily used in windowed mode)
   * @param onMount: Optional callback to be invoked when the list item mounts
   */
  const renderListItem = (item, itemIndex, style, onMount) => (
    <props.listItemComponent
      key={keyForItem(item)}
      to={pathForItem(item)}
      onMount={(element) => { handleListItemMount(item, itemIndex, element); }}
      selectOnClick={props.selectOnClick}
      style={style}
      {...itemProps(item)}
    />
  );

  if (!items || loading) {
    return (
      <PlaceholderView border={false}>
        <CircularProgress />
      </PlaceholderView>
    );
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

  let view = null;

  if (props.displayMode === 'list') {
    if (props.windowed) {
      view = measuring ? (
        <List disablePadding style={{ visibility: 'hidden' }}>
          {items.map((item, itemIndex) => renderListItem(item, itemIndex))}
        </List>
      ) : (
        <AutoSizer onResize={handleAutoSizerResize}>
          {({width, height}) => (
            <VariableSizeList
              height={height}
              innerElementType={List}
              itemData={{ items }}
              itemCount={items.length}
              itemSize={(index) => itemHeights.current[index]}
              width={width}
            >
              {({ data, index, style }) => (
                renderListItem(data.items[index], index, style)
              )}
            </VariableSizeList>
          )}
        </AutoSizer>
      );
    } else {
      view = (
        <List disablePadding>
          {items.map((item, itemIndex) => renderListItem(item, itemIndex))}
        </List>
      );
    }
  } else {
    if (props.windowed) {
      console.log('TODO: Implement windowed grid view!');
    } else {
      view = (
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
      );
    }
  }

  return (
    <Fragment>
      {view}

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
              selected={sortChoice.value === ordering}
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
  itemLinkKey: PropTypes.oneOfType([
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
  pageSizeParamName: PropTypes.string,
  paginated: PropTypes.bool,

  selectionDisabled: PropTypes.bool,
  selectionMode: PropTypes.oneOf(['single', 'multiple']),
  selectionMenu: PropTypes.bool,
  selectOnClick: PropTypes.bool,

  src: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),

  subsetParamName: PropTypes.string,
  subsetFilterArrangement: PropTypes.array,

  tileItemComponent: PropTypes.func,
  tileListProps: PropTypes.object,
  windowed: PropTypes.bool,
};

PagedListView.defaultProps = {
  defaultFilterParams: {},
  itemIdKey: 'id',
  itemLinkKey: 'path',
  orderParamName: 'order',
  pageParamName: 'page',
  pageSizeParamName: 'page_size',
  paginated: false,
  selectionDisabled: true,
  selectionMenu: false,
  selectOnClick: false,
  subsetParamName: 'subset',
  tileListProps: {},
  windowed: false,
};

export default PagedListView;
