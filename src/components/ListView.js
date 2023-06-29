import clsx from 'clsx';
import isEqual from 'lodash.isequal';
import PropTypes from 'prop-types';

import React, {
  useCallback,
  useEffect,
  useRef,
  useMemo,
  useState,
} from 'react';

import { VariableSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import List from '@material-ui/core/List';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Pagination from '@material-ui/lab/Pagination';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import GpsFixedIcon from '@material-ui/icons/GpsFixed';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import SortIcon from '@material-ui/icons/Sort';

import ServiceAgent from '../util/ServiceAgent';
import { makeChoices } from '../util/array';
import { filterEmptyValues } from '../util/object';
import { find as setFind } from '../util/set';

import PaginationControl from './PaginationControl';
import ToolbarItem from './ToolbarItem';

//------------------------------------------------------------------------------
// Utility Functions
//------------------------------------------------------------------------------
const transformFetchItemsResponse = (res, itemTransformer) => {
  const responseData = res.jsonData;

  let items = responseData.data ? responseData.data : responseData;

  // If a transformer has been supplied, apply it to the retrieved records.
  if (itemTransformer) {
    items = items.map(itemTransformer);
  }

  const transformedData = { items };

  if (responseData.meta && responseData.meta.pagination) {
    transformedData.pagination = responseData.meta.pagination;
  }

  return transformedData;
};


//------------------------------------------------------------------------------
function SortControl(props) {
  const {
    choices,
    orderingParamName,
    searchParams,
    setSearchParams,
  } = props;

  let activeOrdering = undefined;
  if (searchParams) {
    activeOrdering = searchParams.get(orderingParamName);
  }

  const [sortControlEl, setSortControlEl] = useState(null);

  const dismissMenu = useCallback((choice) => (e) => {
    if (choice) {
      const updatedSearchParams = new URLSearchParams(searchParams);
      updatedSearchParams.set(orderingParamName, choice.value);
      setSearchParams(updatedSearchParams);
    }
    setSortControlEl(null);
  }, [orderingParamName, searchParams, setSearchParams]);

  return (
    <>
      <IconButton
        color="primary"
        onClick={(e) => setSortControlEl(e.currentTarget)}
        style={{ borderRadius: 0 }}
      >
        <SortIcon />
      </IconButton>

      <Menu
        anchorEl={sortControlEl}
        getContentAnchorEl={null}
        open={Boolean(sortControlEl)}
        onClose={dismissMenu(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        TransitionComponent={Fade}
      >
        {makeChoices(choices).map((sortChoice, choiceIndex) => {
          let selected;
          if (activeOrdering) {
            selected = sortChoice.value === activeOrdering;
          } else {
            selected = choiceIndex === 0;
          }

          return (
            <MenuItem
              key={sortChoice.value}
              onClick={dismissMenu(sortChoice)}
              selected={selected}
            >
              <ListItemIcon>
                {selected ? <RadioButtonCheckedIcon /> : <RadioButtonUncheckedIcon /> }
              </ListItemIcon>

              {sortChoice.label}
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
}

SortControl.propTypes = {
  choices: PropTypes.array.isRequired,
  orderingParamName: PropTypes.string.isRequired,
  searchParams: PropTypes.object,
  setSearchParams: PropTypes.func,
};


//------------------------------------------------------------------------------
const selectionControlStyles = makeStyles((theme) => ({
  button: {
    padding: theme.spacing(1),
  },

  buttonGroupButton: {
    padding: theme.spacing(0.5, 1),
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
  const classes = selectionControlStyles();

  const {
    onClick,
    onSelectionMenuItemClick,
    selectionDisabled,
    selectionMenu,
  } = props;

  const [selectMenuEl, setSelectMenuEl] = useState(null);


  const handleSelectionMenuDismiss = useCallback((choice) => (e) => {
    if (choice) {
      onSelectionMenuItemClick(choice);
    }
    setSelectMenuEl(null);
  }, [onSelectionMenuItemClick]);


  if (!selectionMenu) {
    return (
      <ToolbarItem
        control={(
          <IconButton
            className={classes.button}
            color={selectionDisabled ? 'default' : 'primary' }
            onClick={onClick}
          >
            <GpsFixedIcon />
          </IconButton>
        )}
        tooltip={`Selection mode is: ${selectionDisabled ? 'Off' : 'On'}`}
      />
    );
  }

  return (
    <>
      <ButtonGroup>
        <Tooltip title={`Selection mode is: ${selectionDisabled ? 'Off' : 'On'}`}>
          <Button
            classes={{
              root: classes.buttonGroupButton,
              outlined: selectionDisabled ? classes.disabled : classes.enabled,
            }}
            onClick={onClick}
            variant="outlined"
          >
            <GpsFixedIcon />
          </Button>
        </Tooltip>

        <Button
          className={classes.menuButton}
          disabled={selectionDisabled}
          onClick={(e) => setSelectMenuEl(e.currentTarget)}
          size="small"
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>

      <Menu
        anchorEl={selectMenuEl}
        open={Boolean(selectMenuEl)}
        onClose={handleSelectionMenuDismiss(null)}
        TransitionComponent={Fade}
      >
        <MenuItem onClick={handleSelectionMenuDismiss('all')}>
          Select All
        </MenuItem>
        <MenuItem onClick={handleSelectionMenuDismiss('none')}>
          Deselect All
        </MenuItem>
      </Menu>
    </>
  );
}

SelectionControl.propTypes = {
  selectionDisabled: PropTypes.bool.isRequired,
  selectionMenu: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  onSelectionMenuItemClick: PropTypes.func.isRequired,
};

//------------------------------------------------------------------------------
function PaginationListControl(props) {
  const { paginationInfo, searchParams, setSearchParams, ...paginationProps } = props;
  const { total_pages, current_page } = paginationInfo;

  const handlePaginationChange = useCallback((e, value) => {
    const updatedSearchParams = new URLSearchParams(searchParams);
    updatedSearchParams.set('page', value);
    setSearchParams(updatedSearchParams);
  }, [searchParams, setSearchParams]);

  return (
    <Pagination
      count={total_pages}
      page={current_page}
      onChange={handlePaginationChange}
      {...paginationProps}
    />
  );
}

PaginationListControl.propTypes = {
  paginationInfo: PropTypes.object.isRequired,
  searchParams: PropTypes.object,
  setSearchParams: PropTypes.func,
};

//------------------------------------------------------------------------------
const listViewStyles = makeStyles((theme) => ({
  centeredContentContainer: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },

  tileView: {
    padding: theme.spacing(1),
  }
}));


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

function ListView(props) {
  const styles = listViewStyles();

  const {
    bindToolbarItemsToSearchParams,
    classes,
    displayMode,
    displaySelectionCount,
    filterMetadata,
    filterParams,
    filterParamTransformer,
    itemIdKey,
    itemLinkKey,
    items,
    itemContextMenuArrangement,
    itemContextProvider,
    itemTransformer,
    listItemComponent,
    listItemComponentFunc,
    listItemSelectionControl,
    listItemProps,
    loadingVariant,
    onConfig,
    onLoad,
    onLoadComplete,
    onLoadError,
    onOrderingChange,
    onPageChange,
    onPageSizeChange,
    orderable,
    orderingParamName,
    paginationControlProps,
    paginationListControlProps,
    PlaceholderComponent,
    responseTransformer,
    selectOnClick,
    selectionInitializer,
    selectionMenu,
    selectionMode,
    searchParams,
    setSearchParams,
    src,
    subsetFilterArrangement,
    tileItemComponent,
    tileItemComponentFunc,
    windowed,
    windowedListItemHeight,
  } = props;


  const [appliedFilterParams, setAppliedFilterParams] = useState(null);
  const [renderedItems, setRenderedItems] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [paginationInfo, setPaginationInfo] = useState(null);
  const [uncontrolledSelection, setUncontrolledSelection] = useState(new Set());
  const [selectionDisabled, setSelectionDisabled] = useState(props.selectionDisabled);

  // Maintain a reference to the fetch request so it can be aborted
  // if this component is unmounted while it is in flight.
  const [fetchRequestContext, setFetchRequestContext] = useState(null);

  const [measuring, setMeasuring] = useState(false);
  const itemHeights = useRef(null);

  // Derived properties

  // The view is assumed to be 'loading' whenever a fetchRequestContext is set.
  const loading = !!fetchRequestContext;

  // ---------------------------------------------------------------------------
  const itemCount = useMemo(() => {
    if (paginationInfo) {
      return paginationInfo.total;
    }
    return renderedItems ? renderedItems.length : undefined;
  }, [renderedItems, paginationInfo]);

  // ---------------------------------------------------------------------------
  // Selection Management
  // ---------------------------------------------------------------------------
  const selection = props.selection || uncontrolledSelection;

  const setSelection = useCallback((updatedSelection) => {
    if (!props.selection) {
      setUncontrolledSelection(updatedSelection);
    }

    if (props.onSelectionChange) {
      props.onSelectionChange(updatedSelection);
    }
  }, [props]);


  const updateSelection = useCallback((item) => {
    const itemId = keyForItem(item);
    const selectedItem = setFind(selection, (i) => keyForItem(i) === itemId);

    let newSelection;
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
  }, [selection]);


  /**
   * Extend the selection to include the given item and
   * insert it into the item list
   * Exported: yes
   */
  const extendSelection = useCallback((item) => {
    const updatedItems = [...renderedItems];
    updatedItems.unshift(item);
    setRenderedItems(updatedItems);

    updateSelection(item);

  }, [selection, renderedItems, updateSelection]);

  // ---------------------------------------------------------------------------

  /**
   * @param item
   * @returns {*} Unique identifier of given item
   */
  const keyForItem = useCallback((item) => {
    return (typeof itemIdKey === 'function') ? itemIdKey(item) : item[itemIdKey];
  }, [itemIdKey]);

  /**
   *
   * @param item
   * @returns {*} Path item should link to
   */
  const pathForItem = useCallback((item) => {
    if (!itemLinkKey) {
      return null;
    }
    return (typeof itemLinkKey === 'function') ? itemLinkKey(item) : item[itemLinkKey];
  }, [itemLinkKey]);


  /**
   * Function to generate the ListItem props for a given item
   * @param item
   * @returns Object containing properties to supply to the list item
   */
  const itemProps = (item, itemIndex) => {
    const itemKey = keyForItem(item);

    const itemContext = itemContextProvider ? itemContextProvider(item) : {};

    const selected = Boolean(setFind(selection, (i) => keyForItem(i) === itemKey));

    return {
      contextMenuItemArrangement: itemContextMenuArrangement,
      key: itemIndex,
      item,
      onSelectionChange: (item) => updateSelection(item),
      selected,
      selectOnClick,
      selectionControl: listItemSelectionControl,
      selectionMode,
      selectionDisabled,
      to: pathForItem(item),
      ...itemContext,
      ...listItemProps,
    };
  };


  /**
   *
   * @param item
   * Helper function to locate the index of the given item
   */
  const findItemIndex = useCallback((sourceItem) => {
    const sourceItemKey = keyForItem(sourceItem);

    return renderedItems.findIndex((targetItem) => (
      keyForItem(targetItem) === sourceItemKey
    ));
  }, [renderedItems]);


  /**
   *
   * @param item
   * Helper function to add the given item to the beginning of the list
   */
  const addItem = useCallback((item) => {
    const updatedItems = [...renderedItems];
    updatedItems.unshift(item);
    setRenderedItems(updatedItems);

    if (paginationInfo) {
      const updatedPaginationInfo = { ...paginationInfo };
      updatedPaginationInfo.total += 1;
      setPaginationInfo(updatedPaginationInfo);
    }
  }, [paginationInfo, renderedItems]);


  /**
   *
   * @param item
   * Helper function to remove the given item from the list
   */
  const removeItem = useCallback((item) => {
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

    const updatedItems = [...renderedItems];
    updatedItems.splice(sourceItemIndex, 1);
    setRenderedItems(updatedItems);

    if (paginationInfo) {
      const updatedPaginationInfo = { ...paginationInfo };
      updatedPaginationInfo.total -= 1;
      setPaginationInfo(updatedPaginationInfo);
    }
  }, [paginationInfo, renderedItems, selection]);


  /**
   *
   * @param oldItem
   * @param newItem
   * Helper function to replace the item 'oldItem' with the given 'newItem'
   */
  const updateItem = useCallback((source, target) => {
    const sourceItemIndex = findItemIndex(source);
    if (sourceItemIndex === -1) {
      // This situation is most likely to occur when a record has been updated
      // that is not within the loaded page
      return;
    }

    if (selection.has(source)) {
      const newSelection = new Set(selection);
      newSelection.delete(source);
      newSelection.add(target);
      setSelection(newSelection);
    }

    const updatedItems = [...renderedItems];
    updatedItems[sourceItemIndex] = target;
    setRenderedItems(updatedItems);
  }, [findItemIndex, renderedItems, selection]);

  // ---------------------------------------------------------------------------
  /**
   * Initialization
   */
  useEffect(() => {
    return (() => {
      // When the component is being unmounted,
      // abort the current fetch request if it is in flight.
      if (fetchRequestContext && fetchRequestContext.abortController) {
        fetchRequestContext.abortController.abort();
      }
    });
  }, []);

  /**
   * When items are supplied directly via the 'items' prop, apply them
   * immediately.
   */
  useEffect(() => {
    setRenderedItems(items);
  }, [items]);

  /**
   * When the supplied filter params are changed, OR the pagnation/ordering
   * parameters change, update the applied filter params
   */
  useEffect(() => {
    if (!filterParams) {
      return;
    }

    let params = { ...filterParams };
    // Enable the filter parameters be modified by the consumer prior
    // to issuing the API request. An example use case would be to convert
    // "param=null" to "param__isnull=true"
    if (filterParamTransformer) {
      params = filterParamTransformer(params);
    }

    params = filterEmptyValues(params);

    // Let the filter params be transformed before they're committed
    params = coerceFilterParams(params);

    if (!isEqual(params, appliedFilterParams)) {
      setAppliedFilterParams(params);
    }
  }, [filterParams, filterParamTransformer]);


  /**
   * Reload the list whenever ANY properties affecting the source query are altered
   */
  useEffect(() => {
    // When the list items have been explicitly provided as props,
    // there is no need to proceed further
    if (!(src && appliedFilterParams)) {
      return;
    }

    if (onLoad) {
      onLoad(appliedFilterParams);
    }

    fetchItems(src, appliedFilterParams).then((res) => {
      const transformer = responseTransformer || transformFetchItemsResponse;
      const responseData = transformer(res, itemTransformer);
      const { items, pagination } = responseData;

      if (pagination) {
        setPaginationInfo(pagination);
      }

      setRenderedItems(items);

      if (selectionInitializer) {
        setSelection(selectionInitializer(items));
      }

      setLoadError(null);

      if (onLoadComplete) {
        onLoadComplete(responseData, res);
      }
    }).catch((err) => {
      setRenderedItems(null);
      setSelection(new Set());
      setLoadError(err);

      if (onLoadError) {
        onLoadError(err);
      }
    });
  }, [appliedFilterParams, src]);


  // ---------------------------------------------------------------------------
  /**
   * Respond to selection menu by updating selection accordingly
   */
  const handleSelectionMenuItemClick = useCallback((action) => {
    switch (action) {
      case 'all':
        const newSelection = new Set(selection);
        renderedItems.forEach((item) => newSelection.add(item));
        setSelection(newSelection);
        break;
      case 'none':
        setSelection(new Set());
        break;
      default:
        throw new Error(`Unsupported selection action: ${action}`);
    }
  }, []);


  // ---------------------------------------------------------------------------
  const constructToolbarItem = useCallback((itemType, context) => {
    const commonToolbarItemProps = { searchParams, setSearchParams };

    switch (itemType) {
      case 'selectionControl':
        if (!selectionMode) {
          return null;
        }

        return (
          <SelectionControl
            key="selection-control"
            onClick={() => {
              // When the selection control button is clicked, toggle selection mode.
              setSelectionDisabled(!selectionDisabled);
              // _Always_ clear current selection when selection mode is toggled
              setSelection(new Set());
            }}
            onSelectionMenuItemClick={handleSelectionMenuItemClick}
            selectionDisabled={selectionDisabled}
            selectionMenu={selectionMenu}
            {...commonToolbarItemProps}
          />
        );

      case 'paginationControl':
        let paginationControlLabel = null;
        if (displaySelectionCount && !selectionDisabled && selectionMode && itemCount !== null) {
          paginationControlLabel = `${selection.size} of ${itemCount} selected`;
        }
        return (
          <PaginationControl
            {...paginationControlProps}
            key={itemType}
            label={paginationControlLabel}
            paginationInfo={paginationInfo}
            count={itemCount}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
            {...commonToolbarItemProps}
          />
        );

      case 'paginationListControl':
        if (!paginationInfo || paginationInfo.total_pages === 1) {
          return null;
        }

        return (
          <PaginationListControl
            {...paginationListControlProps}
            key={itemType}
            paginationInfo={paginationInfo}
            {...commonToolbarItemProps}
          />
        );

      case 'sortControl':
        if (!(orderable && filterMetadata)) {
          return null;
        }
        const orderingFields = filterMetadata.ordering_fields;
        if (!(orderingFields && orderingFields.length)) {
          return null;
        }
        return (
          <SortControl
            choices={orderingFields}
            key="sort-control"
            orderingParamName={orderingParamName}
            {...commonToolbarItemProps}
          />
        );

      default:
        throw new Error(`Unknown toolbar item type: ${itemType}`);
    }
  }, [
    bindToolbarItemsToSearchParams,
    displaySelectionCount,
    itemCount,
    orderable,
    filterMetadata,
    handleSelectionMenuItemClick,
    onPageChange,
    onPageSizeChange,
    orderingParamName,
    paginationInfo,
    paginationControlProps,
    paginationListControlProps,
    searchParams,
    setSearchParams,
    selection,
    selectionDisabled,
    selectionMenu,
    selectionMode,
  ]);

  // ---------------------------------------------------------------------------
  /**
   * Invoke the onConfig callback when any of the exposed state properties are affected.
   */
  useEffect(() => {
    if (!onConfig) {
      return;
    }

    onConfig({
      constructToolbarItem,
      extendSelection,
      selectionDisabled,
      setRenderedItems: handleSetRenderedItems,
      updateItem: handleItemUpdate,
    });
  }, [
    constructToolbarItem,
    extendSelection,
    selectionDisabled,
    // renderedItems,
  ]);


  const handleItemUpdate = useCallback((change) => {
    if (!renderedItems) {
      return;
    }

    if (change.old && change.new === null) {
      removeItem(change.old);
    } else if (change.old === null && change.new) {
      addItem(change.new);
    } else {
      updateItem(change.old, change.new);
    }
  }, [removeItem, addItem, updateItem]);


  const handleSetRenderedItems = useCallback((items) => {
    setSelection(new Set());
    setRenderedItems(items);
  }, []);


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
            reject(response);
          }

          resolve(response);
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
    if (windowed) {
      if (renderedItems && renderedItems.length) {
        itemHeights.current = new Array(renderedItems.length).fill(windowedListItemHeight);
        if (!windowedListItemHeight) {
          setMeasuring(true);
        }
      } else {
        itemHeights.current = [];
      }
    } else {
      itemHeights.current = null;
    }
  }, [windowed, renderedItems]);

  //----------------------------------------------------------------------------

  /**
   * Produce a list item from the given item
   * @param item: Item to be rendered
   * @param itemIndex: Array index of item being rendered
   * @param style: Additional style params (primarily used in windowed mode)
   * @param onMount: Optional callback to be invoked when the list item mounts
   */
  const renderListItem = (item, itemIndex, style, onMount) => {
    const ListItemComponent = listItemComponentFunc ? listItemComponentFunc(item) : listItemComponent;

    return (
      <ListItemComponent
        onMount={onMount}
        style={style}
        {...itemProps(item, itemIndex)}
      />
    );
  };

  const renderTileItem = (item, itemIndex, style, onMount) => {
    const TileItemComponent = tileItemComponentFunc ? tileItemComponentFunc(item) : tileItemComponent;

    return (
      <TileItemComponent
        onMount={onMount}
        style={style}
        {...itemProps(item, itemIndex)}
      />
    );
  };


  const createPlaceholderComponent = () => {
    if (loadingVariant === 'circular') {
      return (
        <div className={styles.centeredContentContainer}>
          <CircularProgress disableShrink />
        </div>
      );
    }

    if (loadingVariant === 'placeholder' && PlaceholderComponent) {
      const placeholderCount = 10;
      const placeholders = new Array(placeholderCount);
      for (let i = 0; i < placeholderCount; ++i) {
        placeholders[i] = <PlaceholderComponent key={i} />
      }

      return (
        <List disablePadding>
          {placeholders}
        </List>
      );
    }

    if (loadingVariant === 'linear') {
      return <LinearProgress />;
    }

    return null;
  };


  //----------------------------------------------------------------------------
  // Putting it all together...time to render the main view
  //----------------------------------------------------------------------------
  if (loadError) {
    return (
      <Alert severity="error">
        Failed to load data.
      </Alert>
    );
  }

  if (!renderedItems) {
    return createPlaceholderComponent();
  }

  if (!renderedItems.length) {
    return (
      <Alert severity="info">
        {props.emptyListPlaceholderText}
      </Alert>
    );
  }

  let view = null;

  if (displayMode === 'list') {
    const listViewClassNames = [];
    if (loading) {
      listViewClassNames.push(classes.listViewLoading);
    }

    if (windowed) {
      const itemCount = renderedItems.length;
      view = measuring ? (
        <List disablePadding style={{ visibility: 'hidden' }}>
          {renderedItems.map(
            (item, itemIndex) => renderListItem(item, itemIndex, null, (element) => {
               // Callback invoked when a list item is first mounted.
               // When in windowed mode, whereby a height must be specified for each list item,
               // this routine is used to initially determine that height.
              const listItemRect = element.getBoundingClientRect();
              itemHeights.current[itemIndex] = listItemRect.height;
              if (itemIndex === itemCount - 1) {
                setMeasuring(false);
              }
            })
          )}
        </List>
      ) : (
        <AutoSizer>
          {({ width, height }) => (
            <VariableSizeList
              className={clsx(listViewClassNames)}
              height={height}
              innerElementType={List}
              itemData={{ renderedItems }}
              itemCount={renderedItems.length}
              itemSize={(index) => itemHeights.current[index]}
              width={width}
            >
              {({ data, index, style }) => (
                renderListItem(data.renderedItems[index], index, style)
              )}
            </VariableSizeList>
          )}
        </AutoSizer>
      );
    } else {
      view = (
        <List
          className={clsx(listViewClassNames)}
          disablePadding
        >
          {renderedItems.map(
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
        <Grid container className={styles.tileView}>
          {renderedItems.map(
            (item, itemIndex) => renderTileItem(item, itemIndex)
          )}
        </Grid>
      );
    }
  }

  return view;
}


ListView.propTypes = {
  classes: PropTypes.object,

  displayMode: PropTypes.oneOf(['list', 'tile']).isRequired,
  displaySelectionCount: PropTypes.bool,

  emptyListPlaceholderText: PropTypes.string,

  filterParams: PropTypes.object,
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

  listItemComponent: PropTypes.elementType,
  listItemComponentFunc: PropTypes.func,
  listItemProps: PropTypes.object,
  listItemSelectionControl: PropTypes.bool,
  loadingVariant: PropTypes.oneOf(['circular', 'linear', 'placeholder']),

  location: PropTypes.object,

  onConfig: PropTypes.func,
  onLoad: PropTypes.func,
  onLoadComplete: PropTypes.func,
  onLoadError: PropTypes.func,
  onOrderingChange: PropTypes.func,
  onPageChange: PropTypes.func,
  onPageSizeChange: PropTypes.func,
  onSelectionChange: PropTypes.func,

  orderable: PropTypes.bool,
  orderingParamName: PropTypes.string,
  paginationListControlProps: PropTypes.object,

  PlaceholderComponent: PropTypes.elementType,

  responseTransformer: PropTypes.func,

  searchParams: PropTypes.object,
  setSearchParams: PropTypes.func,

  selection: PropTypes.object,
  selectionDisabled: PropTypes.bool,
  selectionInitializer: PropTypes.func,
  selectionMode: PropTypes.oneOf(['single', 'multiple']),
  selectionMenu: PropTypes.bool,
  selectOnClick: PropTypes.bool,

  src: PropTypes.string,

  subsetParamName: PropTypes.string,
  subsetFilterArrangement: PropTypes.array,

  tileItemComponent: PropTypes.elementType,
  tileItemComponentFunc: PropTypes.func,

  windowed: PropTypes.bool,
  windowedListItemHeight: PropTypes.number,
};

ListView.defaultProps = {
  classes: {},
  displaySelectionCount: true,
  emptyListPlaceholderText: 'No items to display',
  filterParams: {},
  items: null,
  itemIdKey: 'id',
  listItemSelectionControl: true,
  loadingVariant: 'linear',
  orderable: true,
  orderingParamName: 'order',
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
  windowed: false,
  windowedListItemHeight: 0,
};

export default ListView;
