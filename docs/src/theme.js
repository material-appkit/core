import { createMuiTheme } from '@material-ui/core/styles';

const TOP_BAR_HEIGHT = 64;
const NAVBAR_HEIGHT = 56;
const TOOLBAR_HEIGHT = 48;
const SIDEBAR_WIDTH = 260;

const baseTheme = createMuiTheme();

const theme = createMuiTheme({
  overrides: {
    MuiCssBaseline: {
      '@global': {
        html: {
          width: '100%',
          height: '100%',
        },
        body: {
          height: '100%',
          width: '100%',

          '& > #root': {
            height: '100%',
          },

          "-webkitOverflowScrolling": 'touch',
        },

        // Google Places Autocomplete
        // https://developers.google.com/maps/documentation/javascript/places-autocomplete#style-autocomplete
        '.pac-container': {
          zIndex: baseTheme.zIndex.modal + 1,
        },
      },
    },

    MuiFormControl: {
      marginNormal: {
        marginTop: baseTheme.spacing(1),
      },
    },
  },


  //----------------------------------------------------------------------------
  // Material-UI Theme
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
    text: {
      disabled: 'rgba(0, 0, 0, 0.55)',
    },
  },

  mixins: {
    layout: {
      split: {
        display: 'grid',
        gridAutoFlow: 'column',
        gridTemplateColumns: '1fr 1fr',
        gridGap: 16,
      },

      splitStack: {
        display: 'grid',
        gridAutoFlow: 'row',
        gridTemplateColumns: '1fr',
        gridGap: 16,

        [baseTheme.breakpoints.up('md')]: {
          gridAutoFlow: 'column',
          gridTemplateColumns: '1fr 1fr',
        },
      },
    },

    status: {
      successBgColor: {
        backgroundColor: baseTheme.palette.success.main,
      },
      infoBgColor: {
        backgroundColor: baseTheme.palette.info.main,
      },
      warningBgColor: {
        backgroundColor: baseTheme.palette.warning.main,
      },
      errorBgColor: {
        backgroundColor: baseTheme.palette.error.main,
      },
      cancelledBgColor: {
        backgroundColor: baseTheme.palette.common.black,
      },
      successColor: {
        color: baseTheme.palette.success.main,
      },
      infoColor: {
        color: baseTheme.palette.info.main,
      },
      warningColor: {
        color: baseTheme.palette.warning.main,
      },
      errorColor: {
        color: baseTheme.palette.error.main,
      },
      cancelledColor: {
        color: baseTheme.palette.common.black,
      },
    },

    buttons: {
      deleteButton: {
        color: baseTheme.palette.error.main,
      },

      linkButton: {
        minWidth: 'initial',
        padding: 0,
        '&:hover': {
          backgroundColor: 'initial',
        },
      },
    },


    fullScreenDialog: {
      dialogTitle: {
        alignItems: 'center',
        display: 'flex',
        padding: baseTheme.spacing(1, 2),
        position: 'relative',
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
        },
      },

      commitButton: {
        [baseTheme.breakpoints.up('md')]: {
          order: 1,
        },
      },
    },

    toolbar: {
      [baseTheme.breakpoints.down('md')]: {
        minHeight: NAVBAR_HEIGHT,
      },
    },

    pageTitle: {
      fontSize: baseTheme.typography.pxToRem(24),
      marginBottom: baseTheme.spacing(2),
    },

    metadataGrid: {
      borderBottom: `1px solid ${baseTheme.palette.grey[400]}`,
      borderTop: `1px solid ${baseTheme.palette.grey[400]}`,
      paddingBottom: baseTheme.spacing(2),
      paddingTop: baseTheme.spacing(2),
      marginBottom: baseTheme.spacing(3),
      marginTop: baseTheme.spacing(2),

      '& > div:first-child': {
        [baseTheme.breakpoints.down('sm')]: {
          paddingBottom: baseTheme.spacing(2),
        },

        [baseTheme.breakpoints.up('md')]: {
          paddingRight: baseTheme.spacing(1),
        },
      },

      '& > div:not(:first-child)': {
        [baseTheme.breakpoints.down('sm')]: {
          borderTop: `1px solid ${baseTheme.palette.grey[400]}`,
          paddingTop: baseTheme.spacing(2),
        },

        [baseTheme.breakpoints.up('md')]: {
          borderLeft: `1px solid ${baseTheme.palette.grey[400]}`,
          paddingLeft: baseTheme.spacing(2),
        },
      },
    },
  },

  typography: {
    button: {
      textTransform: 'none',
    },

    h1: {
      fontSize: baseTheme.typography.pxToRem(48),
    },

    h2: {
      fontSize: baseTheme.typography.pxToRem(24),
      fontWeight: 400,
    },

    h3: {
      fontSize: baseTheme.typography.pxToRem(20),
      fontWeight: 400,
    },

    h4: {
      fontSize: baseTheme.typography.pxToRem(18),
    },

    h5: {
      fontSize: baseTheme.typography.pxToRem(16),
      fontWeight: 500,
    },

    h6: {
      fontSize: baseTheme.typography.pxToRem(14),
    },
  },

  //----------------------------------------------------------------------------
  // Application Theme
  topbar: {
    height: TOP_BAR_HEIGHT,
  },

  sidebar: {
    width: SIDEBAR_WIDTH,
  },

  scrollView: {
    height: '100%',
    overflow: 'auto',
    width: '100%',
  },

  sizes: {
    navigationController: {
      navbarHeight: NAVBAR_HEIGHT,
      toolbarHeight: TOOLBAR_HEIGHT,
    },
  },


  // LIST DIALOG
  listDialog: {
    filterField: {
      backgroundColor: '#FFF',
      borderRadius: 4,
      padding: '0 16px',
      marginBottom: 16,
    },

    paper: {
      minWidth: 320,
      width: 480,
    },

    progressBar: {
      height: 2,
    },
  },

  // LIST VIEW
  listView: {
    list: {
      padding: 0,
      width: '100%',
      height: '100%',
      overflow: 'auto',
    },
    subheader: {
      backgroundColor: '#e7e7e7',
    },
  },


  // PROPERTY LIST
  propertyList: {
    root: {
      padding: 0,
    },

    listItem: {
      listItemRoot: {
        display: 'flex',
        fontSize: baseTheme.typography.pxToRem(14),
        padding: baseTheme.spacing(0.25, 0),
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
        marginRight: baseTheme.spacing(0.5),
        "&:after": {
          content: '":"',
        },
      },

      inlineNestedList: {
        display: 'inline-flex',

        '& > *:not(:last-child)': {
          marginRight: baseTheme.spacing(0.5),
          '&:after': {
            content: '","',
          },
        },
      },

      nestedListItem: {
        padding: 0,
        width: 'initial',
      },
    },
  },

  // PROPERTY TABLE
  propertyTable: {
    cell: {
      fontSize: baseTheme.typography.pxToRem(13),
      padding: `${baseTheme.spacing(0.5)}px ${baseTheme.spacing(1)}px`,
    },

    table: {
      tableLayout: 'fixed',
    },

    labelCell: {
      fontWeight: 500,
      width: 150,

      [baseTheme.breakpoints.up('md')]: {
        width: 300,
      },
    },

    rowInteractive: {
      cursor: 'pointer',
    },

    rowOdd: {
      backgroundColor: baseTheme.palette.grey[100],
    },

    selectionCell: {
      width: 40,
    },
  },
});

export default theme;
