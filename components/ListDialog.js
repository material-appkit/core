'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Button = require('@material-ui/core/Button');

var _Button2 = _interopRequireDefault(_Button);

var _Dialog = require('@material-ui/core/Dialog');

var _Dialog2 = _interopRequireDefault(_Dialog);

var _LinearProgress = require('@material-ui/core/LinearProgress');

var _LinearProgress2 = _interopRequireDefault(_LinearProgress);

var _DialogTitle = require('@material-ui/core/DialogTitle');

var _DialogTitle2 = _interopRequireDefault(_DialogTitle);

var _DialogContent = require('@material-ui/core/DialogContent');

var _DialogContent2 = _interopRequireDefault(_DialogContent);

var _DialogActions = require('@material-ui/core/DialogActions');

var _DialogActions2 = _interopRequireDefault(_DialogActions);

var _IconButton = require('@material-ui/core/IconButton');

var _IconButton2 = _interopRequireDefault(_IconButton);

var _RootRef = require('@material-ui/core/RootRef');

var _RootRef2 = _interopRequireDefault(_RootRef);

var _Typography = require('@material-ui/core/Typography');

var _Typography2 = _interopRequireDefault(_Typography);

var _withStyles = require('@material-ui/core/styles/withStyles');

var _withStyles2 = _interopRequireDefault(_withStyles);

var _Close = require('@material-ui/icons/Close');

var _Close2 = _interopRequireDefault(_Close);

var _EditDialog = require('./EditDialog');

var _EditDialog2 = _interopRequireDefault(_EditDialog);

var _Spacer = require('./Spacer');

var _Spacer2 = _interopRequireDefault(_Spacer);

var _TextField = require('./TextField');

var _TextField2 = _interopRequireDefault(_TextField);

var _VirtualizedList = require('./VirtualizedList');

var _VirtualizedList2 = _interopRequireDefault(_VirtualizedList);

var _RemoteStore = require('../stores/RemoteStore');

var _RemoteStore2 = _interopRequireDefault(_RemoteStore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * ListDialog
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */

var DialogTitle = (0, _withStyles2.default)(function (theme) {
  return {
    root: {
      borderBottom: '1px solid ' + theme.palette.divider,
      margin: 0,
      padding: 0
    },

    headingContainer: {
      padding: theme.spacing(2)
    },

    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500]
    }
  };
})(function (props) {
  var classes = props.classes;

  return _react2.default.createElement(
    _DialogTitle2.default,
    { disableTypography: true, className: classes.root },
    _react2.default.createElement(
      'div',
      { className: classes.headingContainer },
      _react2.default.createElement(
        _Typography2.default,
        { variant: 'h6' },
        props.text
      ),
      props.onClose && _react2.default.createElement(
        _IconButton2.default,
        {
          'aria-label': 'Close',
          className: classes.closeButton,
          onClick: props.onClose
        },
        _react2.default.createElement(_Close2.default, null)
      )
    ),
    props.children
  );
});

var DialogContent = (0, _withStyles2.default)(function (theme) {
  return {
    root: {
      margin: 0,
      padding: 0,
      height: 300
    }
  };
})(_DialogContent2.default);

var DialogActions = (0, _withStyles2.default)(function (theme) {
  return {
    root: {
      borderTop: '1px solid ' + theme.palette.divider,
      margin: 0,
      padding: '8px 4px 8px 12px'
    }
  };
})(_DialogActions2.default);

