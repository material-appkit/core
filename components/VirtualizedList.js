'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mobxReact = require('mobx-react');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactInfiniteScroller = require('react-infinite-scroller');

var _reactInfiniteScroller2 = _interopRequireDefault(_reactInfiniteScroller);

var _CircularProgress = require('@material-ui/core/CircularProgress');

var _CircularProgress2 = _interopRequireDefault(_CircularProgress);

var _List = require('@material-ui/core/List');

var _List2 = _interopRequireDefault(_List);

var _ListItem = require('@material-ui/core/ListItem');

var _ListItem2 = _interopRequireDefault(_ListItem);

var _ListSubheader = require('@material-ui/core/ListSubheader');

var _ListSubheader2 = _interopRequireDefault(_ListSubheader);

var _withStyles = require('@material-ui/core/styles/withStyles');

var _withStyles2 = _interopRequireDefault(_withStyles);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var VirtualizedList = function (_React$Component) {
  _inherits(VirtualizedList, _React$Component);

  function VirtualizedList(props) {
    var _this2 = this;

    _classCallCheck(this, VirtualizedList);

    var _this = _possibleConstructorReturn(this, (VirtualizedList.__proto__ || Object.getPrototypeOf(VirtualizedList)).call(this, props));

    _this.isSelected = function (item) {
      var selection = _this.state.selection;

      if (selection === null) {
        return false;
      }

      return !!selection[item.id];
    };

    _this.isGrouped = function (items) {
      if (!items || !items.length) {
        return false;
      }
      return Array.isArray(items[0]);
    };

    _this.handleSelectControlClick = function (item) {
      var _this$props = _this.props,
          onSelectionChange = _this$props.onSelectionChange,
          selectionMode = _this$props.selectionMode;
      var selection = _this.state.selection;

      var itemId = item.id;

      var newSelection = {};
      if (selectionMode === 'single') {
        if (!selection[itemId]) {
          newSelection[itemId] = item;
        }
      } else {
        Object.assign(newSelection, selection);
        if (newSelection[itemId]) {
          delete newSelection[itemId];
        } else {
          newSelection[itemId] = item;
        }
      }

      _this.setState({ selection: newSelection });

      if (onSelectionChange) {
        var selectedItems = Object.values(newSelection);
        if (selectionMode === 'single') {
          onSelectionChange(selectedItems.pop());
        } else {
          onSelectionChange(selectedItems);
        }
      }
    };

    _this.renderItem = function (item) {
      return _react2.default.createElement(_this2.props.componentForItem, _extends({
        contextProvider: _this.props.itemContextProvider,
        key: item[_this.props.itemIdKey],
        item: item,
        onItemClick: _this.props.onItemClick,
        onSelectControlClick: _this.handleSelectControlClick,
        selected: _this.isSelected(item),
        selectionMode: _this.props.selectionMode
      }, _this.props.itemProps));
    };

    _this.loadMoreProgressIndicator = _react2.default.createElement(
      _ListItem2.default,
      { className: props.classes.loadProgressListItem, key: 'loadMoreProgressIndicator' },
      _react2.default.createElement(_CircularProgress2.default, { color: 'primary', size: 30, thickness: 5 })
    );

    _this.state = {
      selection: props.selectionMode ? {} : null
    };
    return _this;
  }

  _createClass(VirtualizedList, [{
    key: 'render',
    value: function render() {
      var _this3 = this;

      var _props = this.props,
          classes = _props.classes,
          dense = _props.dense,
          items = _props.items,
          store = _props.store;


      var listChildren = null;
      if (items) {
        if (this.isGrouped(items)) {
          listChildren = items.map(function (itemGroup) {
            return _react2.default.createElement(
              _react.Fragment,
              { key: itemGroup[0] },
              _react2.default.createElement(
                _ListSubheader2.default,
                { className: classes.subheader, disableSticky: true },
                itemGroup[0]
              ),
              itemGroup[1].map(_this3.renderItem)
            );
          });
        } else {
          listChildren = items.map(this.renderItem);
        }
      } else if (store) {
        if (store.items) {
          listChildren = _react2.default.createElement(
            _reactInfiniteScroller2.default,
            {
              getScrollParent: this.props.getScrollParent,
              initialLoad: false,
              pageStart: 1,
              loadMore: function loadMore(page) {
                store.loadMore(page);
              },
              hasMore: !store.isLoaded,
              loader: this.loadMoreProgressIndicator,
              useWindow: this.props.useWindow
            },
            store.items.map(this.renderItem)
          );
        } else {
          listChildren = this.loadMoreProgressIndicator;
        }
      } else {
        return null;
      }

      return _react2.default.createElement(
        _List2.default,
        { className: classes.list, dense: dense },
        listChildren
      );
    }
  }]);

  return VirtualizedList;
}(_react2.default.Component);

VirtualizedList.propTypes = {
  classes: _propTypes2.default.object.isRequired,
  componentForItem: _propTypes2.default.func.isRequired,
  dense: _propTypes2.default.bool,
  getScrollParent: _propTypes2.default.func,
  itemContextProvider: _propTypes2.default.func,
  itemIdKey: _propTypes2.default.string,
  itemProps: _propTypes2.default.object,
  items: _propTypes2.default.array,
  onItemClick: _propTypes2.default.func,
  onSelectionChange: _propTypes2.default.func,
  selectionMode: _propTypes2.default.oneOf(['single', 'multiple']),
  store: _propTypes2.default.object,
  useWindow: _propTypes2.default.bool
};

VirtualizedList.defaultProps = {
  dense: false,
  itemIdKey: 'id',
  itemProps: {},
  useWindow: true
};

exports.default = (0, _withStyles2.default)(function (theme) {
  return {
    list: theme.listView.list,
    subheader: theme.listView.subheader,

    loadProgressListItem: {
      justifyContent: 'center'
    }
  };
})((0, _mobxReact.observer)(VirtualizedList));