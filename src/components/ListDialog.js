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
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import CloseIcon from '@material-ui/icons/Close';

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
    width: 300,
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    borderTop: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: '8px 4px 8px 12px',
  },
}))(MuiDialogActions);


class ListDialog extends React.Component {
  constructor(props) {
    super(props);

    this.store = new RemoteStore({
      endpoint: this.props.endpoint,
      ServiceAgent: props.ServiceAgent,
    });
    this.store.load({});

    this.state = {
      filterTerm: '',
      loading: false,
      selection: null,
    };

    this.filterUpdateTimer = null;
    this.dialogContentRef = React.createRef();
  }

  dismiss = (value) => {
    this.props.onDismiss(value);
  };

  updateFilterTerm = (filterTerm) => {
    const self = this;

    self.setState({ filterTerm });

    if (self.filterUpdateTimer) {
      clearTimeout(self.filterUpdateTimer);
    }

    self.filterUpdateTimer = setTimeout(() => {
      const filterParams = {};
      if (filterTerm) {
        const filterBy = self.props.filterBy;
        if (typeof(filterBy) === 'string') {
          filterParams[filterBy] = filterTerm;
        } else {
          filterBy.forEach((paramName) => {
            filterParams[paramName] = filterTerm;
          });
        }
      }

      self.store.update(filterParams);
    }, 500);
  };

  handleSelectionChange = (selection) => {
    this.setState({ selection });
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
          open
          onClose={() => { this.dismiss(null); }}
          PaperProps={{ id: 'listdialog-paper' }}
        >
          <DialogTitle
            onClose={() => { this.dismiss(); }}
            text={`Select a ${this.props.entityType}`}
          >
            {this.props.filterBy &&
              <TextField
                className={classes.filterField}
                fullWidth
                onChange={(e) => { this.updateFilterTerm(e.target.value); }}
                placeholder="Filter by search term..."
                variant="outlined"
                value={this.state.filterTerm}
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
                getScrollParent={() => this.dialogContentRef.current}
                itemProps={itemProps}
                itemContextProvider={this.listItemContextProvider}
                onSelectionChange={this.handleSelectionChange}
                selectionMode="single"
                store={this.store}
                useWindow={false}
              />
            </DialogContent>
          </RootRef>
          <DialogActions>
            <Button
              disabled={!this.state.selection}
              onClick={() => { this.dismiss(this.state.selection); }}
              color="primary"
            >
              Choose
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
}

ListDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  endpoint: PropTypes.string.isRequired,
  entityType: PropTypes.string.isRequired,
  filterBy: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
  ]),
  listItemComponent: PropTypes.func.isRequired,
  listItemProps: PropTypes.object,
  onDismiss: PropTypes.func.isRequired,
  ServiceAgent: PropTypes.func,
};

ListDialog.defaultProps = {
  listItemProps: {},
  ServiceAgent: ServiceAgent,
};

export default withStyles({
  filterField: {
    backgroundColor: '#FFF',
    borderRadius: 4,
    height: 38,
    padding: '0 16px',
    marginBottom: 16,
  },

  progressBar: {
    height: 2,
  },
})(ListDialog);
