import PropTypes from 'prop-types';
import React, { Fragment, useEffect, useState } from 'react';
import { Route, Link as RouterLink } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';


const styles = makeStyles((theme) => ({
  breadcrumbButton: {
    minWidth: 'initial',
    maxWidth: '100%',
    padding: theme.spacing(0.75, 0.5),
  },

  breadcrumbLabel: {
    display: 'block',
  },

  breadCrumbButtonEndIcon: {
    marginLeft: theme.spacing(0.5),
  },
}));

function NavigationControllerBreadcrumb(props) {
  const classes = styles();

  const {
    location,
    match,
    onContextMenuButtonClick,
    topbarConfig
  } = props;

  const [breadcrumbUrl, setBreadcrumbUrl] = useState(match.url);


  useEffect(() => {
    if (match.url === location.pathname) {
      let url = match.url;
      if (location.search) {
        url += location.search;
      }
      setBreadcrumbUrl(url);
    }
  }, [location, match]);

  let title = '';
  if (topbarConfig && topbarConfig.title) {
    title = topbarConfig.title;
  }

  const breadcrumbLabel = (
    <Typography noWrap variant="button" className={classes.breadcrumbLabel}>
      {title}
    </Typography>
  );


  if (!props.last) {
    if (!breadcrumbUrl) {
      return breadcrumbLabel;
    }

    return (
      <Link color="textPrimary" component={RouterLink} to={breadcrumbUrl}>
        {breadcrumbLabel}
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
        onClick={onContextMenuButtonClick}
      >
        {breadcrumbLabel}
      </Button>
    );
  }

  return breadcrumbLabel;
}

NavigationControllerBreadcrumb.propTypes = {
  last: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  onContextMenuButtonClick: PropTypes.func,
  topbarConfig: PropTypes.object,
};

export default React.memo(NavigationControllerBreadcrumb);
