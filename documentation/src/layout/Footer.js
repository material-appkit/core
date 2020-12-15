import PropTypes from 'prop-types';
import React, { Fragment, useEffect, useState } from 'react';
import { Link as GatsbyLink } from 'gatsby';

import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import { TreeEnumerator } from 'util/tree';

import { pathnameForUrl } from 'util/shortcuts';


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

  const [navLinks, setNavLinks] = useState({
    previous: null,
    next: null,
  });

  useEffect(() => {
    const locationPathname = location.pathname;

    const links = {
      previous: null,
      next: null,
    };

    let previousPathname = null;
    let currentPathname = null;

    let currentNode = null;
    const treeEnumerator = new TreeEnumerator(sitemap);
    while (Boolean(currentNode = treeEnumerator.nextObject())) {
      if (!currentNode.url) {
        continue;
      }

      const pathname = pathnameForUrl(currentNode.url);
      if (currentPathname && currentPathname !== pathname) {
        previousPathname = currentPathname;
      }

      if (pathname === locationPathname) {
        if (previousPathname) {
          links.previous = (
            <Link component={GatsbyLink} to={previousPathname}>
              Previous
            </Link>
          );
        }

        // Search forward for the next link
        let nextNode = null;
        while (Boolean(nextNode = treeEnumerator.nextObject())) {
          const nextPathname = pathnameForUrl(nextNode.url);
          if (nextPathname !== pathname) {
            links.next = (
              <Link component={GatsbyLink} to={nextPathname}>
                Next
              </Link>
            );
            break;
          }
        }

        break;
      }

      currentPathname = pathname;
    }
    setNavLinks(links);
  }, [location, sitemap]);

  return (
    <footer className={classes.footer}>
      <div className={classes.content}>
        <Typography className={classes.copyright}>
          © {new Date().getFullYear()} {process.env.GATSBY_APP_TITLE}
        </Typography>


        <div className={classes.linkList}>
          <span>·</span>
          <Link component={GatsbyLink} to="/">Home</Link>

          {navLinks.previous &&
            <Fragment>
              <span>·</span>
              {navLinks.previous}
            </Fragment>
          }

          {navLinks.next &&
            <Fragment>
              <span>·</span>
              {navLinks.next}
            </Fragment>
          }
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
