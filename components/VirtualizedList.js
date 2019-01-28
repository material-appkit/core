'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _withStyles = require('@material-ui/core/styles/withStyles');

var _withStyles2 = _interopRequireDefault(_withStyles);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var VirtualizedList = function (_React$Component) {
  _inherits(VirtualizedList, _React$Component);

  function VirtualizedList(props) {
    _classCallCheck(this, VirtualizedList);

    var _this = _possibleConstructorReturn(this, (VirtualizedList.__proto__ || Object.getPrototypeOf(VirtualizedList)).call(this, props));

    _this.handleSelectControlClick = function (item) {
      var newSelection = null;
      if (_this.state.selection !== item.id) {
        newSelection = item.id;
      }
      _this.setState({ selection: newSelection });

      if (_this.props.onSelectionChange) {
        _this.props.onSelectionChange(newSelection);
      }
    };

    _this.loadMoreProgressIndicator = _react2.default.createElement(
      _ListItem2.default,
      { className: props.classes.loadProgressListItem, key: 'loadMoreProgressIndicator' },
      _react2.default.createElement(_CircularProgress2.default, { color: 'primary', size: 30, thickness: 5 })
    );

    _this.state = {
      selection: null
    };
    return _this;
  }

  _createClass(VirtualizedList, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var classes = this.props.classes;


      return _react2.default.createElement(
        _List2.default,
        { className: classes.list },
        this.props.store && this.props.store.items ? _react2.default.createElement(
          _reactInfiniteScroller2.default,
          {
            initialLoad: false,
            pageStart: 1,
            loadMore: function loadMore(page) {
              _this2.props.store.loadMore(page);
            },
            hasMore: !this.props.store.isLoaded,
            loader: this.loadMoreProgressIndicator
          },
          this.props.store.items.map(function (item) {
            return _react2.default.createElement(_this2.props.componentForItem, {
              contextProvider: _this2.props.itemContextProvider,
              key: item.id,
              item: item,
              onItemClick: _this2.props.onItemClick,
              onSelectControlClick: _this2.handleSelectControlClick,
              selected: item.id === _this2.state.selection,
              selectionMode: _this2.props.selectionMode
            });
          })
        ) : _react2.default.createElement(
          _react2.default.Fragment,
          null,
          this.loadMoreProgressIndicator
        )
      );
    }
  }]);

  return VirtualizedList;
}(_react2.default.Component);

VirtualizedList.propTypes = {
  classes: _propTypes2.default.object.isRequired,
  componentForItem: _propTypes2.default.func.isRequired,
  itemContextProvider: _propTypes2.default.func,
  onItemClick: _propTypes2.default.func,
  onSelectionChange: _propTypes2.default.func,
  selectionMode: _propTypes2.default.oneOf(['single', 'multiple']),
  store: _propTypes2.default.object.isRequired
};

exports.default = (0, _withStyles2.default)(function (theme) {
  return {
    list: theme.listView.list,

    loadProgressListItem: {
      justifyContent: 'center'
    }
  };
})((0, _mobxReact.observer)(VirtualizedList));