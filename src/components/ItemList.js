/**
*
* ItemList
*
*/

import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import AlertManager from '../managers/AlertManager';
import ServiceAgent from '../util/ServiceAgent';
import { valueForKeyPath } from '../util/object';

import EditDialog from './EditDialog';
import ListDialog from './ListDialog';

function ItemListItem(props) {
  const { classes, item, onClick, onChange } = props;

  let component = null;
  if (props.component) {
    // If a component class was explicitly provided, use it
    component = <props.component item={props.item} onChange={onChange} />;
  } else {
    let ComponentClass = null;
    let componentProps = {
      onClick: () => { onClick(item) },
      onChange,
    };

    if (item.path) {
      ComponentClass = Link;
      componentProps.component = RouterLink;
      componentProps.to = item.path;
    } else if (item.media_url) {
      ComponentClass = Link;
      componentProps.href = item.media_url;
      componentProps.rel = 'noopener';
      componentProps.target = '_blank';
    } else {
      ComponentClass = Typography;
    }

    let linkTitle = null;
    if (typeof(props.titleKey) === 'function') {
      linkTitle = props.titleKey(item);
    } else {
      linkTitle = item[props.titleKey];
    }

    component = (
      <ListItemText
        classes={{ root: classes.itemText }}
        primary={(
          <ComponentClass {...componentProps}>
            {linkTitle}
          </ComponentClass>
        )}
      />
    );
  }

  return (
    <ListItem classes={{ root: classes.root }}>
      {(props.mode === 'view' && props.icon) &&
        <ListItemIcon classes={{ root: classes.listItemIconRoot }}>
          <props.icon className={classes.listItemIcon} />
        </ListItemIcon>
      }
      {(props.onRemove && props.mode === 'edit') &&
        <ListItemIcon
          aria-label="Delete"
          classes={{ root: classes.removeIconRoot }}
          onClick={() => { props.onRemove(item); }}
        >
          <DeleteIcon />
        </ListItemIcon>
      }
      {(props.mode === 'edit' && props.clickAction === 'edit') &&
        <ListItemIcon
          aria-label="Edit"
          classes={{ root: classes.removeIconRoot }}
          onClick={() => { onClick(item); }}
        >
          <EditIcon />
        </ListItemIcon>
      }

      {component}
    </ListItem>
  );
}

ItemListItem.propTypes = {
  classes: PropTypes.object.isRequired,
  clickAction: PropTypes.string,
  component: PropTypes.object,
  icon: PropTypes.object,
  item: PropTypes.object.isRequired,
  mode: PropTypes.oneOf(['view', 'edit']),
  onClick: PropTypes.func.isRequired,
  onRemove: PropTypes.func,
  titleKey: PropTypes.any,
};

const StyledItemListItem = withStyles((theme) => ({
  root: theme.itemList.item,
  itemButton: theme.itemList.itemButton,
  itemText: theme.itemList.itemText,

  removeIconRoot: {
    cursor: 'pointer',
    marginRight: 5,
  },

  listItemIconRoot: {
    marginRight: 5,
  },

  listItemIcon: {
    height: '18px !important',
    width: '18px !important',
  },
}))(ItemListItem);

// -----------------------------------------------------------------------------
class ItemList extends React.PureComponent {
  state = {
    editDialogOpen: false,
    editingObject: null,
    listDialogOpen: false,
  };

  get attachUrl() {
    const { apiAttachSuffix, representedObject } = this.props;
    if (apiAttachSuffix === undefined || apiAttachSuffix === null) {
      return null;
    }

    return representedObject.url + apiAttachSuffix;
  }

  get detachUrl() {
    const { apiDetachSuffix, representedObject } = this.props;
    if (apiDetachSuffix === undefined || apiDetachSuffix === null) {
      return null;
    }

    return representedObject.url + apiDetachSuffix;
  }

  get items() {
    const { items, itemKeyPath } = this.props;
    if (!itemKeyPath) {
      return items;
    }

    return items.map((item) => valueForKeyPath(item, itemKeyPath));
  }

  attachRecords = async(records) => {
    if (!records.length) {
      return;
    }

    const attachUrl = this.attachUrl;

    if (records.length === 1) {
      let record = records[0];

      const items = this.items;
      const recordIndex = items.findIndex((item) => {
        return item.id === record.id;
      });

      if (recordIndex !== -1) {
        items[recordIndex] = record;
        if (this.props.onUpdate) {
          this.props.onUpdate(record, recordIndex);
        }
      } else {
        if (attachUrl) {
          const res = await ServiceAgent.post(this.attachUrl, {item_id: record.id});
          record = res.body;
        }
        if (this.props.onAdd) {
          this.props.onAdd([record]);
        }
      }
    } else {
      if (this.props.onAdd) {
        this.props.onAdd(records);
      }
    }

    this.handleEditDialogClose();
  };


  removeRecord = async(record) => {
    const { canDelete, onRemove } = this.props;

    const detachUrl = this.detachUrl;
    if (detachUrl) {
      const res = await ServiceAgent.delete(this.detachUrl, { item_id: record.id });
      record = res.body;
    } else if (canDelete && record.url) {
      await ServiceAgent.delete(record.url);
    }

    if (onRemove) {
      onRemove(record);
    }
  };

