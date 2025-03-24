import clsx from 'clsx';

import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';

import { CSSTransition } from 'react-transition-group';

import Fade from '@material-ui/core/Fade';
import { makeStyles } from '@material-ui/core/styles';

import { pluck } from '../util/set';

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
}));


function MasterDetailView(props) {
  const classes = styles();

  const {
    className,
    detailViewPlaceholder,
    DetailViewComponent,
    detailViewProps,
    ListViewComponent,
    listViewContainerClassName,
    listViewProps,
    listViewSelectionInitializer,
    onDetailViewClose,
    onListViewSelectionChange,
    showDetailView,
  } = props;


  const [detailView, setDetailView] = useState(null);
  const [nextDetailView, setNextDetailView] = useState(null);
  const [detailViewReady, setDetailViewReady] = useState(true);

  const detailViewContainerRef = useRef(null);

  const handleDetailViewFadeExited = () => {
    setDetailView(nextDetailView);
    setNextDetailView(null);
    setDetailViewReady(true);
  };


  const handleListViewSelectionChange = (newSelection) => {
    const selectedItem = newSelection.size ? pluck(newSelection) : null;

    if (showDetailView) {
      setDetailViewReady(false);
      if (selectedItem) {
        setNextDetailView((
          <DetailViewComponent
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
  if (showDetailView === undefined) {
    return null;
  }

  const listView = (
    <ListViewComponent
      onSelectionChange={handleListViewSelectionChange}
      selectionMode="single"
      selectionInitializer={listViewSelectionInitializer}
      {...listViewProps}
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
  className: PropTypes.string,
  DetailViewComponent: PropTypes.elementType.isRequired,
  detailViewPlaceholder: PropTypes.element,
  detailViewProps: PropTypes.object,
  listViewContainerClassName: PropTypes.string,
  ListViewComponent: PropTypes.elementType.isRequired,
  listViewProps: PropTypes.object,
  listViewSelectionInitializer: PropTypes.func,
  onDetailViewClose: PropTypes.func,
  onListViewSelectionChange: PropTypes.func,
  showDetailView: PropTypes.bool.isRequired,
};

MasterDetailView.defaultProps = {
  detailViewProps: {},
  listViewProps: {},
};

export default React.memo(MasterDetailView);
