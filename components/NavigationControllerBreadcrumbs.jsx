import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { useLocation } from 'react-router-dom';

import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import { makeStyles } from '@material-ui/core/styles';

import NavigationControllerBreadcrumb from './NavigationControllerBreadcrumb';
const styles = makeStyles((theme) => {
  const defaultNavigationControllerTheme = {
    navBarBreadcrumbsRoot: {
      flex: 1,
    },

    navBarBreadcrumbsList: {
      display: 'grid',
      gridAutoFlow: 'column',
      gridAutoColumns: 'minmax(20px, max-content)',
    },
  };

  if (theme.navigationController) {
    Object.assign(defaultNavigationControllerTheme, theme.navigationController);
  }

  return defaultNavigationControllerTheme;
});


function NavigationControllerBreadcrumbs(props) {
  const classes = styles();
  const location = useLocation();

  const {
    matches,
    topbarConfigMap,
    onContextMenuButtonClick,
    ...attributes
  } = props;

  return (
    <Breadcrumbs
      classes={{
        root: classes.navBarBreadcrumbsRoot,
        ol: classes.navBarBreadcrumbsList,
      }}
      role="tablist"
      {...attributes}
    >
      {matches.map((match, i) => (
        <NavigationControllerBreadcrumb
          key={match.path}
          last={i === matches.length - 1}
          location={location}
          match={match}
          onContextMenuButtonClick={onContextMenuButtonClick}
          topbarConfig={topbarConfigMap[match.path]}
        />
      ))}
    </Breadcrumbs>
  );
}

NavigationControllerBreadcrumbs.propTypes = {
  matches: PropTypes.array.isRequired,
  onContextMenuButtonClick: PropTypes.func.isRequired,
  topbarConfigMap: PropTypes.object.isRequired,
};


export default React.memo(NavigationControllerBreadcrumbs);