'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = require('react-router-dom');

var _Button = require('@material-ui/core/Button');

var _Button2 = _interopRequireDefault(_Button);

var _Link = require('@material-ui/core/Link');

var _Link2 = _interopRequireDefault(_Link);

var _List = require('@material-ui/core/List');

var _List2 = _interopRequireDefault(_List);

var _ListItem = require('@material-ui/core/ListItem');

var _ListItem2 = _interopRequireDefault(_ListItem);

var _ListItemIcon = require('@material-ui/core/ListItemIcon');

var _ListItemIcon2 = _interopRequireDefault(_ListItemIcon);

var _ListItemText = require('@material-ui/core/ListItemText');

var _ListItemText2 = _interopRequireDefault(_ListItemText);

var _Typography = require('@material-ui/core/Typography');

var _Typography2 = _interopRequireDefault(_Typography);

var _styles = require('@material-ui/core/styles');

var _withStyles = require('@material-ui/core/styles/withStyles');

var _withStyles2 = _interopRequireDefault(_withStyles);

var _Add = require('@material-ui/icons/Add');

var _Add2 = _interopRequireDefault(_Add);

var _Delete = require('@material-ui/icons/Delete');

var _Delete2 = _interopRequireDefault(_Delete);

var _Edit = require('@material-ui/icons/Edit');

var _Edit2 = _interopRequireDefault(_Edit);

var _AlertManager = require('../managers/AlertManager');

var _AlertManager2 = _interopRequireDefault(_AlertManager);

var _ServiceAgent = require('../util/ServiceAgent');

var _ServiceAgent2 = _interopRequireDefault(_ServiceAgent);

var _object = require('../util/object');

var _EditDialog = require('./EditDialog');

var _EditDialog2 = _interopRequireDefault(_EditDialog);

var _ListDialog = require('./ListDialog');

var _ListDialog2 = _interopRequireDefault(_ListDialog);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * ItemList
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */

var itemListItemStyles = (0, _styles.makeStyles)(function (theme) {
  return {
    root: theme.itemList.item,
    itemButton: theme.itemList.itemButton,
    itemText: theme.itemList.itemText,

    removeIconRoot: {
      cursor: 'pointer',
      minWidth: 36
    },

    listItemIconRoot: {
      marginRight: 5
    },

    listItemIcon: {
      height: '18px !important',
      width: '18px !important'
    }
  };
});

function ItemListItem(props) {
  var item = props.item,
      _onClick = props.onClick,
      onChange = props.onChange;

  var classes = itemListItemStyles();

  var component = null;
  if (props.component) {
    // If a component class was explicitly provided, use it
    component = _react2.default.createElement(props.component, { item: props.item, onChange: onChange });
  } else {
    var ComponentClass = null;
    var componentProps = {
      onClick: function onClick() {
        _onClick(item);
      },
      onChange: onChange
    };

    if (item.path) {
      ComponentClass = _Link2.default;
      componentProps.component = _reactRouterDom.Link;
      componentProps.to = item.path;
    } else if (item.media_url) {
      ComponentClass = _Link2.default;
      componentProps.href = item.media_url;
      componentProps.rel = 'noopener';
      componentProps.target = '_blank';
    } else {
      ComponentClass = _Typography2.default;
    }

    var linkTitle = null;
    if (typeof props.titleKey === 'function') {
      linkTitle = props.titleKey(item);
    } else {
      linkTitle = item[props.titleKey];
    }

    component = _react2.default.createElement(_ListItemText2.default, {
      classes: { root: classes.itemText },
      primary: _react2.default.createElement(
        ComponentClass,
        componentProps,
        linkTitle
      )
    });
  }

  return _react2.default.createElement(
    _ListItem2.default,
    { classes: { root: classes.root } },
    props.mode === 'view' && props.icon && _react2.default.createElement(
      _ListItemIcon2.default,
      { classes: { root: classes.listItemIconRoot } },
      _react2.default.createElement(props.icon, { className: classes.listItemIcon })
    ),
    props.onRemove && props.mode === 'edit' && _react2.default.createElement(
      _ListItemIcon2.default,
      {
        'aria-label': 'Delete',
        classes: { root: classes.removeIconRoot },
        onClick: function onClick() {
          props.onRemove(item);
        }
      },
      _react2.default.createElement(_Delete2.default, null)
    ),
    props.mode === 'edit' && props.clickAction === 'edit' && _react2.default.createElement(
      _ListItemIcon2.default,
      {
        'aria-label': 'Edit',
        classes: { root: classes.removeIconRoot },
        onClick: function onClick() {
          _onClick(item);
        }
      },
      _react2.default.createElement(_Edit2.default, null)
    ),
    component
  );
}

ItemListItem.propTypes = {
  clickAction: _propTypes2.default.string,
  component: _propTypes2.default.func,
  icon: _propTypes2.default.object,
  item: _propTypes2.default.object.isRequired,
  mode: _propTypes2.default.oneOf(['view', 'edit']),
  onClick: _propTypes2.default.func.isRequired,
  onChange: _propTypes2.default.func,
  onRemove: _propTypes2.default.func,
  titleKey: _propTypes2.default.any
};

