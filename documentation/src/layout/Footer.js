import PropTypes from 'prop-types';
import React from 'react';
import { Link as GatsbyLink } from 'gatsby';

import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import paths from 'paths';

const styles = makeStyles((theme) => ({
  footer: {
    alignItems: 'center',
    borderTop: `1px solid ${theme.palette.grey[400]}`,
    display: 'flex',
    padding: theme.spacing(2),
  },

  content: {
    display: 'flex',
  },

  copyright: {
    fontSize: theme.typography.pxToRem(14),
  },

  linkList: {
    display: 'flex',

    '& > span': {
      margin: '0 5px',
    }
  },

  linkSeparator: {
    display: 'inline-block',
    textAlign: 'center',
    width: 19,
  }
}));

function Footer(props) {
  const classes = styles();
  const { location, sitemap } = props;
  console.log(location, sitemap);

  return (
    <footer className={classes.footer}>
      <div className={classes.content}>
        <Typography className={classes.copyright}>
          © {new Date().getFullYear()} {process.env.GATSBY_APP_TITLE}
        </Typography>


        <div className={classes.linkList}>
          <span>·</span>
          <Link component={GatsbyLink} to={paths.index}>Home</Link>
          <span>·</span>
          <Link component={GatsbyLink} to="#">Previous</Link>
          <span>·</span>
          <Link component={GatsbyLink} to="#">Next</Link>
        </div>
      </div>
    </footer>
  );
}

Footer.propTypes = {
  location: PropTypes.object.isRequired,
  sitemap: PropTypes.object.isRequired,
};

export default React.memo(Footer);
