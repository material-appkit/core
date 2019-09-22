/**
*
* ListDialog
*
*/

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import LinearProgress from '@material-ui/core/LinearProgress';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import RootRef from '@material-ui/core/RootRef';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import CloseIcon from '@material-ui/icons/Close';

import EditDialog from './EditDialog';
import Spacer from './Spacer';
import TextField from './TextField';
import PagedListView from './PagedListView';

const DialogTitle = withStyles((theme) => ({
  root: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: 0,
  },

  headingContainer: {
    padding: theme.spacing(2),
  },

  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}))((props) => {
  const { classes } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <div className={classes.headingContainer}>
        <Typography variant="h6">{props.text}</Typography>
        {props.onClose &&
          <IconButton
            aria-label="Close"
            className={classes.closeButton}
            onClick={props.onClose}
          >
            <CloseIcon />
          </IconButton>
        }
      </div>
      {props.children}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: 0,
    height: 300,
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    borderTop: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: '8px 4px 8px 12px',
  },
}))(MuiDialogActions);


class ListDialog extends React.PureComponent {
  constructor(props) {
    super(props);

    this.dialogContentRef = React.createRef();

    this.state = {
      loading: false,
      selection: null,
      addDialogIsOpen: false,
      filterParams: {...props.filterParams},
      listViewInfo: {},
    };
  }

  get hasSelection() {
    if (Array.isArray(this.state.selection)) {
      return this.state.selection.length ? true : false;
    }
    return this.state.selection;
  }

  dismiss = (value) => {
    this.props.onDismiss(value);
  };

  handleKeyPress = (e) => {
    const { selection } = this.state;
    if (e.key === 'Enter' && selection) {
      this.dismiss(selection);
    }
  };

  handleSearchFilterChange = (filterTerm) => {
    const filterParams = { ...this.props.filterParams };
    if (filterTerm) {
      filterParams[this.props.searchFilterParam] = filterTerm;
    }
    this.setState({ filterParams });
  };

  handleEditDialogClose = () => {
    this.setState({ addDialogIsOpen: false });
  };

  handleEditDialogSave = (record) => {
    this.dismiss(record);
  };

  render() {
    const { classes, listItemProps } = this.props;

    const itemProps = {
      isLink: false,
      style: { padding: '3px 6px' },
      className: classes.listItem,
      ...listItemProps
    };

    return (
      <Fragment>
        <Dialog
          classes={{ paper: classes.paper }}
          onClose={() => { this.dismiss(null); }}
          onKeyPress={this.handleKeyPress}
          open
        >
          <DialogTitle
            onClose={() => { this.dismiss(); }}
            text={`Select a ${this.props.entityType}`}
          >
            {this.props.searchFilterParam &&
              <TextField
                autoFocus
                className={classes.filterField}
                fullWidth
                margin="dense"
                onTimeout={this.handleSearchFilterChange}
                timeoutDelay={500}
                placeholder="Filter by search term..."
                variant="outlined"
              />
            }
            <LinearProgress
              className={classes.progressBar}
              variant={this.state.loading ? 'indeterminate' : 'determinate' }
              value={0}
            />
          </DialogTitle>
          <RootRef rootRef={this.dialogContentRef}>
            <DialogContent className={classes.dialogContent}>
              <PagedListView
                displayMode="list"
                defaultFilterParams={this.state.filterParams}
                itemContextProvider={this.listItemContextProvider}
                itemIdKey={this.props.itemIdKey}
                listItemRenderer={this.props.listItemComponent}
                listItemProps={this.props.listItemProps}
                onConfig={(config) => { this.setState({ listViewInfo: config }); }}
                onLoad={() => { this.setState({loading: true }); }}
                onComplete={() => { this.setState({loading: false }); }}
                onSelectionChange={(selection) => { this.setState({ selection }); }}
                pageSize={this.props.pageSize}
                selectionAlways
                selectionMode={this.props.selectionMode}
                selectOnClick
                src={this.props.src}
              />
            </DialogContent>
          </RootRef>
          <DialogActions>
            {this.props.apiCreateUrl &&
              <Fragment>
                <Button onClick={() => { this.setState({ addDialogIsOpen: true }); }}>
                  Create
                </Button>
                <Spacer />
              </Fragment>
            }
            {this.state.listViewInfo.toolbarItems}
            <Button
              color="primary"
              disabled={!this.hasSelection}
              onClick={() => { this.dismiss(this.state.selection); }}
            >
              Choose
            </Button>
          </DialogActions>
        </Dialog>

        {this.state.addDialogIsOpen &&
          <EditDialog
            apiCreateUrl={this.props.apiCreateUrl}
            entityType={this.props.entityType}
            onClose={this.handleEditDialogClose}
            onSave={this.handleEditDialogSave}
            {...this.props.editDialogProps}
          />
        }
      </Fragment>
    );
  }
}

ListDialog.propTypes = {
  apiCreateUrl: PropTypes.string,
  apiListUrl: PropTypes.string,
  classes: PropTypes.object.isRequired,
  editDialogProps: PropTypes.object,
  entityType: PropTypes.string.isRequired,
  filterParams: PropTypes.object,
  itemIdKey: PropTypes.string,
  listItemComponent: PropTypes.func.isRequired,
  listItemProps: PropTypes.object,
  onDismiss: PropTypes.func.isRequired,
  pageSize: PropTypes.number,
  searchFilterParam: PropTypes.string,
  selectionMode: PropTypes.oneOf(['single', 'multiple']),
  src: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
};

ListDialog.defaultProps = {
  editDialogProps: {},
  filterParams: {},
  listItemProps: {},
  pageSize: 50,
  selectionMode: 'single',
};

export default withStyles((theme) => ({
  listItem: {
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.08)',
      cursor: 'pointer',
    }
  },

  filterField: theme.listDialog.filterField,
  paper: theme.listDialog.paper,
  progressBar: theme.listDialog.progressBar,
}))(ListDialog);