// -----------------------------------------------------------------------------

var ItemList = function (_React$PureComponent) {
  _inherits(ItemList, _React$PureComponent);

  function ItemList() {
    var _ref,
        _this2 = this;

    var _temp, _this, _ret;

    _classCallCheck(this, ItemList);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = ItemList.__proto__ || Object.getPrototypeOf(ItemList)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      editDialogOpen: false,
      editingObject: null,
      listDialogOpen: false
    }, _this.attachRecords = function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(records) {
        var attachUrl, record, items, recordIndex, res;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (records.length) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt('return');

              case 2:
                attachUrl = _this.attachUrl;

                if (!(records.length === 1)) {
                  _context.next = 20;
                  break;
                }

                record = records[0];
                items = _this.items;
                recordIndex = items.findIndex(function (item) {
                  return item.id === record.id;
                });

                if (!(recordIndex !== -1)) {
                  _context.next = 12;
                  break;
                }

                items[recordIndex] = record;
                if (_this.props.onUpdate) {
                  _this.props.onUpdate(record, recordIndex);
                }
                _context.next = 18;
                break;

              case 12:
                if (!attachUrl) {
                  _context.next = 17;
                  break;
                }

                _context.next = 15;
                return _ServiceAgent2.default.post(_this.attachUrl, { item_id: record.id });

              case 15:
                res = _context.sent;

                record = res.body;

              case 17:
                if (_this.props.onAdd) {
                  _this.props.onAdd([record]);
                }

              case 18:
                _context.next = 21;
                break;

              case 20:
                if (_this.props.onAdd) {
                  _this.props.onAdd(records);
                }

              case 21:

                _this.handleEditDialogClose();

              case 22:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, _this2);
      }));

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }(), _this.removeRecord = function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(record) {
        var _this$props, canDelete, onRemove, detachUrl, res;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _this$props = _this.props, canDelete = _this$props.canDelete, onRemove = _this$props.onRemove;
                detachUrl = _this.detachUrl;

                if (!detachUrl) {
                  _context2.next = 9;
                  break;
                }

                _context2.next = 5;
                return _ServiceAgent2.default.delete(_this.detachUrl, { item_id: record.id });

              case 5:
                res = _context2.sent;

                record = res.body;
                _context2.next = 12;
                break;

              case 9:
                if (!(canDelete && record.url)) {
                  _context2.next = 12;
                  break;
                }

                _context2.next = 12;
                return _ServiceAgent2.default.delete(record.url);

              case 12:

                if (onRemove) {
                  onRemove(record);
                }

              case 13:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, _this2);
      }));

      return function (_x2) {
        return _ref3.apply(this, arguments);
      };
    }(), _this.handleRemoveButtonClick = function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(item) {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (_this.props.warnOnDelete) {
                  _AlertManager2.default.confirm({
                    title: 'Please Confirm',
                    description: 'Are you sure you want to remove this item?',
                    confirmButtonTitle: 'Remove',
                    onDismiss: function onDismiss(flag) {
                      if (flag) {
                        _this.removeRecord(item);
                      }
                    }
                  });
                } else {
                  _this.removeRecord(item);
                }

              case 1:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, _this2);
      }));

      return function (_x3) {
        return _ref4.apply(this, arguments);
      };
    }(), _this.handleAddButtonClick = function () {
      if (_this.props.apiListUrl) {
        _this.setState({ listDialogOpen: true });
      } else {
        _this.setState({ editDialogOpen: true, editingObject: null });
      }
    }, _this.handleListDialogDismiss = function (selection) {
      _this.setState({ listDialogOpen: false });
      if (selection) {
        if (Array.isArray(selection)) {
          _this.attachRecords(selection);
        } else {
          _this.attachRecords([selection]);
        }
      }
    }, _this.handleItemClick = function (item) {
      if (_this.props.mode === 'edit' && _this.props.clickAction === 'edit') {
        _this.setState({ editDialogOpen: true, editingObject: item });
      }

      if (_this.props.onItemClick) {
        _this.props.onItemClick(item);
      }
    }, _this.handleItemChange = function (record) {
      var items = _this.items;
      var recordIndex = items.findIndex(function (item) {
        return item.id === record.id;
      });

      if (recordIndex !== -1) {
        items[recordIndex] = record;
        if (_this.props.onUpdate) {
          _this.props.onUpdate(record, recordIndex);
        }
      }
    }, _this.handleEditDialogClose = function () {
      _this.setState({ editDialogOpen: false });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(ItemList, [{
    key: 'render',
    value: function render() {
      var _this3 = this;

      var _props = this.props,
          classes = _props.classes,
          clickAction = _props.clickAction,
          mode = _props.mode;


      return _react2.default.createElement(
        _react.Fragment,
        null,
        _react2.default.createElement(
          _List2.default,
          { classes: { root: classes.root } },
          this.items.map(function (item) {
            return _react2.default.createElement(ItemListItem, {
              clickAction: clickAction,
              component: _this3.props.itemComponent,
              key: item.id,
              icon: _this3.props.itemIcon,
              item: item,
              itemKeyPath: _this3.props.itemKeyPath,
              mode: mode,
              onChange: _this3.handleItemChange,
              onClick: _this3.handleItemClick,
              onRemove: _this3.handleRemoveButtonClick,
              titleKey: _this3.props.titleKey
            });
          })
        ),
        mode === 'edit' && _react2.default.createElement(
          _react.Fragment,
          null,
          this.props.onAdd && _react2.default.createElement(
            _Button2.default,
            {
              color: 'primary',
              className: classes.addButton,
              onClick: this.handleAddButtonClick
            },
            _react2.default.createElement(_Add2.default, { className: classes.addButtonIcon }),
            'Add ',
            this.props.entityType
          ),
          this.props.apiListUrl && this.state.listDialogOpen && _react2.default.createElement(_ListDialog2.default, _extends({
            apiCreateUrl: this.props.apiCreateUrl,
            apiListUrl: this.props.apiListUrl,
            editDialogProps: this.props.editDialogProps,
            entityType: this.props.entityType,
            filterParams: this.props.filterParams,
            listItemComponent: this.props.listItemComponent,
            listItemProps: this.props.listItemProps,
            onDismiss: this.handleListDialogDismiss,
            searchFilterParam: this.props.searchFilterParam
          }, this.props.listDialogProps))
        ),
        this.state.editDialogOpen && _react2.default.createElement(this.props.EditDialogComponent, _extends({
          apiCreateUrl: this.props.apiCreateUrl,
          apiDetailUrl: this.state.editingObject ? this.state.editingObject.url : null,
          entityType: this.props.entityType,
          onClose: this.handleEditDialogClose,
          onSave: function onSave(record) {
            _this3.attachRecords([record]);
          }
        }, this.props.editDialogProps))
      );
    }
  }, {
    key: 'attachUrl',
    get: function get() {
      var _props2 = this.props,
          apiAttachSuffix = _props2.apiAttachSuffix,
          representedObject = _props2.representedObject;

      if (apiAttachSuffix === undefined || apiAttachSuffix === null) {
        return null;
      }

      return representedObject.url + apiAttachSuffix;
    }
  }, {
    key: 'detachUrl',
    get: function get() {
      var _props3 = this.props,
          apiDetachSuffix = _props3.apiDetachSuffix,
          representedObject = _props3.representedObject;

      if (apiDetachSuffix === undefined || apiDetachSuffix === null) {
        return null;
      }

      return representedObject.url + apiDetachSuffix;
    }
  }, {
    key: 'items',
    get: function get() {
      var _props4 = this.props,
          items = _props4.items,
          itemKeyPath = _props4.itemKeyPath;

      if (!itemKeyPath) {
        return items;
      }

      return items.map(function (item) {
        return (0, _object.valueForKeyPath)(item, itemKeyPath);
      });
    }
  }]);

  return ItemList;
}(_react2.default.PureComponent);

