import clsx from 'clsx';

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
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import AlertManager from '../managers/AlertManager';
import ServiceAgent from '../util/ServiceAgent';
import { valueForKeyPath } from '../util/object';

import EditDialog from './EditDialog';
import ListViewDialog from './ListViewDialog';


const itemListItemStyles = makeStyles((theme) => ({
  listItem: {
    padding: theme.spacing(0.25, 0),
  },

  listItemWithIcon: {
    display: 'inline-grid',
    gridColumnGap: 4,
    gridTemplateColumns: '24px 1fr',
  },

  listItemEditable: {
    display: 'inline-grid',
    gridColumnGap: 4,
    gridTemplateColumns: '24px 1fr min-content',
  },

  listItemText: {
    margin: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  removeIconRoot: {
    minWidth: 'unset',

    '&:hover': {
      color: theme.palette.primary.main,
      cursor: 'pointer',
    },
  },

  editIconButton: {
    marginRight: theme.spacing(0.5),
    padding: theme.spacing(0.25),
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },

  listItemIconRoot: {
    alignSelf: 'baseline',
    minWidth: 20,
  },

  listItemIcon: {
    fontSize: theme.typography.pxToRem(22),
  },
}));

function ItemListItem(props) {
  const { editable, item, onChange } = props;
  const classes = itemListItemStyles();

  let component = null;
  if (props.component) {
    // If a component class was explicitly provided, use it
    component = (
      <props.component
        item={item}
        onChange={onChange}
        {...props.componentProps}
      />
    );
  } else {
    let ComponentClass = Typography;
    let componentProps = {
      ...props.componentProps,
      onClick: () => { props.onClick(item) },
      onChange,
    };

    if (item.path) {
      ComponentClass = Link;
      componentProps.component = RouterLink;
      componentProps.to = item.path;
      componentProps.target = '_blank';
      componentProps.noWrap = true;
    } else if (item.media_url) {
      ComponentClass = Link;
      componentProps.href = item.media_url;
      componentProps.rel = 'noopener';
      componentProps.target = '_blank';
    }

    let linkTitle = null;
    if (typeof(props.titleKey) === 'function') {
      linkTitle = props.titleKey(item);
    } else {
      linkTitle = valueForKeyPath(item, props.titleKey);
    }

    component = (
      <ListItemText
        className={classes.listItemText}
        primary={(
          <ComponentClass {...componentProps}>
            {linkTitle}
          </ComponentClass>
        )}
      />
    );
  }

  const listItemClasses = [classes.listItem];
  if (props.icon) {
    listItemClasses.push(classes.listItemWithIcon);
  }

  if (editable && props.mode === 'edit' && props.clickAction === 'edit') {
    listItemClasses.push(classes.listItemEditable);
  }

  return (
    <ListItem
      className={clsx(listItemClasses)}
      {...props.listItemProps}
    >
      {(props.mode === 'view' && props.icon) &&
        <ListItemIcon classes={{ root: classes.listItemIconRoot }}>
          <props.icon className={classes.listItemIcon} />
        </ListItemIcon>
      }

      {(props.onRemove && props.mode === 'edit') &&
        <ListItemIcon
          aria-label="Delete"
          classes={{ root: classes.removeIconRoot }}
          onClick={() => props.onRemove(item)}
        >
          <DeleteIcon />
        </ListItemIcon>
      }

      {component}

      {(editable && props.mode === 'edit' && props.clickAction === 'edit') &&
        <div>
          <IconButton
            aria-label="Edit"
            className={classes.editIconButton}
            edge="end"
            onClick={() => props.onEdit(item)}
          >
            <EditIcon />
          </IconButton>
        </div>
      }
    </ListItem>
  );
}

ItemListItem.propTypes = {
  clickAction: PropTypes.string,
  component: PropTypes.func,
  componentProps: PropTypes.object,
  editable: PropTypes.bool,
  icon: PropTypes.object,
  item: PropTypes.object.isRequired,
  listItemProps: PropTypes.object,
  mode: PropTypes.oneOf(['view', 'edit']),
  onClick: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  onEdit: PropTypes.func,
  onRemove: PropTypes.func,
  titleKey: PropTypes.any,
};

ItemListItem.defaultProps = {
  listItemProps: {},
};

// -----------------------------------------------------------------------------
class ItemList extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      editDialogOpen: false,
      editingObject: null,
      listDialogOpen: false,
    };
  }


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
    if (!items) {
      return null;
    }

    if (!itemKeyPath) {
      return items;
    }

    return items.map((item) => valueForKeyPath(item, itemKeyPath));
  }

  /**
   * @param item
   * @returns {*} Unique identifier of given item
   */
  keyForItem = (item) => {
    const { itemIdKey } = this.props;
    return (typeof itemIdKey === 'function') ? itemIdKey(item) : item[itemIdKey];
  };

  attachRecords = async(records) => {
    if (!records.length) {
      return;
    }

    const attachUrl = this.attachUrl;
    if (attachUrl) {
      const record_ids = records.map((r) => r.id);
      const item_id = record_ids.length === 1 ? record_ids[0]  : record_ids;
      const res = await ServiceAgent.post(this.attachUrl, { item_id });
      const result = res.jsonData;
      if (this.props.onAdd) {
        this.props.onAdd(result);
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
      record = res.jsonData;
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


  handleEditButtonClick = (item) => {
    if (this.props.mode === 'edit' && this.props.clickAction === 'edit') {
      this.setState({ editDialogOpen: true, editingObject: item });
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
    if (selection) {
      this.attachRecords(selection);
    }

    this.setState({ listDialogOpen: false });
  };

  handleItemClick = (item) => {
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
    const {
      apiCreateUrl,
      apiListUrl,
      className,
      clickAction,
      editDialogProps,
      entityType,
      filterParams,
      itemComponent,
      itemComponentProps,
      itemKeyPath,
      itemIcon,
      itemListItemProps,
      listDialogProps,
      listItemComponent,
      listItemProps,
      listItemsEditable,
      mode,
      onAdd,
      searchFilterParam,
      titleKey,
    } = this.props;

    const items = this.items;
    if (!items) {
      return null;
    }

    return (
      <Fragment>
        <List disablePadding className={className}>
          {items.map((item) => (
            <ItemListItem
              clickAction={clickAction}
              component={itemComponent}
              componentProps={itemComponentProps}
              editable={listItemsEditable}
              key={this.keyForItem(item)}
              icon={itemIcon}
              item={item}
              itemKeyPath={itemKeyPath}
              listItemProps={itemListItemProps}
              mode={mode}
              onChange={this.handleItemChange}
              onClick={this.handleItemClick}
              onEdit={this.handleEditButtonClick}
              onRemove={this.handleRemoveButtonClick}
              titleKey={titleKey}
            />
          ))}
        </List>

        {mode === 'edit' &&
          <Fragment>
            {onAdd &&
              <Button
                color="primary"
                onClick={this.handleAddButtonClick}
                size="small"
                startIcon={<AddIcon />}
              >
                Add {entityType}
              </Button>
            }

            {apiListUrl && this.state.listDialogOpen &&
              <ListViewDialog
                apiCreateUrl={apiCreateUrl}
                filterParams={filterParams}
                displayMode="list"
                editDialogProps={editDialogProps}
                entityType={entityType}
                listItemComponent={listItemComponent}
                listItemProps={listItemProps}
                onDismiss={this.handleListDialogDismiss}
                searchFilterParam={searchFilterParam}
                src={apiListUrl}
                title={`Choose ${entityType}`}
                {...listDialogProps}
              />
            }
          </Fragment>
        }

        {this.state.editDialogOpen &&
          <this.props.EditDialogComponent
            apiCreateUrl={apiCreateUrl}
            apiDetailUrl={this.state.editingObject ? this.state.editingObject.url : null}
            entityType={entityType}
            onClose={this.handleEditDialogClose}
            onSave={this.handleItemChange}
            {...editDialogProps}
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
  className: PropTypes.string,
  clickAction: PropTypes.oneOf(['link', 'edit']),
  EditDialogComponent: PropTypes.func,
  editDialogProps: PropTypes.object,
  entityType: PropTypes.string,
  filterParams: PropTypes.object,
  itemComponent: PropTypes.func,
  itemComponentProps: PropTypes.object,
  itemListItemProps: PropTypes.object,
  itemIcon: PropTypes.object,
  items: PropTypes.array,
  itemIdKey: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]),
  itemKeyPath: PropTypes.string,
  listDialogProps: PropTypes.object,
  listItemComponent: PropTypes.any,
  listItemProps: PropTypes.object,
  listItemsEditable: PropTypes.bool,
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
  itemIdKey: 'id',
  itemComponentProps: {},
  itemListItemProps: { disableGutters: true },
  listItemProps: {},
  listDialogProps: {},
  mode: 'view',
  warnOnDelete: true,
};

export default ItemList;
