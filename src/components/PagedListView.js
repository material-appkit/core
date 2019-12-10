/**
*
* PagedListView
*
*/

import isEqual from 'lodash.isequal';
import PropTypes from 'prop-types';

import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';

import List from '@material-ui/core/List';

import IconButton from '@material-ui/core/IconButton';
import TablePagination from '@material-ui/core/TablePagination';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import GpsFixedIcon from '@material-ui/icons/GpsFixed';

import NavManager from '../managers/NavManager';
import ServiceAgent from '../util/ServiceAgent';

import TileList from './TileList';
import ToolbarItem from './ToolbarItem';

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
  const {
    selectionMode,
  } = props;

  const classes = styles();

  const qsParams = NavManager.qsParams;
  const qsPageParam = parseInt(qsParams.page || 1);

  const [filterParams, setFilterParams] = useState(null);
  const [items, setItems] = useState(null);
  const [page, setPage] = useState(props.location ? qsPageParam : 1);
  const [paginationInfo, setPaginationInfo] = useState(null);
  const [selectedItemIds, setSelectedItemIds] = useState(new Set());
  const [selectionDisabled, setSelectionDisabled] = useState(true);
  const [toolbarItems, setToolbarItems] = useState({});

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
   * @param oldItem
   * @param newItem
   * Helper function to replace the item 'oldItem' with the given 'newItem'
   */
  const updateItem = (source, target) => {
    const sourceItemKey = keyForItem(source);
    const sourceItemIndex = items.findIndex((item) => {
      const itemKey = keyForItem(item);
      if (itemKey === sourceItemKey) {
        return true;
      }
    });

    if (sourceItemIndex === -1) {
      throw new Error(`Unable to locate source item with key ${sourceItemKey}`);
    }

    const updatedItems = [...items];
    updatedItems[sourceItemIndex] = target;
    setItems(updatedItems);
  };


  /**
   * Update filter params when the page changes
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

    if (!isEqual(params, filterParams)) {
      setFilterParams(params);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.defaultFilterParams, page, props.pageSize]);



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


  const handleItemUpdate = (change) => {
    updateItem(change.old, change.new);
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

    let onCompleteResult = null;
    let updatedItems = null;

    if (typeof(props.src) === 'string') {
      const res = await ServiceAgent.get(props.src, filterParams);
      const responseInfo = res.body;

      if (responseInfo.data) {
        updatedItems = responseInfo.data;
      } else {
        updatedItems = responseInfo;
      }

      if (responseInfo.meta && responseInfo.meta.pagination) {
        setPaginationInfo(responseInfo.meta.pagination);
      }
      onCompleteResult = responseInfo;
    } else {
      const filteredItems = [...props.src];
      // TODO: Filter the source array with the given params
      updatedItems = filteredItems;
      onCompleteResult = filteredItems;
    }

    // If a transformer has been supplied, apply it to the
    // newly assigned records.

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
      props.onComplete(onCompleteResult);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
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
   * Update the list's configuration whenever the filterParams change.
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

    setToolbarItems(newToolbarItems);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort, filterParams, selectedItemIds, selectionDisabled, paginationInfo]);

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

  if (props.displayMode === 'list') {
    return (
      <List disablePadding>
        {items.map((item) => (
          <props.listItemRenderer
            key={keyForItem(item)}
            selectOnClick={props.selectOnClick}
            {...itemProps(item)}
          />
        ))}
      </List>
    );
  }

  if (props.displayMode === 'tile') {
    return (
      <TileList {...props.tileListProps}>
        {items.map((item) => (
          <props.tileItemRenderer
            key={keyForItem(item)}
            {...itemProps(item)}
          />
        ))}
      </TileList>
    );
  }
}

PagedListView.propTypes = {
  defaultFilterParams: PropTypes.object,
  displayMode: PropTypes.oneOf(['list', 'tile']).isRequired,

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
