'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash.isequal');

var _lodash2 = _interopRequireDefault(_lodash);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _FormControl = require('@material-ui/core/FormControl');

var _FormControl2 = _interopRequireDefault(_FormControl);

var _withStyles = require('@material-ui/core/styles/withStyles');

var _withStyles2 = _interopRequireDefault(_withStyles);

var _array = require('../util/array');

var _VirtualizedListItem = require('./VirtualizedListItem');

var _VirtualizedListItem2 = _interopRequireDefault(_VirtualizedListItem);

var _ItemList = require('./ItemList');

var _ItemList2 = _interopRequireDefault(_ItemList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * ItemListField
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */

var ItemListField = function (_React$PureComponent) {
  _inherits(ItemListField, _React$PureComponent);

  _createClass(ItemListField, null, [{
    key: 'coerceValue',
    value: function coerceValue(value) {
      return value.map(function (item) {
        return item.url;
      });
    }
  }]);

  function ItemListField(props) {
    _classCallCheck(this, ItemListField);

    var _this = _possibleConstructorReturn(this, (ItemListField.__proto__ || Object.getPrototypeOf(ItemListField)).call(this, props));

    _this.selectRef = _react2.default.createRef();

    _this.handleItemListAdd = _this.handleItemListAdd.bind(_this);
    _this.handleItemListRemove = _this.handleItemListRemove.bind(_this);
    _this.handleItemListUpdate = _this.handleItemListUpdate.bind(_this);
    _this.dispatchChangeEvent = _this.dispatchChangeEvent.bind(_this);
    return _this;
  }

  _createClass(ItemListField, [{
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      if (!(0, _lodash2.default)(this.props.value, prevProps.value)) {
        this.updateOptions(this.props.value);
      }
    }
  }, {
    key: 'updateOptions',
    value: function updateOptions(items) {
      var select = this.selectRef.current;
      var options = select.options;
      for (var i = options.length - 1; i >= 0; --i) {
        select.remove(options[i]);
      }

      items.forEach(function (item) {
        var option = document.createElement("option");
        option.value = item.url;
        option.text = item.url;
        option.selected = true;
        select.add(option);
      });

      // Trigger a change event on the select element
      var changeEvent = new Event('change', { bubbles: true, cancelable: true });
      select.dispatchEvent(changeEvent);
    }
  }, {
    key: 'handleItemListAdd',
    value: function handleItemListAdd(item) {
      var newItems = this.props.value.slice();
      newItems.push(item);
      this.dispatchChangeEvent(newItems);
    }
  }, {
    key: 'handleItemListRemove',
    value: function handleItemListRemove(item) {
      var newItems = (0, _array.removeObject)(this.props.value, 'id', item.id);
      this.dispatchChangeEvent(newItems);
    }
  }, {
    key: 'handleItemListUpdate',
    value: function handleItemListUpdate(item, itemIndex) {
      var newItems = this.props.value.slice();
      newItems[itemIndex] = item;
      this.dispatchChangeEvent(newItems);
    }
  }, {
    key: 'dispatchChangeEvent',
    value: function dispatchChangeEvent(items) {
      if (this.props.onChange) {
        this.props.onChange(items);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          classes = _props.classes,
          label = _props.label;


      return _react2.default.createElement(
        _FormControl2.default,
        { fullWidth: true, margin: 'dense' },
        _react2.default.createElement(
          'fieldset',
          { className: classes.fieldset },
          label && _react2.default.createElement(
            'legend',
            { className: classes.legend },
            label
          ),
          _react2.default.createElement('select', {
            multiple: true,
            name: this.props.name,
            ref: this.selectRef,
            style: { display: 'none' }
          }),
          _react2.default.createElement(_ItemList2.default, {
            apiCreateUrl: this.props.createUrl,
            apiListUrl: this.listUrl,
            clickAction: 'edit',
            editDialogProps: this.props.editDialogProps,
            entityType: this.props.entityType,
            filterParams: this.props.filterParams,
            items: this.props.value,
            itemKeyPath: this.props.itemKeyPath,
            listItemComponent: this.props.listItemComponent,
            listItemProps: this.props.listItemProps,
            mode: 'edit',
            onAdd: this.handleItemListAdd,
            onRemove: this.handleItemListRemove,
            onUpdate: this.handleItemListUpdate,
            searchFilterParam: this.props.searchFilterParam,
            titleKey: this.props.titleKey
          })
        )
      );
    }
  }, {
    key: 'listUrl',
    get: function get() {
      var fieldInfo = this.props.fieldInfo;

      return fieldInfo.related_endpoint.singular + '/';
    }
  }]);

  return ItemListField;
}(_react2.default.PureComponent);

ItemListField.propTypes = {
  classes: _propTypes2.default.object.isRequired,
  createUrl: _propTypes2.default.string,
  editDialogProps: _propTypes2.default.object,
  entityType: _propTypes2.default.string.isRequired,
  filterParams: _propTypes2.default.object,
  itemKeyPath: _propTypes2.default.string,
  listItemComponent: _propTypes2.default.func,
  listItemProps: _propTypes2.default.object,
  label: _propTypes2.default.string,
  name: _propTypes2.default.string.isRequired,
  onChange: _propTypes2.default.func,
  searchFilterParam: _propTypes2.default.string,
  titleKey: _propTypes2.default.any.isRequired,
  value: _propTypes2.default.array.isRequired
};

ItemListField.defaultProps = {
  editDialogProps: {},
  filterParams: {},
  listItemComponent: _VirtualizedListItem2.default,
  listItemProps: {}
};

exports.default = (0, _withStyles2.default)(function (theme) {
  return {
    fieldset: theme.form.customControl.fieldset,
    legend: theme.form.customControl.legend
  };
})(ItemListField);