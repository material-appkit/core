import clsx from 'clsx';

import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';

import { CSSTransition } from 'react-transition-group';

import Fade from '@material-ui/core/Fade';
import { makeStyles } from '@material-ui/core/styles';
import { isWidthUp } from '@material-ui/core/withWidth';

import { pluck } from '../util/set';
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
    borderRight: `1px solid ${theme.palette.grey[400]}`,
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
    ListViewComponent,
    listViewContainerClassName,
    listViewProps,
    listViewSelectionInitializer,
    location,
    onDetailViewClose,
    onListViewSelectionChange,
  } = props;


  const [inspectedObject, setInspectedObject] = useState(null);

  const [detailView, setDetailView] = useState(null);
  const [nextDetailView, setNextDetailView] = useState(null);
  const [detailViewReady, setDetailViewReady] = useState(true);

  const detailViewContainerRef = useRef(null);

  const currentScreenWidth = useWidth();
  const showDetailView = isWidthUp(breakpoint, currentScreenWidth);


  const handleDetailViewFadeExited = () => {
    setDetailView(nextDetailView);
    setNextDetailView(null);
    setDetailViewReady(true);
  };


  const handleListViewSelectionChange = (newSelection) => {
    const selectedItem = newSelection.size ? pluck(newSelection) : null;
    setInspectedObject(selectedItem);
    
    if (showDetailView) {
      setDetailViewReady(false);
      if (selectedItem) {
        setNextDetailView((
          <DetailViewComponent
            location={location}
            representedObject={selectedItem}
            onClose={onDetailViewClose}
            {...detailViewProps}
          />
        ));
      } else {
        setNextDetailView(detailViewPlaceholder);
      }
    }

    if (onListViewSelectionChange) {
      onListViewSelectionChange(newSelection);
    }
  };


  // Do not render until the screen width has been determined
  if (!currentScreenWidth) {
    return null;
  }

  const listView = (
    <ListViewComponent
      listViewProps={{
        selectionInitializer: listViewSelectionInitializer,
        listItemSelectionControl: false,
        selectionMode: 'single',
        onSelectionChange: handleListViewSelectionChange,
        ...listViewProps,
      }}
      location={location}
    />
  );

  // Small screens will display a standard list view whereby the
  // list items navigate to a standalone detail page.
  if (!showDetailView) {
    return listView;
  }

  return (
    <div className={clsx(classes.masterDetailView, className)}>
      <div className={clsx(classes.listViewContainer, listViewContainerClassName)}>
        {listView}
      </div>

      <Fade 
        in={detailViewReady}
        onExited={handleDetailViewFadeExited}
      >
        <div className={classes.detailViewContainer} ref={detailViewContainerRef}>
          {detailView}
        </div>
      </Fade>
    </div>
  );
}

MasterDetailView.propTypes = {
  breakpoint: PropTypes.string.isRequired,
  className: PropTypes.string,
  DetailViewComponent: PropTypes.elementType.isRequired,
  detailViewPlaceholder: PropTypes.element,
  detailViewProps: PropTypes.object,
  listViewContainerClassName: PropTypes.string,
  ListViewComponent: PropTypes.elementType.isRequired,
  listViewProps: PropTypes.object,
  listViewSelectionInitializer: PropTypes.func,
  location: PropTypes.object.isRequired,
  onDetailViewClose: PropTypes.func,
  onListViewSelectionChange: PropTypes.func,
};

MasterDetailView.defaultProps = {
  breakpoint: 'md',
  detailViewProps: {},
  listViewProps: {},
};

export default MasterDetailView;
