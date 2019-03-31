/**
*
* ItemList
*
*/

import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

import EditDialog from './EditDialog';
import ListDialog from './ListDialog';
import ServiceAgent from '../util/ServiceAgent';

import { valueForKeyPath } from '../util/object';

function ItemListItem(props) {
  const { classes, item, onClick, onChange } = props;

  let component = null;

  if (props.component) {
    // If a component class was explicitly provided, use it
    return <props.component item={props.item} onChange={onChange} />
  }

  let ComponentClass = null;
  let componentProps = {
    onClick: () => { onClick(item) },
    onChange,
  };

  if (props.mode === 'edit' && props.clickAction === 'edit') {
    ComponentClass = Button;
    componentProps.className = classes.itemButton;
    componentProps.color = 'primary';
  } else {
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
  }

  let linkTitle = null;
  if (typeof(props.titleKey) === 'function') {
    linkTitle = props.titleKey(item);
  } else {
    linkTitle = item[props.titleKey];
  }

  component = (
    <ComponentClass {...componentProps}>
      {linkTitle}
    </ComponentClass>
  );

  return (
    <ListItem classes={{ root: classes.root }}>
      {(props.onRemove && props.mode === 'edit') &&
        <ListItemIcon
          aria-label="Delete"
          className={classes.removeButton}
          onClick={() => { props.onRemove(item); }}
        >
          <DeleteIcon className={classes.removeButtonIcon} />
        </ListItemIcon>
      }
      <ListItemText classes={{ root: classes.itemText }} primary={component} />
    </ListItem>
  );
}

ItemListItem.propTypes = {
  classes: PropTypes.object.isRequired,
  clickAction: PropTypes.string,
  component: PropTypes.func,
  item: PropTypes.object.isRequired,
  mode: PropTypes.oneOf(['view', 'edit']),
  onClick: PropTypes.func.isRequired,
  onRemove: PropTypes.func,
  titleKey: PropTypes.any,
};

const StyledItemListItem = withStyles((theme) => ({
  root: theme.itemList.item,
  removeButton: theme.itemList.removeButton,
  removeButtonIcon: theme.itemList.removeButtonIcon,
  itemButton: theme.itemList.itemButton,
  itemText: theme.itemList.itemText,
}))(ItemListItem);

// -----------------------------------------------------------------------------
class ItemList extends React.PureComponent {
  state = {
    editDialogOpen: false,
    editingObject: null,
    listDialogOpen: false,
  };

  get attachUrl() {
    if (!this.props.apiAttachSuffix) {
      return null;
    }

    const baseUrl = this.props.representedObject.url;
    return `${baseUrl}${this.props.apiAttachSuffix}`;
  }

  get detachUrl() {
    if (!this.props.apiDetachSuffix) {
      return null;
    }

    const baseUrl = this.props.representedObject.url;
    return `${baseUrl}${this.props.apiDetachSuffix}`;
  }

  get items() {
    const { items, itemKeyPath } = this.props;
    if (!itemKeyPath) {
      return items;
    }

    return items.map((item) => valueForKeyPath(item, itemKeyPath));
  }

  attachRecord = async(record) => {
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
      const attachUrl = this.attachUrl;
      if (attachUrl) {
        const res = await ServiceAgent.post(this.attachUrl, { item_id: record.id });
        record = res.body;
      }

      if (this.props.onAdd) {
        this.props.onAdd(record);
      }
    }

    this.handleEditDialogClose();

  };

  detachItem = async(item) => {
    const detachUrl = this.detachUrl;
    if (detachUrl) {
      const res = await ServiceAgent.delete(this.detachUrl, { item_id: item.id });
      item = res.body;
    }

    if (this.props.onRemove) {
      this.props.onRemove(item);
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
      this.attachRecord(selection);
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
              item={item}
              itemKeyPath={this.props.itemKeyPath}
              mode={mode}
              onChange={this.handleItemChange}
              onClick={this.handleItemClick}
              onRemove={this.detachItem}
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
            onSave={(record) => { this.attachRecord(record) }}
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
  classes: PropTypes.object,
  clickAction: PropTypes.oneOf(['link', 'edit']),
  EditDialogComponent: PropTypes.func,
  editDialogProps: PropTypes.object,
  entityType: PropTypes.string,
  filterParams: PropTypes.object,
  itemComponent: PropTypes.func,
  items: PropTypes.array.isRequired,
  itemKeyPath: PropTypes.string,
  onItemClick: PropTypes.func,
  onAdd: PropTypes.func,
  onRemove: PropTypes.func,
  onUpdate: PropTypes.func,
  listItemComponent: PropTypes.func,
  listItemProps: PropTypes.object,
  mode: PropTypes.oneOf(['view', 'edit']),
  representedObject: PropTypes.object,
  searchFilterParam: PropTypes.string,
  titleKey: PropTypes.any,
};

ItemList.defaultProps = {
  clickAction: 'link',
  EditDialogComponent: EditDialog,
  editDialogProps: {},
  filterParams: {},
  listItemProps: {},
  mode: 'view',
};

export default withStyles((theme) => ({
  root: theme.itemList.root,
  addButton: theme.itemList.addButton,
  addButtonIcon: theme.itemList.addButtonIcon,
}))(ItemList);