ItemList.propTypes = {
  apiCreateUrl: _propTypes2.default.string,
  apiListUrl: _propTypes2.default.string,
  apiAttachSuffix: _propTypes2.default.string,
  apiDetachSuffix: _propTypes2.default.string,
  canDelete: _propTypes2.default.bool,
  classes: _propTypes2.default.object,
  clickAction: _propTypes2.default.oneOf(['link', 'edit']),
  EditDialogComponent: _propTypes2.default.object,
  editDialogProps: _propTypes2.default.object,
  entityType: _propTypes2.default.string,
  filterParams: _propTypes2.default.object,
  itemComponent: _propTypes2.default.func,
  itemIcon: _propTypes2.default.object,
  items: _propTypes2.default.array.isRequired,
  itemKeyPath: _propTypes2.default.string,
  listDialogProps: _propTypes2.default.object,
  listItemComponent: _propTypes2.default.func,
  listItemProps: _propTypes2.default.object,
  onItemClick: _propTypes2.default.func,
  onAdd: _propTypes2.default.func,
  onRemove: _propTypes2.default.func,
  onUpdate: _propTypes2.default.func,
  mode: _propTypes2.default.oneOf(['view', 'edit']),
  representedObject: _propTypes2.default.object,
  searchFilterParam: _propTypes2.default.string,
  titleKey: _propTypes2.default.any,
  warnOnDelete: _propTypes2.default.bool
};

ItemList.defaultProps = {
  canDelete: false,
  clickAction: 'link',
  EditDialogComponent: _EditDialog2.default,
  editDialogProps: {},
  filterParams: {},
  listDialogProps: {},
  listItemProps: {},
  mode: 'view',
  warnOnDelete: true
};

exports.default = (0, _withStyles2.default)(function (theme) {
  return {
    root: theme.itemList.root,
    addButton: theme.itemList.addButton,
    addButtonIcon: theme.itemList.addButtonIcon
  };
})(ItemList);