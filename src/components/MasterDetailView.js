import clsx from 'clsx';

import qs from 'query-string';

import PropTypes from 'prop-types';
import React, {
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';
import { CSSTransition } from 'react-transition-group';

import { makeStyles } from '@material-ui/core/styles';
import { isWidthUp } from '@material-ui/core/withWidth';

import NavManager from '../managers/NavManager';
import { useWidth } from '../util/hooks';

const DETAIL_VIEW_TRANSITION_ENTER_DURATION = 1000;
const DETAIL_VIEW_TRANSITION_EXIT_DURATION = 200;

const styles = makeStyles((theme) => ({
  masterDetailView: {
    [theme.breakpoints.up('md')]: {
      display: 'flex',
      height: '100%',
      overflow: 'auto',
    },
  },

  listViewContainer: {
    borderRight: `1px solid ${theme.palette.grey[200]}`,
    height: '100%',
    overflow: 'auto',
  },

  detailViewContainer: {
    flex: 1,
    overflow: 'auto',
  },

  detailViewTransitionEnter: {
    opacity: 0,
  },

  detailViewTransitionEnterActive: {
    opacity: 1,
    transition: `opacity ${DETAIL_VIEW_TRANSITION_ENTER_DURATION}ms`,
  },

  detailViewTransitionEnterDone: {
    opacity: 1,
  },

  detailViewTransitionExit: {
    opacity: 1,
  },

  detailViewTransitionExitActive: {
    opacity: 0,
    transition: `opacity ${DETAIL_VIEW_TRANSITION_EXIT_DURATION}ms`,
  },

  detailViewTransitionExitDone: {
    opacity: 0,
  },
}));

function MasterDetailView(props) {
  const classes = styles();

  const {
    breakpoint,
    className,
    detailViewPlaceholder,
    DetailViewComponent,
    detailViewProps,
    inspectedObjectLoader,
    itemIdKey,
    ListViewComponent,
    listViewProps,
    listViewWidth,
    location,
  } = props;

  const detailViewContainerRef = useRef(null);

  const [inspectedObject, setInspectedObject] = useState(undefined);
  const [nextInspectedObject, setNextInspectedObject] = useState(null);

  useEffect(() => {
    const qsParams = qs.parse(location.search);
    const focusedItemId = qsParams[itemIdKey];

    if (!focusedItemId) {
      setInspectedObject(null);
      return;
    }

    if (!inspectedObject || (inspectedObject && focusedItemId !== inspectedObject[itemIdKey])) {
      if (location.state && location.state.item) {
        setInspectedObject(location.state.item);
        setNextInspectedObject(null);
      }

      inspectedObjectLoader(focusedItemId).then((data) => {
        setInspectedObject(data);
        setNextInspectedObject(null);
      });
    }
  }, [location, inspectedObject]);


  const currentScreenWidth = useWidth();
  const showDetailView = isWidthUp(breakpoint, currentScreenWidth);
  

  const updateInspectedObject = (item) => {
    detailViewContainerRef.current.scrollTop = 0;

    NavManager.updateUrlParam(
      itemIdKey,
      item[itemIdKey],
      false,
      { item }
    );
  };


  const loadItem = (item) => {
    if (inspectedObject) {
      if (inspectedObject[itemIdKey] !== item[itemIdKey]) {
        setNextInspectedObject(item);
      }
    } else {
      updateInspectedObject(item);
    }
  };


  const handleDetailViewTransitionExited = () => {
    updateInspectedObject(nextInspectedObject);
  };


  const handleListItemNavigate = (item) => {
    if (showDetailView) {
      loadItem(item);
    } else {
      NavManager.navigate(item.path, { state: { item }});
    }
  };


  const handleDetailViewClose = useCallback(() => {
    NavManager.clearUrlParam(itemIdKey);
  }, []);


  // Do not render until the screen width has been determined
  if (!currentScreenWidth) {
    return null;
  }


  const listView = (
    <ListViewComponent
      {...listViewProps}
      location={location}
      onNavigate={handleListItemNavigate}
    />
  );

  // Small screens will display a standard list view whereby the
  // list items navigate to a standalone detail page.
  if (!showDetailView) {
    return listView;
  }

  let detailView = null;
  if (inspectedObject === null) {
    detailView = detailViewPlaceholder;
  } else if (inspectedObject) {
    detailView = (
      <CSSTransition
        appear
        classNames={{
          appear: classes.detailViewTransitionEnter,
          appearActive: classes.detailViewTransitionEnterActive,
          enter: classes.detailViewTransitionEnter,
          enterActive: classes.detailViewTransitionEnterActive,
          enterDone: classes.detailViewTransitionEnterDone,
          exit: classes.detailViewTransitionExit,
          exitActive: classes.detailViewTransitionExitActive,
          exitDone: classes.detailViewTransitionExitDone,
        }}
        in={!nextInspectedObject}
        onExited={handleDetailViewTransitionExited}
        timeout={{
         appear: DETAIL_VIEW_TRANSITION_ENTER_DURATION,
         enter: DETAIL_VIEW_TRANSITION_ENTER_DURATION,
         exit: DETAIL_VIEW_TRANSITION_EXIT_DURATION,
        }}
      >
        <DetailViewComponent
          location={location}
          representedObject={inspectedObject}
          onClose={handleDetailViewClose}
          {...detailViewProps}
        />
      </CSSTransition>
    );
  }

  return (
    <div className={clsx(classes.masterDetailView, className)}>
      <div
        className={classes.listViewContainer}
        style={{ width: listViewWidth }}
      >
        {listView}
      </div>

      <div className={classes.detailViewContainer} ref={detailViewContainerRef}>
        {detailView}
      </div>
    </div>
  );
}

MasterDetailView.propTypes = {
  breakpoint: PropTypes.string.isRequired,
  className: PropTypes.string,
  DetailViewComponent: PropTypes.elementType.isRequired,
  detailViewPlaceholder: PropTypes.element,
  detailViewProps: PropTypes.object,
  inspectedObjectLoader: PropTypes.func.isRequired,
  itemIdKey: PropTypes.string.isRequired,
  ListViewComponent: PropTypes.elementType.isRequired,
  listViewProps: PropTypes.object,
  listViewWidth: PropTypes.number.isRequired,
  location: PropTypes.object.isRequired,
};

MasterDetailView.defaultProps = {
  breakpoint: 'md',
  detailViewProps: {},
  listViewProps: {},
  listViewWidth: 375,
};

export default MasterDetailView;
