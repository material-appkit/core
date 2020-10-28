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
import ErrorIcon from '@material-ui/icons/Error';
import GpsFixedIcon from '@material-ui/icons/GpsFixed';
import SortIcon from '@material-ui/icons/Sort';

import ServiceAgent from '../util/ServiceAgent';
import { makeChoices } from '../util/array';
import { filterEmptyValues } from '../util/object';
import { find as setFind } from '../util/set';

import PaginationControl from './PaginationControl';
import TileList from './TileList';
import ToolbarItem from './ToolbarItem';

//------------------------------------------------------------------------------
function SortControl(props) {
  const {
    choices,
    onDismiss,
    selectedOrdering,
  } = props;

  const [sortControlEl, setSortControlEl] = useState(null);

  let orderingLabel = '';
  choices.forEach((choice) => {
    if (choice[0] === selectedOrdering) {
      orderingLabel = choice[1];
    }
  });

  const dismissMenu = (choice) => {
    setSortControlEl(null);
    onDismiss(choice);
  };

  return (
    <Fragment>
      <Tooltip title={`Ordered by: ${orderingLabel}`}>
        <IconButton
          color="primary"
          onClick={(e) => setSortControlEl(e.currentTarget)}
          style={{ borderRadius: 0 }}
        >
          <SortIcon />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={sortControlEl}
        getContentAnchorEl={null}
        id="sort-menu"
        open={Boolean(sortControlEl)}
        onClose={() => dismissMenu(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        {makeChoices(choices).map((sortChoice) => (
          <MenuItem
            key={sortChoice.value}
            onClick={() => dismissMenu(sortChoice)}
            selected={sortChoice.value === selectedOrdering}
          >
            {sortChoice.label}
          </MenuItem>
        ))}
      </Menu>
    </Fragment>
  );
}

SortControl.propTypes = {
  choices: PropTypes.array.isRequired,
  onDismiss: PropTypes.func.isRequired,
  selectedOrdering: PropTypes.string,
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
const pagedListViewStyles = makeStyles((theme) => ({
  centeredContentContainer: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
}));

function PagedListView(props) {
  const styles = pagedListViewStyles();

  const {
    classes,
    filterMetadata,
    filterParams,
    filterParamTransformer,
    items,
    itemContextMenuArrangement,
    itemContextProvider,
    itemTransformer,
    listItemProps,
    loadingVariant,
    onConfig,
    onLoad,
    onLoadComplete,
    onLoadError,
    onOrderingChange,
    onPageChange,
    onPageSizeChange,
    onToolbarChange,
    orderingParamName,
    paginated,
    paginationControlProps,
    paginationListControlProps,
    PlaceholderComponent,
    selectionMenu,
    selectionMode,
    src,
    subsetFilterArrangement,
    windowed,
  } = props;

  const [appliedFilterParams, setAppliedFilterParams] = useState(null);
  const [renderedItems, setRenderedItems] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [paginationInfo, setPaginationInfo] = useState(null);
  const [selectedSubsetArrangementIndex, setSelectedSubsetArrangementIndex] = useState(null);
  const [uncontrolledSelection, setUncontrolledSelection] = useState(new Set());
  const [selectionDisabled, setSelectionDisabled] = useState(props.selectionDisabled);

  // Maintain a reference to the fetch request so it can be aborted
  // if this component is unmounted while it is in flight.
  const [fetchRequestContext, setFetchRequestContext] = useState(null);

  const [measuring, setMeasuring] = useState(false);
  const itemHeights = useRef(null);

  const toolbarItemsRef = useRef({});

  // Derived properties

  // The view is assumed to be 'loading' whenever a fetchRequestContext is set.
  const loading = !!fetchRequestContext;

  const ordering = appliedFilterParams ? appliedFilterParams[orderingParamName] : null;

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
    const updatedItems = [...renderedItems];
    updatedItems.unshift(item);
    setRenderedItems(updatedItems);

    updateSelection(item);

  }, [selection, renderedItems]);


  // ---------------------------------------------------------------------------
  // Pagination
  // ---------------------------------------------------------------------------
  const setPage = (value) => {
    if (onPageChange) {
      onPageChange(value);
    }
  };

  const setPageSize = (value) => {
    if (onPageSizeChange) {
      onPageSizeChange(value);
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
    return renderedItems.findIndex((item) => {
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
    const updatedItems = [...renderedItems];
    updatedItems.unshift(item);
    setRenderedItems(updatedItems);

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

    const updatedItems = [...renderedItems];
    updatedItems.splice(sourceItemIndex, 1);
    setRenderedItems(updatedItems);

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

    const updatedItems = [...renderedItems];
    updatedItems[sourceItemIndex] = target;
    setRenderedItems(updatedItems);
  };


  const updateToolbarItems = (change) => {
    const newToolbarItems = { ...toolbarItemsRef.current, ...change };
    toolbarItemsRef.current = newToolbarItems;

    if (onToolbarChange) {
      onToolbarChange(newToolbarItems);
    }
  };

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
  }, [filterParams]);


  /**
   * Reload the list whenever ANY properties affecting the source query are altered
   */
  useEffect(() => {
    // When the list items have been explicitly provided as props,
    // there is no need to proceed further
    if (items || !appliedFilterParams) {
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

      setRenderedItems(updatedItems);
      setLoadError(null);

      if (onLoadComplete) {
        onLoadComplete(updatedItems, fetchItemsResult.response);
      }
    }).catch((err) => {
      setRenderedItems(null);
      setLoadError(err);

      if (onLoadError) {
        onLoadError(err);
      }
    });
  }, [appliedFilterParams, items]);


  /**
   * Update the selectionControl toolbarItem when selection mode is enabled/disabled
   */
  useEffect(() => {
    const updatedToolbarItems = {};

    updatedToolbarItems.selectionControl = (
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

    if (paginated && paginationInfo) {
      let pageLabel = null;
      if (!selectionDisabled && selectionMode === 'multiple') {
        pageLabel = `${selection.size} of ${paginationInfo.total} selected`;
      }
      updatedToolbarItems.paginationControl = (
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

      updatedToolbarItems.paginationListControl = (
        <Pagination
          count={paginationInfo.total_pages}
          page={paginationInfo.current_page}
          onChange={(e, value) => setPage(value)}
          {...paginationListControlProps}
        />
      );
    }

    updateToolbarItems(updatedToolbarItems);
  }, [paginationInfo, selection, selectionDisabled]);


  useEffect(() => {
    if (!filterMetadata) {
      return;
    }

    const orderingFields = filterMetadata.ordering_fields;
    if (!(orderingFields && orderingFields.length)) {
      return;
    }

    updateToolbarItems({
      sortControl: (
        <SortControl
          choices={orderingFields}
          selectedOrdering={ordering}
          onDismiss={handleSortDialogDismiss}
        />
      )
    });
  }, [filterMetadata, ordering]);


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
    renderedItems,
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

    if (itemIndex === renderedItems.length - 1) {
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
        renderedItems.forEach((item) => { newSelection.add(item); });
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
    if (onOrderingChange) {
      onOrderingChange(choice);
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
    if (!(windowed && renderedItems)) {
      itemHeights.current = null;
      return;
    }

    if (renderedItems.length) {
      itemHeights.current = new Array(renderedItems.length).fill(50);
      setMeasuring(true);
    } else {
      itemHeights.current = [];
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
      <div className={styles.centeredContentContainer}>
        <ErrorIcon fontSize="large" />
        <Typography>
          Failed to load data.
        </Typography>
      </div>
    );
  }

  if (!renderedItems) {
    return createPlaceholderComponent();
  }

  if (!renderedItems.length) {
    if (props.emptyListPlaceholder !== undefined) {
      return props.emptyListPlaceholder;
    }

    return (
      <div className={styles.centeredContentContainer}>
        <Typography>
          No items to display
        </Typography>
      </div>
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
          {renderedItems.map(
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
          className={classNames(listViewClassNames)}
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
        <TileList
          selectionDisabled={selectionDisabled}
          {...props.tileListProps}
        >
          {renderedItems.map((item) => (
            <props.tileItemComponent
              key={keyForItem(item)}
              {...itemProps(item)}
            />
          ))}
        </TileList>
      );
    }
  }

  return view;
}


PagedListView.propTypes = {
  classes: PropTypes.object,

  defaultSelection: PropTypes.object,

  displayMode: PropTypes.oneOf(['list', 'tile']).isRequired,

  emptyListPlaceholder: PropTypes.element,

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

  listItemProps: PropTypes.object,
  listItemComponent: PropTypes.func,

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
  onToolbarChange: PropTypes.func,

  orderingParamName: PropTypes.string,
  paginated: PropTypes.bool,
  paginationListControlProps: PropTypes.object,

  PlaceholderComponent: PropTypes.elementType,

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
  items: null,
  itemIdKey: 'id',
  loadingVariant: 'circular',
  orderingParamName: 'order',
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
