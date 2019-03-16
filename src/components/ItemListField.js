/**
*
* ItemListField
*
*/

import isEqual from 'lodash.isequal';

import React from 'react';
import PropTypes from 'prop-types';

import FormControl from '@material-ui/core/FormControl';
import withStyles from '@material-ui/core/styles/withStyles';

import { removeObject } from '../util/array';

import VirtualizedListItem from './VirtualizedListItem';
import ItemList from './ItemList';

class ItemListField extends React.PureComponent {
  constructor(props) {
    super(props);

    this.selectRef = React.createRef();

    this.handleItemListAdd = this.handleItemListAdd.bind(this);
    this.handleItemListRemove = this.handleItemListRemove.bind(this);
    this.handleItemListUpdate = this.handleItemListUpdate.bind(this);
    this.dispatchChangeEvent = this.dispatchChangeEvent.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(this.props.value, prevProps.value)) {
      this.updateOptions(this.props.value);
    }
  }

  updateOptions(items) {
    const select = this.selectRef.current;
    const options = select.options;
    for (let i = options.length - 1; i >= 0; --i) {
      select.remove(options[i]);
    }

    items.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.url;
      option.text = item.url;
      option.selected = true;
      select.add(option);
    });

    // Trigger a change event on the select element
    const changeEvent = new Event('change', { bubbles: true, cancelable: true });
    select.dispatchEvent(changeEvent);
  }

  handleItemListAdd(item) {
    const newItems = this.props.value.slice();
    newItems.push(item);
    this.dispatchChangeEvent(newItems);
  }

  handleItemListRemove(item) {
    const newItems = removeObject(this.props.value, 'id', item.id);
    this.dispatchChangeEvent(newItems);
  };

  handleItemListUpdate(item, itemIndex) {
    const newItems = this.props.value.slice();
    newItems[itemIndex] = item;
    this.dispatchChangeEvent(newItems);
  }

  dispatchChangeEvent(items) {
    if (this.props.onChange) {
      this.props.onChange(items);
    }
  }

  render() {
    const { classes, label } = this.props;

    return (
      <FormControl fullWidth margin="dense">
        <fieldset className={classes.fieldset}>
          {label &&
            <legend className={classes.legend}>{label}</legend>
          }

          <select
            multiple
            name={this.props.name}
            ref={this.selectRef}
            style={{ display: 'none' }}
          />

          <ItemList
            apiCreateUrl={this.props.createUrl}
            apiListUrl={this.props.listUrl}
            clickAction="edit"
            editDialogProps={this.props.editDialogProps}
            entityType={this.props.entityType}
            filterParams={this.props.filterParams}
            items={this.props.value}
            itemKeyPath={this.props.itemKeyPath}
            listItemComponent={this.props.listItemComponent}
            listItemProps={this.props.listItemProps}
            mode="edit"
            onAdd={this.handleItemListAdd}
            onRemove={this.handleItemListRemove}
            onUpdate={this.handleItemListUpdate}
            searchFilterParam={this.props.searchFilterParam}
            titleKey={this.props.titleKey}
          />
        </fieldset>
      </FormControl>
    );
  }
}

ItemListField.propTypes = {
  classes: PropTypes.object.isRequired,
  createUrl: PropTypes.string,
  editDialogProps: PropTypes.object,
  entityType: PropTypes.string.isRequired,
  filterParams: PropTypes.object,
  itemKeyPath: PropTypes.string,
  listUrl: PropTypes.string.isRequired,
  listItemComponent: PropTypes.func,
  listItemProps: PropTypes.object,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  searchFilterParam: PropTypes.string,
  titleKey: PropTypes.any.isRequired,
  value: PropTypes.array.isRequired,
};

ItemListField.defaultProps = {
  editDialogProps: {},
  filterParams: {},
  listItemComponent: VirtualizedListItem,
  listItemProps: {},
};

export default withStyles((theme) => ({
  fieldset: {
    borderColor: 'rgba(0, 0, 0, 0.23)',
    borderRadius: theme.shape.borderRadius,
    borderWidth: 1,
  },

  legend: {
    color: 'rgba(0, 0, 0, 0.54)',
    fontSize: '0.75rem',
    textTransform: 'capitalize',
  },
}))(ItemListField);
