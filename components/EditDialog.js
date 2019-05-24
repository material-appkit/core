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

var _Dialog = require('@material-ui/core/Dialog');

var _Dialog2 = _interopRequireDefault(_Dialog);

var _DialogContent = require('@material-ui/core/DialogContent');

var _DialogContent2 = _interopRequireDefault(_DialogContent);

var _DialogTitle = require('@material-ui/core/DialogTitle');

var _DialogTitle2 = _interopRequireDefault(_DialogTitle);

var _withStyles = require('@material-ui/core/styles/withStyles');

var _withStyles2 = _interopRequireDefault(_withStyles);

var _AlertManager = require('../managers/AlertManager');

var _AlertManager2 = _interopRequireDefault(_AlertManager);

var _SnackbarManager = require('../managers/SnackbarManager');

var _SnackbarManager2 = _interopRequireDefault(_SnackbarManager);

var _ServiceAgent = require('../util/ServiceAgent');

var _ServiceAgent2 = _interopRequireDefault(_ServiceAgent);

var _Form = require('./Form');

var _Form2 = _interopRequireDefault(_Form);

var _Spacer = require('./Spacer');

var _Spacer2 = _interopRequireDefault(_Spacer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EditDialog = function (_React$Component) {
  _inherits(EditDialog, _React$Component);

  function EditDialog(props) {
    var _this2 = this;

    _classCallCheck(this, EditDialog);

    var _this = _possibleConstructorReturn(this, (EditDialog.__proto__ || Object.getPrototypeOf(EditDialog)).call(this, props));

    _this.deleteRepresentedObject = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var persistedObject;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              persistedObject = _this.props.persistedObject;
              _context.next = 3;
              return _ServiceAgent2.default.delete(persistedObject.url);

            case 3:

              if (_this.props.onDelete) {
                _this.props.onDelete(persistedObject);
              }

              _this.dismiss();

            case 5:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this2);
    }));

    _this.handleFormLoad = function (representedObject, fieldInfoMap) {
      if (_this.props.onLoad) {
        _this.props.onLoad(representedObject, fieldInfoMap);
      }
    };

    _this.handleFormSave = function (representedObject) {
      if (_this.props.onSave) {
        _this.props.onSave(representedObject);
      }

      _this.dismiss();
    };

    _this.handleFormError = function () {
      var errorMessage = _this.props.labels.SAVE_FAIL_NOTIFICATION;
      _SnackbarManager2.default.error(errorMessage);
    };

    _this.handleDeleteButtonClick = function () {
      _AlertManager2.default.confirm({
        title: 'Please Confirm',
        description: 'Are you sure you want to delete this item?',
        confirmButtonTitle: 'Delete',
        onDismiss: function onDismiss(flag) {
          if (flag) {
            _this.deleteRepresentedObject();
          }
        }
      });
    };

    _this.formRef = _react2.default.createRef();

    var title = props.entityType;
    if (props.persistedObject || props.apiDetailUrl || props.representedObjectId) {
      title = _this.props.labels.UPDATE + ' ' + title;
    } else {
      title = _this.props.labels.ADD + ' ' + title;
    }

    _this.state = {
      title: title,
      redirectTo: null
    };
    return _this;
  }

  _createClass(EditDialog, [{
    key: 'dismiss',
    value: function dismiss() {
      this.props.onClose(this);
    }
  }, {
    key: 'commit',
    value: function commit() {
      this.formRef.current.save();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      if (this.state.redirectTo) {
        return _react2.default.createElement(_reactRouterDom.Redirect, { to: this.state.redirectTo });
      }

      var _props = this.props,
          persistedObject = _props.persistedObject,
          classes = _props.classes,
          FormProps = _props.FormProps,
          rest = _objectWithoutProperties(_props, ['persistedObject', 'classes', 'FormProps']);

      return _react2.default.createElement(
        _Dialog2.default,
        {
          classes: { paper: classes.paper },
          onClose: function onClose() {
            _this3.dismiss();
          },
          open: true
        },
        _react2.default.createElement(
          _DialogTitle2.default,
          { id: 'form-dialog-title' },
          this.state.title
        ),
        _react2.default.createElement(
          _DialogContent2.default,
          null,
          _react2.default.createElement(_Form2.default, _extends({
            innerRef: this.formRef,
            onLoad: this.handleFormLoad,
            onSave: this.handleFormSave,
            onError: this.handleFormError
          }, FormProps, rest))
        ),
        _react2.default.createElement(
          'div',
          { className: classes.dialogActions },
          persistedObject && _react2.default.createElement(
            _react.Fragment,
            null,
            _react2.default.createElement(
              _Button2.default,
              {
                className: classes.deleteButton,
                onClick: this.handleDeleteButtonClick
              },
              this.props.labels.DELETE
            ),
            _react2.default.createElement(_Spacer2.default, null)
          ),
          _react2.default.createElement(
            _Button2.default,
            { onClick: function onClick() {
                _this3.dismiss();
              } },
            this.props.labels.CANCEL
          ),
          _react2.default.createElement(
            _Button2.default,
            { onClick: function onClick() {
                _this3.commit();
              }, color: 'primary' },
            this.props.labels.SAVE
          )
        )
      );
    }
  }]);

  return EditDialog;
}(_react2.default.Component);

EditDialog.propTypes = {
  apiDetailUrl: _propTypes2.default.string,
  classes: _propTypes2.default.object,
  entityType: _propTypes2.default.string.isRequired,
  FormProps: _propTypes2.default.object,
  labels: _propTypes2.default.object,
  persistedObject: _propTypes2.default.object,
  onDelete: _propTypes2.default.func,
  onLoad: _propTypes2.default.func,
  onSave: _propTypes2.default.func,
  onClose: _propTypes2.default.func.isRequired
};

EditDialog.defaultProps = {
  FormProps: {},
  labels: {
    ADD: 'Add',
    CANCEL: 'Cancel',
    DELETE: 'Delete',
    SAVE: 'Save',
    SAVE_FAIL_NOTIFICATION: 'Unable to Save',
    UPDATE: 'Update'
  }
};

exports.default = (0, _withStyles2.default)(function (theme) {
  return {
    paper: theme.editDialog.paper,

    dialogActions: {
      flex: '0 0 auto',
      margin: '8px 4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end'
    },

    deleteButton: {
      color: '#f93d3d'
    }
  };
})(EditDialog);