import PropTypes from 'prop-types';
import React, { Fragment, Component } from 'react';
import { Route, Link as RouterLink } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const styles = makeStyles((theme) => {
  const defaultNavigationControllerTheme = {
    breadcrumbButton: {
      minWidth: 'initial',
      maxWidth: '100%',
      padding: '6px 4px',
    },

    breadCrumbButtonEndIcon: {
      marginLeft: theme.spacing(0.5),
    },
  };

  if (theme.navigationController) {
    Object.assign(defaultNavigationControllerTheme, theme.navigationController);
  }

  return defaultNavigationControllerTheme;
});

function NavigationControllerBreadcrumbs(props) {
  const {
    matches,
    topbarConfigMap,
    onContextMenuButtonClick,
    ...attributes
  } = props;
  

  const classes = styles();

  return (
    <Breadcrumbs {...attributes} role="tablist">
      {matches.map((match, i) => {
        const key = match.path;

        let title = '';
        const topbarConfig = topbarConfigMap[match.path];
        if (topbarConfig && topbarConfig.title) {
          title = topbarConfig.title;
        }

        let breadcrumb = null;

        const breadcrumbLabel = (
          <Typography noWrap variant="button">
            {title}
          </Typography>
        );

        if (i < matches.length - 1) {
          return (
            <Link color="textPrimary" component={RouterLink} to={match.url} key={key}>
              <Typography noWrap>
                {breadcrumbLabel}
              </Typography>
            </Link>
          );
        }


        if (topbarConfig && topbarConfig.contextMenuItems && topbarConfig.contextMenuItems.length) {
          return (
            <Button
              aria-controls="context-menu"
              aria-haspopup="true"
              classes={{
                root: classes.breadcrumbButton,
                endIcon: classes.breadCrumbButtonEndIcon,
              }}
              endIcon={<ExpandMoreIcon />}
              key={key}
              onClick={onContextMenuButtonClick}
            >
              <Typography noWrap>{breadcrumbLabel}</Typography>
            </Button>
          );
        }

        return (
          <Typography key={key} noWrap>{breadcrumbLabel}</Typography>
        );
      })}
    </Breadcrumbs>
  );
}

NavigationControllerBreadcrumbs.propTypes = {
  matches: PropTypes.array.isRequired,
  onContextMenuButtonClick: PropTypes.func.isRequired,
  topbarConfigMap: PropTypes.object.isRequired,
};


export default NavigationControllerBreadcrumbs;