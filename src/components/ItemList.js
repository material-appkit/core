/**
*
* ItemList
*
*/

import PropTypes from 'prop-types';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

import EditDialog from './EditDialog';
import ListDialog from './ListDialog';
import ServiceAgent from '../util/ServiceAgent';

function ItemListItem(props) {
  const { classes, clickAction, item, mode } = props;

  let Component = null;
  let componentProps = {
    onClick: () => { props.onClick(item) },
  };

  if (mode === 'edit' && clickAction === 'edit') {
    Component = Button;
    componentProps.className = classes.itemButton;
    componentProps.color = 'primary';
  } else {
    if (item.path) {
      Component = Link;
      componentProps.component = RouterLink;
      componentProps.to = item.path;
    } else if (item.media_url) {
      Component = Link;
      componentProps.href = item.media_url;
      componentProps.rel = 'noopener';
      componentProps.target = '_blank';
    } else {
      Component = Typography;
    }
  }

  let linkTitle = null;
  if (typeof(props.titleKey) === 'function') {
    linkTitle = props.titleKey(item);
  } else {
    linkTitle = item[props.titleKey];
  }

  return (
    <li className={classes.li}>
      {(props.onRemove && props.mode === 'edit') &&
        <IconButton
          aria-label="Delete"
          className={classes.removeButton}
          onClick={() => { props.onRemove(item); }}
        >
          <DeleteIcon className={classes.removeButtonIcon} />
        </IconButton>
      }
      <Component {...componentProps}>
        {linkTitle}
      </Component>
    </li>
  );
}

ItemListItem.propTypes = {
  classes: PropTypes.object.isRequired,
  clickAction: PropTypes.string,
  item: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  onRemove: PropTypes.func,
  mode: PropTypes.oneOf(['view', 'edit']),
  titleKey: PropTypes.any.isRequired,
};

const StyledItemListItem = withStyles((theme) => ({
  li: theme.itemList.li,
  removeButton: theme.itemList.removeButton,
  removeButtonIcon: theme.itemList.removeButtonIcon,
  itemButton: theme.itemList.itemButton,
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

  attachRecord = async(record) => {
    const recordIndex = this.props.items.findIndex((item) => {
      return item.id === record.id;
    });

    if (recordIndex !== -1) {
      this.props.items[recordIndex] = record;
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

  handleEditDialogClose = () => {
    this.setState({ editDialogOpen: false });
  };

  render() {
    const { classes, clickAction, mode } = this.props;

    return (
      <div>
        <ul>
          {this.props.items.map((item) => (
            <StyledItemListItem
              clickAction={clickAction}
              key={item.id}
              onClick={this.handleItemClick}
              onRemove={this.detachItem}
              mode={mode}
              item={item}
              titleKey={this.props.titleKey}
            />
          ))}
        </ul>

        {mode === 'edit' &&
          <React.Fragment>
            <React.Fragment>
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
                  entityType={this.props.entityType}
                  filterBy={this.props.filterBy}
                  listItemComponent={this.props.listItemComponent}
                  listItemProps={this.props.listItemProps}
                  onDismiss={this.handleListDialogDismiss}
                />
              }
            </React.Fragment>

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
          </React.Fragment>
        }
      </div>
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
  filterBy: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
  ]),
  items: PropTypes.array.isRequired,
  onItemClick: PropTypes.func,
  onRemove: PropTypes.func,
  onAdd: PropTypes.func,
  listItemComponent: PropTypes.func,
  listItemProps: PropTypes.object,
  mode: PropTypes.oneOf(['view', 'edit']),
  representedObject: PropTypes.object,
  titleKey: PropTypes.any.isRequired,
};

ItemList.defaultProps = {
  clickAction: 'link',
  EditDialogComponent: EditDialog,
  editDialogProps: {},
  listItemProps: {},
  mode: 'view',
};

export default withStyles((theme) => ({
  addButton: theme.itemList.addButton,
  addButtonIcon: theme.itemList.addButtonIcon,
}))(ItemList);
