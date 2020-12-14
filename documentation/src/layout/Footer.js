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
    margin: 0,
    padding: 0,
  },

  linkListItem: {
    marginLeft: 5,
    '&::before': {
      content: '"·"',
      marginRight: 5,
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

  const footerLinkArrangement = [
    { label: 'Home', path: paths.index },
    { label: 'Privacy', path: '#' },
    { label: 'Terms', path: '#' },
  ];

  return (
    <footer className={classes.footer}>
      <div className={classes.content}>
        <Typography className={classes.copyright}>
          © {new Date().getFullYear()} {process.env.GATSBY_APP_TITLE}
        </Typography>


        <ul className={classes.linkList}>
          {footerLinkArrangement.map((linkInfo, i) => {
            const linkProps = {
              className: classes.linkListItem,
              key: linkInfo.label
            };

            if (linkInfo.path) {
              linkProps.component = GatsbyLink;
              linkProps.to = linkInfo.path;
            } else if (linkInfo.href) {
              linkProps.href = linkInfo.href;
              linkProps.target = '_blank';
              linkProps.rel = 'noopener';
            }

            return (
              <Link component="li" {...linkProps}>
                {linkInfo.label}
              </Link>
            );
          })}
        </ul>
      </div>
    </footer>
  );
}

export default Footer;
