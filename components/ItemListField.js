'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _FormControl = require('@material-ui/core/FormControl');

var _FormControl2 = _interopRequireDefault(_FormControl);

var _withStyles = require('@material-ui/core/styles/withStyles');

var _withStyles2 = _interopRequireDefault(_withStyles);

var _array = require('../util/array');

var _ServiceAgent = require('../util/ServiceAgent');

var _ServiceAgent2 = _interopRequireDefault(_ServiceAgent);

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

  function ItemListField(props) {
    _classCallCheck(this, ItemListField);

    var _this = _possibleConstructorReturn(this, (ItemListField.__proto__ || Object.getPrototypeOf(ItemListField)).call(this, props));

    _this.handleItemListRemove = function (item) {
      var newItems = (0, _array.removeObject)(_this.state.items, 'id', item.id);
      _this.updateOptions(newItems);
    };

    _this.selectRef = _react2.default.createRef();

    _this.handleItemListAdd = _this.handleItemListAdd.bind(_this);
    _this.handleItemListRemove = _this.handleItemListRemove.bind(_this);

    _this.state = {
      items: []
    };
    return _this;
  }

  _createClass(ItemListField, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var defaultItems = this.props.defaultItems || [];
      this.updateOptions(defaultItems);
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

      this.setState({ items: items });
    }
  }, {
    key: 'handleItemListAdd',
    value: function handleItemListAdd(item) {
      var items = this.state.items.slice();
      items.push(item);
      this.updateOptions(items);
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
            apiListUrl: this.props.listUrl,
            clickAction: 'edit',
            editDialogProps: this.props.editDialogProps,
            entityType: this.props.entityType,
            filterBy: this.props.filterBy,
            items: this.state.items,
            itemKeyPath: this.props.itemKeyPath,
            listItemComponent: this.props.listItemComponent,
            listItemProps: this.props.listItemProps,
            mode: 'edit',
            onAdd: this.handleItemListAdd,
            onRemove: this.handleItemListRemove,
            titleKey: this.props.titleKey
          })
        )
      );
    }
  }]);

  return ItemListField;
}(_react2.default.PureComponent);

ItemListField.propTypes = {
  classes: _propTypes2.default.object.isRequired,
  createUrl: _propTypes2.default.string,
  defaultItems: _propTypes2.default.array,
  editDialogProps: _propTypes2.default.object,
  entityType: _propTypes2.default.string.isRequired,
  filterBy: _propTypes2.default.string,
  itemKeyPath: _propTypes2.default.string,
  listUrl: _propTypes2.default.string.isRequired,
  listItemComponent: _propTypes2.default.func,
  listItemProps: _propTypes2.default.object,
  label: _propTypes2.default.string,
  name: _propTypes2.default.string.isRequired,
  titleKey: _propTypes2.default.any.isRequired
};

ItemListField.defaultProps = {
  editDialogProps: {},
  listItemComponent: _VirtualizedListItem2.default,
  listItemProps: {}
};

exports.default = (0, _withStyles2.default)(function (theme) {
  return {
    fieldset: {
      borderColor: 'rgba(0, 0, 0, 0.23)',
      borderRadius: theme.shape.borderRadius,
      borderWidth: 1
    },

    legend: {
      color: 'rgba(0, 0, 0, 0.54)',
      fontSize: '0.75rem',
      textTransform: 'capitalize'
    }
  };
})(ItemListField);