  handleRemoveButtonClick = async(item) => {
    if (this.props.warnOnDelete) {
      AlertManager.confirm({
        title: `Please Confirm`,
        description: 'Are you sure you want to remove this item?',
        confirmButtonTitle: 'Remove',
        onDismiss: (flag) => {
          if (flag) {
            this.removeRecord(item);
          }
        },
      });
    } else {
      this.removeRecord(item);
    }
  };

  handleAddButtonClick = () => {
    if (this.props.apiListUrl) {
      this.setState({ listDialogOpen: true });
    } else {
      this.setState({ editDialogOpen: true, editingObject: null });
    }
  };

  handleListDialogDismiss = (selection) => {
    this.setState({ listDialogOpen: false });
    if (selection) {
      if (Array.isArray(selection)) {
        this.attachRecords(selection);
      } else {
        this.attachRecords([selection]);
      }

    }
  };

  handleItemClick = (item) => {
    if (this.props.mode === 'edit' && this.props.clickAction === 'edit') {
      this.setState({ editDialogOpen: true, editingObject: item });
    }

    if (this.props.onItemClick) {
      this.props.onItemClick(item);
    }
  };

  handleItemChange = (record) => {
    const items = this.items;
    const recordIndex = items.findIndex((item) => {
      return item.id === record.id;
    });

    if (recordIndex !== -1) {
      items[recordIndex] = record;
      if (this.props.onUpdate) {
        this.props.onUpdate(record, recordIndex);
      }
    }
  };

  handleEditDialogClose = () => {
    this.setState({ editDialogOpen: false });
  };

  render() {
    const { classes, clickAction, mode } = this.props;

    return (
      <Fragment>
        <List classes={{ root: classes.root }}>
          {this.items.map((item) => (
            <StyledItemListItem
              clickAction={clickAction}
              component={this.props.itemComponent}
              key={item.id}
              icon={this.props.itemIcon}
              item={item}
              itemKeyPath={this.props.itemKeyPath}
              mode={mode}
              onChange={this.handleItemChange}
              onClick={this.handleItemClick}
              onRemove={this.handleRemoveButtonClick}
              titleKey={this.props.titleKey}
            />
          ))}
        </List>

        {mode === 'edit' &&
          <Fragment>
            {this.props.onAdd &&
              <Button
                color="primary"
                className={classes.addButton}
                onClick={this.handleAddButtonClick}
              >
                <AddIcon className={classes.addButtonIcon} />
                Add {this.props.entityType}
              </Button>
            }

            {this.props.apiListUrl && this.state.listDialogOpen &&
              <ListDialog
                apiCreateUrl={this.props.apiCreateUrl}
                apiListUrl={this.props.apiListUrl}
                editDialogProps={this.props.editDialogProps}
                entityType={this.props.entityType}
                filterParams={this.props.filterParams}
                listItemComponent={this.props.listItemComponent}
                listItemProps={this.props.listItemProps}
                onDismiss={this.handleListDialogDismiss}
                searchFilterParam={this.props.searchFilterParam}
                {...this.props.listDialogProps}
              />
            }
          </Fragment>
        }

        {this.state.editDialogOpen &&
          <this.props.EditDialogComponent
            apiCreateUrl={this.props.apiCreateUrl}
            apiDetailUrl={this.state.editingObject ? this.state.editingObject.url : null}
            entityType={this.props.entityType}
            onClose={this.handleEditDialogClose}
            onSave={(record) => { this.attachRecords([record]) }}
            {...this.props.editDialogProps}
          />
        }
      </Fragment>
    );
  }
}

ItemList.propTypes = {
  apiCreateUrl: PropTypes.string,
  apiListUrl: PropTypes.string,
  apiAttachSuffix: PropTypes.string,
  apiDetachSuffix: PropTypes.string,
  canDelete: PropTypes.bool,
  classes: PropTypes.object,
  clickAction: PropTypes.oneOf(['link', 'edit']),
  EditDialogComponent: PropTypes.object,
  editDialogProps: PropTypes.object,
  entityType: PropTypes.string,
  filterParams: PropTypes.object,
  itemComponent: PropTypes.object,
  itemIcon: PropTypes.func,
  items: PropTypes.array.isRequired,
  itemKeyPath: PropTypes.string,
  listDialogProps: PropTypes.object,
  listItemComponent: PropTypes.object,
  listItemProps: PropTypes.object,
  onItemClick: PropTypes.func,
  onAdd: PropTypes.func,
  onRemove: PropTypes.func,
  onUpdate: PropTypes.func,
  mode: PropTypes.oneOf(['view', 'edit']),
  representedObject: PropTypes.object,
  searchFilterParam: PropTypes.string,
  titleKey: PropTypes.any,
  warnOnDelete: PropTypes.bool,
};

ItemList.defaultProps = {
  canDelete: false,
  clickAction: 'link',
  EditDialogComponent: EditDialog,
  editDialogProps: {},
  filterParams: {},
  listDialogProps: {},
  listItemProps: {},
  mode: 'view',
  warnOnDelete: true,
};

export default withStyles((theme) => ({
  root: theme.itemList.root,
  addButton: theme.itemList.addButton,
  addButtonIcon: theme.itemList.addButtonIcon,
}))(ItemList);