var ListDialog = function (_React$PureComponent) {
  _inherits(ListDialog, _React$PureComponent);

  function ListDialog(props) {
    _classCallCheck(this, ListDialog);

    var _this = _possibleConstructorReturn(this, (ListDialog.__proto__ || Object.getPrototypeOf(ListDialog)).call(this, props));

    _this.dismiss = function (value) {
      _this.props.onDismiss(value);
    };

    _this.handleKeyPress = function (e) {
      var selection = _this.state.selection;

      if (e.key === 'Enter' && selection) {
        _this.dismiss(selection);
      }
    };

    _this.handleSearchFilterChange = function (filterTerm) {
      var filterParams = _extends({}, _this.props.filterParams);
      if (filterTerm) {
        filterParams[_this.props.searchFilterParam] = filterTerm;
      }

      _this.store.update(filterParams);
    };

    _this.handleEditDialogClose = function () {
      _this.setState({ addDialogIsOpen: false });
    };

    _this.handleEditDialogSave = function (record) {
      _this.dismiss(record);
    };

    _this.dialogContentRef = _react2.default.createRef();

    if (props.store) {
      _this.store = props.store;
    } else if (props.apiListUrl) {
      _this.store = new _RemoteStore2.default({ endpoint: props.apiListUrl });
      _this.store.load(props.filterParams);
    } else {
      throw new Error('ListDialog requires a store or an apiListUrl prop');
    }

    _this.state = {
      loading: false,
      selection: null,
      addDialogIsOpen: false
    };
    return _this;
  }

  _createClass(ListDialog, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          classes = _props.classes,
          listItemProps = _props.listItemProps;


      var itemProps = _extends({
        isLink: false,
        style: { padding: '3px 6px' },
        className: classes.listItem
      }, listItemProps);

      return _react2.default.createElement(
        _react.Fragment,
        null,
        _react2.default.createElement(
          _Dialog2.default,
          {
            classes: { paper: classes.paper },
            onClose: function onClose() {
              _this2.dismiss(null);
            },
            onKeyPress: this.handleKeyPress,
            open: true
          },
          _react2.default.createElement(
            DialogTitle,
            {
              onClose: function onClose() {
                _this2.dismiss();
              },
              text: 'Select a ' + this.props.entityType
            },
            this.props.searchFilterParam && _react2.default.createElement(_TextField2.default, {
              autoFocus: true,
              className: classes.filterField,
              fullWidth: true,
              margin: 'dense',
              onTimeout: this.handleSearchFilterChange,
              timeoutDelay: 500,
              placeholder: 'Filter by search term...',
              variant: 'outlined'
            }),
            _react2.default.createElement(_LinearProgress2.default, {
              className: classes.progressBar,
              variant: this.state.loading ? 'indeterminate' : 'determinate',
              value: 0
            })
          ),
          _react2.default.createElement(
            _RootRef2.default,
            { rootRef: this.dialogContentRef },
            _react2.default.createElement(
              DialogContent,
              { className: classes.dialogContent },
              _react2.default.createElement(_VirtualizedList2.default, {
                componentForItem: this.props.listItemComponent,
                fullWidth: true,
                getScrollParent: function getScrollParent() {
                  return _this2.dialogContentRef.current;
                },
                itemIdKey: this.props.itemIdKey,
                itemProps: itemProps,
                itemContextProvider: this.listItemContextProvider,
                onSelectionChange: function onSelectionChange(selection) {
                  _this2.setState({ selection: selection });
                },
                selectionMode: this.props.selectionMode,
                selectOnClick: true,
                store: this.store,
                useWindow: false
              })
            )
          ),
          _react2.default.createElement(
            DialogActions,
            null,
            this.props.apiCreateUrl && _react2.default.createElement(
              _react.Fragment,
              null,
              _react2.default.createElement(
                _Button2.default,
                { onClick: function onClick() {
                    _this2.setState({ addDialogIsOpen: true });
                  } },
                'Create'
              ),
              _react2.default.createElement(_Spacer2.default, null)
            ),
            _react2.default.createElement(
              _Button2.default,
              {
                color: 'primary',
                disabled: !this.hasSelection,
                onClick: function onClick() {
                  _this2.dismiss(_this2.state.selection);
                }
              },
              'Choose'
            )
          )
        ),
        this.state.addDialogIsOpen && _react2.default.createElement(_EditDialog2.default, _extends({
          apiCreateUrl: this.props.apiCreateUrl,
          entityType: this.props.entityType,
          onClose: this.handleEditDialogClose,
          onSave: this.handleEditDialogSave
        }, this.props.editDialogProps))
      );
    }
  }, {
    key: 'hasSelection',
    get: function get() {
      if (Array.isArray(this.state.selection)) {
        return this.state.selection.length ? true : false;
      }
      return this.state.selection;
    }
  }]);

  return ListDialog;
}(_react2.default.PureComponent);

ListDialog.propTypes = {
  apiCreateUrl: _propTypes2.default.string,
  apiListUrl: _propTypes2.default.string,
  classes: _propTypes2.default.object.isRequired,
  editDialogProps: _propTypes2.default.object,
  entityType: _propTypes2.default.string.isRequired,
  filterParams: _propTypes2.default.object,
  itemIdKey: _propTypes2.default.string,
  listItemComponent: _propTypes2.default.object.isRequired,
  listItemProps: _propTypes2.default.object,
  onDismiss: _propTypes2.default.func.isRequired,
  searchFilterParam: _propTypes2.default.string,
  selectionMode: _propTypes2.default.oneOf(['single', 'multiple']),
  store: _propTypes2.default.object
};

ListDialog.defaultProps = {
  editDialogProps: {},
  filterParams: {},
  listItemProps: {},
  selectionMode: 'single'
};

exports.default = (0, _withStyles2.default)(function (theme) {
  return {
    listItem: {
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.08)',
        cursor: 'pointer'
      }
    },

    filterField: theme.listDialog.filterField,
    paper: theme.listDialog.paper,
    progressBar: theme.listDialog.progressBar
  };
})(ListDialog);