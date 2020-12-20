/**
*
* ItemListWidget
*
*/

import isEqual from 'lodash.isequal';

import React from 'react';
import PropTypes from 'prop-types';

import FormControl from '@material-ui/core/FormControl';
import withStyles from '@material-ui/core/styles/withStyles';

import { removeObject } from '../../util/array';

import ListViewItem from '../ListViewItem';
import ItemList from '../ItemList';

class ItemListWidget extends React.PureComponent {
  static toRepresentation(value) {
    return value.map((item) => item.url);
  }

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

  get listUrl() {
    const { fieldInfo } = this.props;
    return `${fieldInfo.related_endpoint.singular}/`;
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

  handleItemListAdd(items) {
    const newItems = this.props.value.slice().concat(items);
    this.dispatchChangeEvent(newItems);
  }

  handleItemListRemove(item) {
    const newItems = removeObject(this.props.value, 'id', item.id);
    this.dispatchChangeEvent(newItems);
  }

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
      <FormControl fullWidth margin="none">
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
            apiListUrl={this.listUrl}
            clickAction="edit"
            editDialogProps={this.props.editDialogProps}
            entityType={this.props.entityType}
            filterParams={this.props.filterParams}
            items={this.props.value}
            itemKeyPath={this.props.itemKeyPath}
            listDialogProps={{
              fullWidth: true,
              ...this.props.listDialogProps,
            }}
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

ItemListWidget.propTypes = {
  classes: PropTypes.object.isRequired,
  createUrl: PropTypes.string,
  editDialogProps: PropTypes.object,
  entityType: PropTypes.string.isRequired,
  filterParams: PropTypes.object,
  itemKeyPath: PropTypes.string,
  listDialogProps: PropTypes.object,
  listItemComponent: PropTypes.func,
  listItemProps: PropTypes.object,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  searchFilterParam: PropTypes.string,
  titleKey: PropTypes.any.isRequired,
  value: PropTypes.array.isRequired,
};

ItemListWidget.defaultProps = {
  editDialogProps: {},
  filterParams: {},
  listDialogProps: {},
  listItemComponent: ListViewItem,
  listItemProps: {},
};

export default withStyles((theme) => ({
  fieldset: theme.form.customControl.fieldset,
  legend: theme.form.customControl.legend,
}))(ItemListWidget);
