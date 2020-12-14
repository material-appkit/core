import React, { Fragment, useContext } from 'react';
import { Link as GatsbyLink } from 'gatsby';

import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { isWidthUp } from '@material-ui/core/withWidth';

import AppContext from 'AppContext';
import paths from 'paths';

const styles = makeStyles((theme) => ({
  footer: {
    alignItems: 'center',
    borderTop: `1px solid ${theme.palette.grey[400]}`,
    display: 'flex',
    padding: theme.spacing(2),

    [theme.breakpoints.up('md')]: {
      marginLeft: theme.navbar.width,
    },
  },

  copyright: {
    fontSize: theme.typography.pxToRem(14),
  },

  linkList: {
    display: 'flex',
  },

  linkSeparator: {
    display: 'inline-block',
    textAlign: 'center',
    width: 19,
  }
}));

function Footer(props) {
  const classes = styles();

  const context = useContext(AppContext);
  const isWidthMediumUp = isWidthUp('md', context.breakpoint);

  const footerLinkArrangement = [
    { label: 'Home', path: paths.index },
    { label: 'Privacy', path: '#' },
    { label: 'Terms', path: '#' },
  ];

  return (
    <Box component="footer" className={classes.footer}>
      <Box
        display="flex"
        flexDirection={isWidthMediumUp ? 'row' : 'column'}
      >
        <Typography className={classes.copyright}>
          © {new Date().getFullYear()} {process.env.GATSBY_APP_TITLE}
        </Typography>


        <div className={classes.linkList}>
          {footerLinkArrangement.map((linkInfo, i) => {
            const linkProps = {};

            if (linkInfo.path) {
              linkProps.component = GatsbyLink;
              linkProps.to = linkInfo.path;
            } else if (linkInfo.href) {
              linkProps.href = linkInfo.href;
              linkProps.target = '_blank';
              linkProps.rel = 'noopener';
            }

            return (
              <Fragment key={linkInfo.label}>
                {(isWidthMediumUp || i > 0) &&
                  <span className={classes.linkSeparator}>·</span>
                }
                <Link {...linkProps}>
                  {linkInfo.label}
                </Link>
              </Fragment>
            );
          })}
        </div>
      </Box>
    </Box>
  );
}

export default Footer;
