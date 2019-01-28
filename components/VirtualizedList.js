'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var VirtualizedList = function VirtualizedList(props) {
  var classes = props.classes;


  var loadMoreProgressIndicator = _react2.default.createElement(
    _ListItem2.default,
    { className: props.classes.loadProgressListItem, key: 'loadMoreProgressIndicator' },
    _react2.default.createElement(_CircularProgress2.default, { color: 'primary', size: 30, thickness: 5 })
  );

  return _react2.default.createElement(
    _List2.default,
    { className: classes.list },
    props.store && props.store.items ? _react2.default.createElement(
      _reactInfiniteScroller2.default,
      {
        initialLoad: false,
        pageStart: 1,
        loadMore: function loadMore(page) {
          props.store.loadMore(page);
        },
        hasMore: !props.store.isLoaded,
        loader: loadMoreProgressIndicator
      },
      props.store.items.map(function (item) {
        return _react2.default.createElement(props.componentForItem, {
          key: item.id,
          item: item,
          contextProvider: props.itemContextProvider
        });
      })
    ) : _react2.default.createElement(
      _react2.default.Fragment,
      null,
      loadMoreProgressIndicator
    )
  );
};

VirtualizedList.propTypes = {
  classes: _propTypes2.default.object.isRequired,
  componentForItem: _propTypes2.default.func.isRequired,
  itemContextProvider: _propTypes2.default.func,
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