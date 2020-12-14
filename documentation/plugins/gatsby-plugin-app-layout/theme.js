import { createMuiTheme } from '@material-ui/core/styles';
import AirbnbCerealBlack from './font/AirbnbCerealBook.woff';

const BOTTOM_BAR_HEIGHT = 56;
const APP_BAR_HEIGHT = 56;
const NAVBAR_WIDTH = 220;
const SIDEBAR_WIDTH = 260;
const FOOTER_HEIGHT = 56;

const baseTheme = createMuiTheme();

const cerealFontFace = {
  fontFamily: 'Cereal',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  src: `
    local('AirbnbCerealBlack'),
    url(${AirbnbCerealBlack}) format('woff')
  `,
};

const theme = createMuiTheme({
  //----------------------------------------------------------------------------
  palette: {
    background: {
      default: '#fff',
    },
    primary: {
      main: '#3C3B6E',
    },
    secondary: {
      main: '#B22234',
    },
  },

  mixins: {
    pageTitle: {
      fontSize: baseTheme.typography.pxToRem(28),
      marginBottom: baseTheme.spacing(3),
    },

    submitButton: {
      fontSize: baseTheme.typography.pxToRem(16),
      fontWeight: 600,
      padding: baseTheme.spacing(1.25, 1),
    },

    filterFieldLabel: {
      color: baseTheme.palette.text.secondary,
      fontSize: baseTheme.typography.pxToRem(12),
    },

    filterFieldValue: {
      fontSize: baseTheme.typography.pxToRem(12),
      marginRight: baseTheme.spacing(0.5),
      textAlign: 'right',
    },

    fullScreenDialog: {
      dialogTitle: {
        alignItems: 'center',
        display: 'flex',
        padding: baseTheme.spacing(1, 2),
      },

      heading: {
        flex: 1,
      },

      dialogContent: {
        padding: baseTheme.spacing(1, 2),
      },

      dialogActions: {
        display: 'flex',
        flexDirection: 'column',
        padding: baseTheme.spacing(1),

        [baseTheme.breakpoints.up('md')]: {
          flexDirection: 'row',
        }
      },

      actionButton: {
        flex: 1,
        fontSize: baseTheme.typography.pxToRem(20),
        height: baseTheme.spacing(7),
        margin: baseTheme.spacing(0.5, 0),

        [baseTheme.breakpoints.up('md')]: {
          margin: baseTheme.spacing(0, 0.5),
        }
      },

      commitButton: {
        [baseTheme.breakpoints.up('md')]: {
          order: 1,
        }
      },
    },
  },

  typography: {
    button: {
      textTransform: 'none',
    },

    fontFamily: 'Cereal, Roboto, Helvetica, Arial, sans-serif',

    h1: {
      fontSize: baseTheme.typography.pxToRem(40),
    },

    h2: {
      fontSize: baseTheme.typography.pxToRem(24),
    },

    h3: {
      fontSize: baseTheme.typography.pxToRem(20),
    },

    h4: {
      fontSize: baseTheme.typography.pxToRem(16),
    }
  },

  layout: {
    fixedHeightRootContainer: {
      [baseTheme.breakpoints.up('md')]: {
        height: '100vh',
      },
    },

    fixedHeightContentContainer: {
      padding: 0,
      height: 'calc(100% - 111px)',
    },
  },

  overrides: {
    MuiCssBaseline: {
      '@global': {
        '@font-face': [cerealFontFace],

        'html, body, #___gatsby, #gatsby-focus-wrapper': {
          [baseTheme.breakpoints.up('md')]: {
            height: '100vh',
          },
        },
      },
    },
  },

  //----------------------------------------------------------------------------
  // Application Theme
  appbar: {
    height: APP_BAR_HEIGHT,
  },

  bottomBar: {
    height: BOTTOM_BAR_HEIGHT,
  },

  navbar: {
    width: NAVBAR_WIDTH,
  },

  sidebar: {
    width: SIDEBAR_WIDTH,
  },

  footer: {
    height: FOOTER_HEIGHT,
  },


  // PROPERTY LIST
  propertyList: {
    root: {
      padding: 0,
    },

    listItem: {
      listItemRoot: {
        alignItems: 'baseline',
        display: 'flex',
        fontSize: baseTheme.typography.pxToRem(14),
        padding: '1px 0',
      },

      listItemIconRoot: {
        marginRight: 5,
        minWidth: 20,
      },

      listItemIcon: {
        height: 18,
        width: 18,
      },

      listItemTextRoot: {
        margin: 0,
        padding: 0,
      },

      label: {
        fontWeight: 500,
        marginRight: baseTheme.spacing(.5),
        "&:after": {
          content: '":"',
        },
      },

      inlineNestedList: {
        display: 'inline-flex',

        '& > *:not(:last-child)': {
          marginRight: baseTheme.spacing(.5),
          '&:after': {
            content: '","',
          },
        },
      },

      nestedListItem: {
        padding: 0,
        width: 'initial',
      }
    },
  },
});

export default theme;
