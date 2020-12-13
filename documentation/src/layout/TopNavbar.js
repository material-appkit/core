import React from 'react';
import PropTypes from 'prop-types';
import { Link as GatsbyLink } from 'gatsby';

import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles((theme) => ({
  nav: {
    display: 'flex',
  },

  navLink: {
    marginLeft: theme.spacing(1),
  },
}));


function Navbar(props) {
  const classes = styles();

  return (
    <nav className={classes.nav}>
      {props.navLinkArrangement.map((linkInfo) => {
        const {
          href,
          Icon,
          onClick,
          path,
          title,
        } = linkInfo;

        const buttonProps = {};

        if (path) {
          buttonProps.to = path;
          buttonProps.component = GatsbyLink;
        }
        if (href) {
          buttonProps.href = href;
          buttonProps.target = '_blank';
          buttonProps.rel = 'noopener';
        }
        if (onClick) {
          buttonProps.onClick = onClick;
        }

        return (
          <Tooltip key={title} title={title}>
            <IconButton
              className={classes.navLink}
              {...buttonProps}
            >
              <Icon />
            </IconButton>
          </Tooltip>
        );
      })}
    </nav>
  );
}

Navbar.propTypes = {
  navLinkArrangement: PropTypes.array.isRequired,
};

export default Navbar;
