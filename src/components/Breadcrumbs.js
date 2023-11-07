import PropTypes from 'prop-types';
import React from 'react';

import MuiBreadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';


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
    }
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

  return (
    <Typography className={classes.label}>
      {info.label}
    </Typography>
  )
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
