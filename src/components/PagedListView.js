/**
*
* PagedListView
*
*/

import classNames from 'classnames';

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
import LinearProgress from '@material-ui/core/LinearProgress';
import List from '@material-ui/core/List';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Pagination from '@material-ui/lab/Pagination';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import GpsFixedIcon from '@material-ui/icons/GpsFixed';
import SortIcon from '@material-ui/icons/Sort';

import ServiceAgent from '../util/ServiceAgent';
import { makeChoices } from '../util/array';
import { filterExcludeKeys, filterEmptyValues } from '../util/object';
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
  const qsParams = props.qsParams || {};

  const {
    classes,
    filterMetadata,
    filterParams,
    filterParamTransformer,
    itemContextMenuArrangement,
    itemContextProvider,
    itemTransformer,
    listItemProps,
    onConfig,
    onLoad,
    onLoadComplete,
    onLoadError,
    onToolbarChange,
    orderParamName,
    pageParamName,
    pageSizeParamName,
    paginated,
    paginationControlProps,
    paginationListControlProps,
    selectionMenu,
    selectionMode,
    src,
    subsetFilterArrangement,
    urlUpdateFunc,
    windowed,
  } = props;


  const [extraRequestParams, setExtraRequestParams] = useState(null);
  const [appliedFilterParams, setAppliedFilterParams] = useState(null);
  const [items, setItems] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [paginationInfo, setPaginationInfo] = useState(null);
  const [selectedSubsetArrangementIndex, setSelectedSubsetArrangementIndex] = useState(null);
  const [uncontrolledSelection, setUncontrolledSelection] = useState(new Set());
  const [selectionDisabled, setSelectionDisabled] = useState(props.selectionDisabled);
  const [sortControlEl, setSortControlEl] = useState(null);
  const [toolbarItems, setToolbarItems] = useState({});

  // Maintain a reference to the fetch request so it can be aborted
  // if this component is unmounted while it is in flight.
  const [fetchRequestContext, setFetchRequestContext] = useState(null);

  const [measuring, setMeasuring] = useState(false);
  const itemHeights = useRef(null);

  // Derived properties

  // The view is assumed to be 'loading' whenever a fetchRequestContext is set.
  const loading = !!fetchRequestContext;

  // ---------------------------------------------------------------------------
  // Selection Management
  // ---------------------------------------------------------------------------
  const selection = props.selection || uncontrolledSelection;

  const setSelection = (updatedSelection) => {
    setUncontrolledSelection(updatedSelection);

    if (props.onSelectionChange) {
      props.onSelectionChange(updatedSelection);
    }
  };


  const updateSelection = (item) => {
    const itemId = keyForItem(item);
    const selectedItem = setFind(selection, (i) => keyForItem(i) === itemId);

    let newSelection = null;

    if (selectionMode === 'single') {
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
  };


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

  // ---------------------------------------------------------------------------
  // Pagination
  // ---------------------------------------------------------------------------
  const setPage = (value) => {
    setExtraRequestParams({
      ...extraRequestParams,
      [pageParamName]: value
    });

    if (urlUpdateFunc) {
      urlUpdateFunc({ [pageParamName]: value });
    }
  };

  const setPageSize = (value) => {
    const pagingParams = {
      [pageParamName]: 1,
      [pageSizeParamName]: value
    };

    setExtraRequestParams({ ...extraRequestParams, ...pagingParams });

    if (urlUpdateFunc) {
      urlUpdateFunc(pagingParams);
    }
  };

  // ---------------------------------------------------------------------------

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
    const itemKey = keyForItem(item);

    const itemContext = itemContextProvider ? itemContextProvider(item) : {};

    let selected = Boolean(setFind(selection, (i) => keyForItem(i) === itemKey));

    return {
      contextMenuItemArrangement: itemContextMenuArrangement,
      item,
      onSelectionChange: (item) => updateSelection(item),
      selected,
      selectionMode,
      selectionDisabled,
      ...itemContext,
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

    if (selection.has(item)) {
      // Remove the item from selection if present
      const newSelection = new Set(selection);
      newSelection.delete(item);
      setSelection(newSelection);
    }

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
    const initialExtraRequestParams = {};

     let initialOrdering = null;
     if (qsParams[orderParamName]) {
       initialOrdering = qsParams[orderParamName];
     } else if (filterMetadata) {
       initialOrdering = filterMetadata.primary_ordering;
     }
     if (initialOrdering) {
       initialExtraRequestParams[orderParamName] = initialOrdering;
     }

     if (paginated) {
       initialExtraRequestParams[pageParamName] = qsParams[pageParamName] ? parseInt(qsParams[pageParamName]) : 1;

       const initialPageSize = qsParams[pageSizeParamName];
       if (initialPageSize) {
         initialExtraRequestParams[pageSizeParamName] = parseInt(qsParams[pageSizeParamName]);
       }
     }
     setExtraRequestParams(initialExtraRequestParams);
    return (() => {
      // When the component is being unmounted,
      // abort the current fetch request if it is in flight.
      if (fetchRequestContext && fetchRequestContext.abortController) {
        fetchRequestContext.abortController.abort();
      }
    });
  }, []);


  /**
   * When the supplied filter params are changed, OR the pagnation/ordering
   * paramters change, update the applied filter params
   */
  useEffect(() => {
    if (!(filterParams && extraRequestParams)) {
      return;
    }

    let params = { ...filterParams, ...extraRequestParams };
    // Enable the filter parameters be modified by the consumer prior
    // to issuing the API request. An example use case would be to convert
    // "param=null" to "param__isnull=true"
    if (filterParamTransformer) {
      params = filterParamTransformer(params);
    }

    params = filterEmptyValues(params);

    // Let the filter params be transformed before they're committed
    params = coerceFilterParams(params);

    setAppliedFilterParams(params);
  }, [filterParams, extraRequestParams]);


  /**
   * Reload the list whenever ANY properties affecting the source query are altered
   */
  useEffect(() => {
    if (!appliedFilterParams) {
      return;
    }

    if (onLoad) {
      onLoad(appliedFilterParams);
    }

    fetchItems(src, appliedFilterParams).then((fetchItemsResult) => {
      let updatedItems = fetchItemsResult.items;

      // If a transformer has been supplied, apply it to the newly assigned records.
      if (itemTransformer) {
        updatedItems = updatedItems.map(itemTransformer);
      }

      setItems(updatedItems);
      setLoadError(null);

      if (onLoadComplete) {
        onLoadComplete(updatedItems, fetchItemsResult.response);
      }
    }).catch((err) => {
      setLoadError(err);
      setItems(null);

      if (onLoadError) {
        onLoadError(err);
      }
    });
  }, [appliedFilterParams]);


  /**
   * When the pagination info is updated, update the dependent toolbar items
   */
  useEffect(() => {
    if (!paginationInfo) {
      return;
    }

    const newToolbarItems = { ...toolbarItems };

    newToolbarItems.paginationListControl = (
      <Pagination
        count={paginationInfo.total_pages}
        page={paginationInfo.current_page}
        onChange={(value) => setPage(value)}
        {...paginationListControlProps}
      />
    );

    setToolbarItems(newToolbarItems);
  }, [paginationInfo]);

  /**
   * Update the selectionControl toolbarItem when selection mode is enabled/disabled
   */
  useEffect(() => {
    const newToolbarItems = { ...toolbarItems };

    newToolbarItems.selectionControl = (
      <SelectionControl
        onClick={() => {
          // When the selection control button is clicked, toggle selection mode.
          setSelectionDisabled(!selectionDisabled);

          // _Always_ clear current selection when selection mode is toggled
          setSelection(new Set());
        }}
        onSelectionMenuItemClick={handleSelectionMenuItemClick}
        selectionDisabled={selectionDisabled}
        selectionMenu={selectionMenu}
      />
    );

    if (paginationInfo) {
      let pageLabel = null;
      if (!selectionDisabled && selectionMode === 'multiple') {
        pageLabel = `${selection.size} of ${paginationInfo.total} selected`;
      }
      newToolbarItems.paginationControl = (
        <PaginationControl
          count={paginationInfo.total}
          page={(paginationInfo.current_page) - 1}
          pageLabel={pageLabel}
          pageSize={paginationInfo.per_page}
          onPageChange={(value) => setPage(value + 1) }
          onPageSizeChange={(value) => setPageSize(value) }
          {...paginationControlProps}
        />
      );
    }

    setToolbarItems(newToolbarItems);
  }, [paginationInfo, selection, selectionDisabled]);


  useEffect(() => {
    if (!(extraRequestParams && filterMetadata && filterMetadata.ordering_fields && filterMetadata.ordering_fields.length)) {
      return;
    }

    const newToolbarItems = { ...toolbarItems };
    newToolbarItems.sortControl = (
      <SortControl
        choices={filterMetadata.ordering_fields}
        selectedOrdering={extraRequestParams[orderParamName]}
        onClick={(e) => setSortControlEl(e.currentTarget)}
      />
    );

    setToolbarItems(newToolbarItems);
  }, [extraRequestParams]);


  useEffect(() => {
    if (!onToolbarChange) {
      return;
    }

    onToolbarChange(toolbarItems);
  }, [toolbarItems]);


  /**
   * Invoke the onConfig callback when any of the exposed state properties are affected.
   */
  useEffect(() => {
    if (!onConfig) {
      return;
    }

    onConfig( {
      extendSelection,
      updateItem: handleItemUpdate,
      selection,
      selectionDisabled,
    })
  }, [
    items,
    selection,
    selectionDisabled,
  ]);

  // useEffect(() => {
  //   if (subsetFilterArrangement && (selectedSubsetArrangementIndex !== null)) {
  //    const newToolbarItems = { ...toolbarItems };
  //     newToolbarItems.tabsControl = (
  //       <Tabs
  //         style={{ flex: 1 }}
  //         onChange={(e, tabIndex) => { setSelectedSubsetArrangementIndex(tabIndex); }}
  //         scrollButtons="auto"
  //         value={selectedSubsetArrangementIndex}
  //         variant="scrollable"
  //       >
  //         {props.subsetFilterArrangement.map((subsetInfo) => (
  //           <Tab key={subsetInfo.label} label={subsetInfo.label} />
  //         ))}
  //       </Tabs>
  //     );
  //     setToolbarItems(newToolbarItems);
  //   }
  //

  //   // Let the querystring params determine the initially selected tab
  //   if (subsetFilterArrangement) {
  //     let initialSubsetArrangementIndex = -1;
  //
  //     const initialSubsetLabel = qsParams[props.subsetParamName];
  //     if (initialSubsetLabel) {
  //       initialSubsetArrangementIndex = subsetFilterArrangement.findIndex(
  //         (arrangementInfo) => arrangementInfo.label === initialSubsetLabel
  //       );
  //     }
  //     initialSubsetArrangementIndex = Math.max(0, initialSubsetArrangementIndex);
  //     setSelectedSubsetArrangementIndex(initialSubsetArrangementIndex);
  //   }
  // }, [subsetFilterArrangement]);


  // ---------------------------------------------------------------------------
  /**
   * Callback invoked when a list item is first mounted.
   * When in windowed mode, whereby a height must be specified for each list item,
   * this routine is used to initially determine that height.
   */
  const handleListItemMount = (item, itemIndex, element) => {
    const listItemRect = element.getBoundingClientRect();
    itemHeights.current[itemIndex] = listItemRect.height;

    if (itemIndex === items.length - 1) {
      setMeasuring(false);
    }
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

    const selectedOrdering = choice ? choice.value : null;

    const newExtraRequestParams = { ...extraRequestParams };
    if (selectedOrdering) {
      newExtraRequestParams[orderParamName] = selectedOrdering;
    } else {
      delete newExtraRequestParams[orderParamName];
    }

    setExtraRequestParams(newExtraRequestParams);

    if (urlUpdateFunc) {
      urlUpdateFunc({ [orderParamName]: selectedOrdering });
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

  // ---------------------------------------------------------------------------
  const fetchItems = (requestUrl, requestParams) => {
    return new Promise((resolve, reject) => {
      if (fetchRequestContext && fetchRequestContext.abortController) {
        fetchRequestContext.abortController.abort();
      }

      const requestContext = {};
      setFetchRequestContext(requestContext);

      ServiceAgent.get(requestUrl, requestParams, requestContext)
        .then((response) => {
          setFetchRequestContext(null);
          if (response === null) {
            return;
          }

          const responseInfo = response.jsonData;
          const loadedItems = responseInfo.data ? responseInfo.data : responseInfo;

          if (responseInfo.meta && responseInfo.meta.pagination) {
            setPaginationInfo(responseInfo.meta.pagination);
          }

          resolve({ items: loadedItems, response });
        })
        .catch((err) => {
          setFetchRequestContext(null);
          setPaginationInfo(null);
          reject(err);
        });
    });
  };

  // ---------------------------------------------------------------------------

  /**
   * When in windowed mode, setting the 'measuring' flag causes the list
   * items to be rendered into a hidden container so their individual
   * heights can be determined.
   * After all items have been measured the hidden container is unmounted
   * and a VariableSizedList / VariableSizedGrid is displayed
   */
  useEffect(() => {
    if (!(windowed && items)) {
      itemHeights.current = null;
      return;
    }

    if (items.length) {
      itemHeights.current = new Array(items.length).fill(50);
      setMeasuring(true);
    } else {
      itemHeights.current = [];
    }
  }, [windowed, items]);

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
      onMount={onMount}
      selectOnClick={props.selectOnClick}
      style={style}
      {...itemProps(item)}
    />
  );

  //----------------------------------------------------------------------------
  // Putting it all together...time to render the main view
  //----------------------------------------------------------------------------
  if (loadError) {
    return (
      <PlaceholderView padding={2}>
        <Typography>
          Failed to load data.
        </Typography>
      </PlaceholderView>
    );
  }

  if (!items) {
    switch (props.loadingVariant) {
      case 'circular':
        return (
          <PlaceholderView border={false}>
            <CircularProgress disableShrink />
          </PlaceholderView>
        );
      case 'linear':
        return (
          <LinearProgress />
        );
      default:
        return null;
    }
  }

  if (!items.length) {
    if (props.emptyListPlaceholder !== undefined) {
      return props.emptyListPlaceholder;
    }

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
    const listViewClassNames = [classes.listView];
    if (loading) {
      listViewClassNames.push(classes.listViewLoading);
    }

    if (windowed) {
      view = measuring ? (
        <List disablePadding style={{ visibility: 'hidden' }}>
          {items.map(
            (item, itemIndex) => renderListItem(item, itemIndex, null, (element) => {
              handleListItemMount(item, itemIndex, element)
            })
          )}
        </List>
      ) : (
        <AutoSizer>
          {({width, height}) => (
            <VariableSizeList
              className={classNames(listViewClassNames)}
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
        <List
          className={classNames(listViewClassNames)}
          disablePadding
        >
          {items.map(
            (item, itemIndex) => renderListItem(item, itemIndex)
          )}
        </List>
      );
    }
  } else {
    if (windowed) {
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
          onClose={() => handleSortDialogDismiss(null)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          {makeChoices(filterMetadata.ordering_fields).map((sortChoice) => (
            <MenuItem
              key={sortChoice.value}
              onClick={() => handleSortDialogDismiss(sortChoice)}
              selected={sortChoice.value === extraRequestParams[orderParamName]}
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
  classes: PropTypes.object,

  filterParams: PropTypes.object,
  defaultSelection: PropTypes.object,

  displayMode: PropTypes.oneOf(['list', 'tile']).isRequired,

  emptyListPlaceholder: PropTypes.element,

  filterMetadata: PropTypes.object,
  filterParamTransformer: PropTypes.func,

  items: PropTypes.array,
  itemContextMenuArrangement: PropTypes.func,
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

  loadingVariant: PropTypes.oneOf(['linear', 'circular']),

  location: PropTypes.object,

  onConfig: PropTypes.func,
  onLoad: PropTypes.func,
  onLoadComplete: PropTypes.func,
  onLoadError: PropTypes.func,
  onSelectionChange: PropTypes.func,
  onToolbarChange: PropTypes.func,

  orderParamName: PropTypes.string,
  pageParamName: PropTypes.string,
  pageSizeParamName: PropTypes.string,
  paginated: PropTypes.bool,
  paginationListControlProps: PropTypes.object,

  qsParams: PropTypes.object,

  selection: PropTypes.object,
  selectionDisabled: PropTypes.bool,
  selectionMode: PropTypes.oneOf(['single', 'multiple']),
  selectionMenu: PropTypes.bool,
  selectOnClick: PropTypes.bool,

  src: PropTypes.string,

  subsetParamName: PropTypes.string,
  subsetFilterArrangement: PropTypes.array,

  tileItemComponent: PropTypes.func,
  tileListProps: PropTypes.object,

  urlUpdateFunc: PropTypes.func,

  windowed: PropTypes.bool,
};

PagedListView.defaultProps = {
  classes: {},
  filterParams: {},
  itemIdKey: 'id',
  loadingVariant: 'circular',
  orderParamName: 'order',
  pageParamName: 'page',
  pageSizeParamName: 'page_size',
  paginated: false,
  paginationControlProps: {
    pageSizeChoices: [10, 20, 50, 100],
  },
  paginationListControlProps: {
    shape: 'rounded',
    variant: 'outlined',
  },
  selectionDisabled: true,
  selectionMenu: false,
  selectOnClick: false,
  subsetParamName: 'subset',
  tileListProps: {},
  windowed: false,
};

export default PagedListView;
