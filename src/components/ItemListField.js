/**
*
* ItemListField
*
*/

import React from 'react';
import PropTypes from 'prop-types';

import FormControl from '@material-ui/core/FormControl';
import withStyles from '@material-ui/core/styles/withStyles';

import { removeObject } from '../util/array';

import ServiceAgent from '../util/ServiceAgent';
import VirtualizedListItem from './VirtualizedListItem';
import ItemList from './ItemList';

class ItemListField extends React.PureComponent {
  constructor(props) {
    super(props);

    this.selectRef = React.createRef();

    this.handleItemListAdd = this.handleItemListAdd.bind(this);
    this.handleItemListRemove = this.handleItemListRemove.bind(this);

    this.state = {
      items: [],
    };
  }

  componentDidMount() {
    const defaultItems = this.props.defaultItems || [];
    this.updateOptions(defaultItems);
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

    this.setState({ items });
  }

  handleItemListAdd(item) {
    const items = this.state.items.slice();
    items.push(item);
    this.updateOptions(items);
  }

  handleItemListRemove = (item) => {
    const newItems = removeObject(this.state.items, 'id', item.id);
    this.updateOptions(newItems);
  };


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
            apiListUrl={this.props.listUrl}
            entityType={this.props.entityType}
            filterBy={this.props.filterBy}
            items={this.state.items}
            listItemComponent={this.props.listItemComponent}
            mode="edit"
            onAdd={this.handleItemListAdd}
            onRemove={this.handleItemListRemove}
            ServiceAgent={this.props.ServiceAgent}
            titleKey={this.props.titleKey}
          />
        </fieldset>
      </FormControl>
    );
  }
}

ItemListField.propTypes = {
  classes: PropTypes.object.isRequired,
  defaultItems: PropTypes.array,
  entityType: PropTypes.string.isRequired,
  filterBy: PropTypes.string,
  listUrl: PropTypes.string.isRequired,
  listItemComponent: PropTypes.func,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  ServiceAgent: PropTypes.object,
  titleKey: PropTypes.any.isRequired,
};

ItemListField.defaultProps = {
  listItemComponent: VirtualizedListItem,
  ServiceAgent: ServiceAgent,
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
