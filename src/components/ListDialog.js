/**
*
* ListDialog
*
*/

import React from 'react';
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
import VirtualizedList from './VirtualizedList';

import RemoteStore from '../stores/RemoteStore';
import { ServiceAgent } from '../util';


const DialogTitle = withStyles((theme) => ({
  root: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: 0,
  },

  headingContainer: {
    padding: theme.spacing.unit * 2,
  },

  closeButton: {
    position: 'absolute',
    right: theme.spacing.unit,
    top: theme.spacing.unit,
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

    this.store = new RemoteStore({ endpoint: this.props.apiListUrl });
    this.store.load(this.props.filterParams);

    this.state = {
      loading: false,
      selection: null,
      addDialogIsOpen: false,
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

  handleSearchFilterChange = (filterTerm) => {
    const filterParams = { ...this.props.filterParams };
    if (filterTerm) {
      filterParams[this.props.searchFilterParam] = filterTerm;
    }

    this.store.update(filterParams);
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
      ...listItemProps
    };

    return (
      <React.Fragment>
        <Dialog
          classes={{ paper: classes.paper }}
          onClose={() => { this.dismiss(null); }}
          open
        >
          <DialogTitle
            onClose={() => { this.dismiss(); }}
            text={`Select a ${this.props.entityType}`}
          >
            {this.props.searchFilterParam &&
              <TextField
                className={classes.filterField}
                fullWidth
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
              <VirtualizedList
                componentForItem={this.props.listItemComponent}
                fullWidth
                getScrollParent={() => this.dialogContentRef.current}
                itemProps={itemProps}
                itemContextProvider={this.listItemContextProvider}
                onSelectionChange={(selection) => { this.setState({ selection }); }}
                selectionMode={this.props.selectionMode}
                store={this.store}
                useWindow={false}
              />
            </DialogContent>
          </RootRef>
          <DialogActions>
            {this.props.apiCreateUrl &&
              <React.Fragment>
                <Button onClick={() => { this.setState({ addDialogIsOpen: true }); }}>
                  Create
                </Button>
                <Spacer />
              </React.Fragment>
            }
            <Button
              disabled={!this.hasSelection}
              onClick={() => { this.dismiss(this.state.selection); }}
              color="primary"
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
      </React.Fragment>
    );
  }
}

ListDialog.propTypes = {
  apiCreateUrl: PropTypes.string,
  apiListUrl: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  editDialogProps: PropTypes.object,
  entityType: PropTypes.string.isRequired,
  filterParams: PropTypes.object,
  searchFilterParam: PropTypes.string,
  selectionMode: PropTypes.oneOf(['single', 'multiple']),
  listItemComponent: PropTypes.func.isRequired,
  listItemProps: PropTypes.object,
  onDismiss: PropTypes.func.isRequired,
};

ListDialog.defaultProps = {
  editDialogProps: {},
  filterParams: {},
  listItemProps: {},
  selectionMode: 'single',
};

export default withStyles((theme) => ({
  filterField: theme.listDialog.filterField,
  paper: theme.listDialog.paper,
  progressBar: theme.listDialog.progressBar,
}))(ListDialog);
