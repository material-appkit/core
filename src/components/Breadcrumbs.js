import PropTypes from 'prop-types';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

import Link from '@material-ui/core/Link';
import MuiBreadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import ContextMenuButton from "./ContextMenuButton";

const styles = makeStyles((theme) => {
  const breadcrumbsStyles = {
    root: {
      flex: 1,
    },

    list: {
      display: 'grid',
      gridAutoFlow: 'column',
      gridAutoColumns: 'minmax(20px, max-content)',
    },

    label: {
      fontSize: theme.typography.pxToRem(14),
      fontWeight: 500,
      display: 'block',
    },

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
  };

  if (theme.navigationController) {
    Object.assign(breadcrumbsStyles, theme.navigationController);
  }

  return breadcrumbsStyles;
});


// -----------------------------------------------------------------------------
function Breadcrumb({ classes, breadcrumbInfo }) {
  let info = breadcrumbInfo;
  if (typeof(info) === 'string') {
    info = { label: info };
  }

  const { label, menuItemArrangement, path } = info;

  if (menuItemArrangement && menuItemArrangement.length) {
    return (
      <ContextMenuButton
        buttonProps={{
          classes: {
            root: classes.breadcrumbButton,
            endIcon: classes.breadCrumbButtonEndIcon,
          }
        }}
        contextMenuProps={{
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
          transformOrigin: {
            vertical: 'top',
            horizontal: 'center',
          }
        }}
        label={label}
        menuItemArrangement={menuItemArrangement}
      />
    );
  }

  let control = (
    <Typography noWrap variant="button" className={classes.label}>
      {label}
    </Typography>
  );

  if (path) {
    control = (
      <Link color="textPrimary" component={RouterLink} to={path}>
        {control}
      </Link>
    );
  }

  return control;
}


function Breadcrumbs(props) {
  const classes = styles();

  const { arrangement, ...breadcrumbsProps } = props;

  return (
    <MuiBreadcrumbs
      classes={{
        root: classes.root,
        ol: classes.list,
      }}
      role="tablist"
      {...breadcrumbsProps}
    >
      {arrangement.map((breadcrumbInfo, index) => (
        <Breadcrumb key={index} classes={classes} breadcrumbInfo={breadcrumbInfo} />
      ))}

    </MuiBreadcrumbs>
  );
}

Breadcrumbs.propTypes = {
  arrangement: PropTypes.array.isRequired,
}

Breadcrumbs.defaultProps = {
  separator: "›",
};

export default Breadcrumbs;
