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

import GridList from '@material-ui/core/GridList';
import List from '@material-ui/core/List';

import IconButton from '@material-ui/core/IconButton';
import TablePagination from '@material-ui/core/TablePagination';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import GpsFixedIcon from '@material-ui/icons/GpsFixed';

import NavManager from '@material-appkit/core/managers/NavManager';
import ServiceAgent from '@material-appkit/core/util/ServiceAgent';

//------------------------------------------------------------------------------
const styles = makeStyles((theme) => ({
  paginationToolbar: {
    height: theme.spacing(4),
    minHeight: theme.spacing(4),
  },

  paginationActions: {
    marginLeft: 0,

    '& button': {
      padding: theme.spacing(1),
    },
  },
}));

function PagedListView(props) {
  const {
    displayMode,
    itemContextProvider,
    itemIdKey,
    location,
    pageSize,
    selectionAlways,
    selectionMode,
  } = props;

  const classes = styles();

  const [filterParams, setFilterParams] = useState(null);
  const [items, setItems] = useState(null);
  const [page, setPage] = useState(location ? parseInt(NavManager.qsParams.page || 1) : 1);
  const [paginationInfo, setPaginationInfo] = useState(null);
  const [selection, setSelection] = useState({});
  const [selectionDisabled, setSelectionDisabled] = useState(true);


  /**
   * Update filter params when the page changes
   */
  useEffect(() => {
    const params = { ...props.defaultFilterParams };

    if (pageSize) {
      params.page_size = pageSize;
      params.page = page;
    }

    if (props.location) {
      NavManager.updateUrlParam('page', page);
    }

    if (!isEqual(params, filterParams)) {
      setFilterParams(params);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.defaultFilterParams, page, pageSize]);

  /**
   * @param item
   * @returns {*}
   */
  const keyForItem = (item) => {
    return (typeof itemIdKey === 'function') ? itemIdKey(item) : item[itemIdKey];
  };


  const updateSelection = (newSelection) => {
    setSelection(newSelection);

    if (props.onSelectionChange) {
      const selectedItems = Object.values(newSelection);
      if (selectionMode === 'single') {
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

    const newSelection = {};
    if (selectionMode === 'single') {
      if (!selection[itemId]) {
        newSelection[itemId] = item;
      }
    } else {
      Object.assign(newSelection, selection);
      if (newSelection[itemId]) {
        delete newSelection[itemId];
      } else {
        newSelection[itemId] = item;
      }
    }

    updateSelection(newSelection);
  };

  /**
   * Instruct the list to reload using the currently set filterParams
   */
  const reload = useCallback(async() => {
    if (!filterParams) {
      return;
    }

    if (props.onLoad) {
      props.onLoad(filterParams);
    }

    const res = await ServiceAgent.get(props.src, filterParams);
    const responseInfo = res.body;
    setItems(responseInfo.data);

    if (responseInfo.meta && responseInfo.meta.pagination) {
      setPaginationInfo(responseInfo.meta.pagination);
    }

    if (props.onComplete) {
      props.onComplete(responseInfo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.src, filterParams]);


  /**
   *
   */
  const sort = useCallback((sortFunc) => {
    const sortedItems = [...items];
    sortedItems.sort(sortFunc);
    setItems(sortedItems);
  }, [items]);

  /**
   * Reload the list whenever the filterParams are altered
   */
  useEffect(() => {
    reload();
  }, [reload, props.src, filterParams]);


  /**
   * Update the list's configuration whenever the filterParams change.
   * In particular, update the paging control.
   */
  useEffect(() => {
    const toolbarItems = [];

    if (paginationInfo) {
      toolbarItems.push((
        <TablePagination
          classes={{
            toolbar: classes.paginationToolbar,
            actions: classes.paginationActions,
          }}
          count={paginationInfo.total}
          component="div"
          key="pagingControl"
          page={page - 1}
          rowsPerPage={paginationInfo.per_page}
          rowsPerPageOptions={[paginationInfo.per_page]}
          onChangePage={(e, value) => { setPage(value + 1); }}
        />
      ));
    }

    if (!selectionAlways) {
      toolbarItems.push(
        <IconButton
          key="modeToggle"
          color={selectionDisabled ? 'default' : 'primary' }
          onClick={() => {
            // Clear current selection when selection mode is enabled/disabled
            updateSelection({});
            setSelectionDisabled(!selectionDisabled);
          }}
        >
          <GpsFixedIcon />
        </IconButton>
      );
    }

    if (props.onConfig) {
      props.onConfig({
        reload,
        selectionDisabled,
        sort,
        toolbarItems,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort, filterParams, selectionDisabled, paginationInfo]);


  //----------------------------------------------------------------------------
  if (items === null) {
    return null;
  }

  if (!items.length) {
    return <Typography>No items to show</Typography>;
  }

  // Let the active view mode determine whether to render a List or a Grid
  const itemProps = (item) => ({
    contextProvider: itemContextProvider,
    item: item,
    onSelectionChange: handleSelectionControlClick,
    selected: !!selection[keyForItem(item)],
    selectionMode: selectionAlways ? selectionMode : selectionDisabled ? null : selectionMode,
    ...props.listItemProps,
  });


  if (displayMode === 'list') {
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

  if (displayMode === 'tile') {
    const gridListProps = Object.assign({
      cellHeight: 'auto',
      cols: 3,
    }, props.gridListProps);

    return (
      <GridList {...gridListProps}>
        {items.map((item) => (
          <props.tileItemRenderer
            key={keyForItem(item)}
            {...itemProps(item)}
          />
        ))}
      </GridList>
    );
  }
}

PagedListView.propTypes = {
  defaultFilterParams: PropTypes.object,
  gridListProps: PropTypes.object,

  itemContextProvider: PropTypes.func,
  itemIdKey: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]),
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
  src: PropTypes.string,
  tileItemRenderer: PropTypes.func,
  displayMode: PropTypes.oneOf(['list', 'tile']).isRequired,
};

PagedListView.defaultProps = {
  defaultFilterParams: {},
  gridListProps: {},
  itemIdKey: 'id',
  selectionAlways: false,
  selectOnClick: false,
};

export default PagedListView;
