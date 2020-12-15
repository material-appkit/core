import React from 'react';
import PropTypes from 'prop-types';
import { Link as GatsbyLink } from 'gatsby';

import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles((theme) => ({
  nav: {
    display: 'flex',
  },

  navLink: {
    marginLeft: theme.spacing(1),
    width: 48,
    height: 48,
  },

  image: {
    width: 32,
    height: 32,
  }
}));


function Navbar(props) {
  const classes = styles();

  return (
    <nav className={classes.nav}>
      {props.navLinkArrangement.map((linkInfo) => {
        const {
          href,
          Icon,
          image,
          onClick,
          path,
          title,
        } = linkInfo;

        const buttonProps = { key: title };

        if (path) {
          buttonProps.to = path;
          buttonProps.component = GatsbyLink;
        }
        if (href) {
          buttonProps.href = href;
        }
        if (onClick) {
          buttonProps.onClick = onClick;
        }


        let content = null;
        if (Icon) {
          content = <Icon />;
        }
        if (image) {
          content = (
            <img alt={title} className={classes.image} src={image} />
          );
        }

        return (
          <IconButton
            className={classes.navLink}
            {...buttonProps}
          >
            {content}
          </IconButton>
        );
      })}
    </nav>
  );
}

Navbar.propTypes = {
  navLinkArrangement: PropTypes.array.isRequired,
};

export default Navbar;
