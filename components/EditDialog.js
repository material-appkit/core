'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactIntlUniversal = require('react-intl-universal');

var _reactIntlUniversal2 = _interopRequireDefault(_reactIntlUniversal);

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

var _Form = require('./Form');

var _Form2 = _interopRequireDefault(_Form);

var _FormActions = require('./FormActions');

var _FormActions2 = _interopRequireDefault(_FormActions);

var _SnackbarManager = require('../managers/SnackbarManager');

var _SnackbarManager2 = _interopRequireDefault(_SnackbarManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EditDialog = function (_React$Component) {
  _inherits(EditDialog, _React$Component);

  function EditDialog(props) {
    _classCallCheck(this, EditDialog);

    var _this = _possibleConstructorReturn(this, (EditDialog.__proto__ || Object.getPrototypeOf(EditDialog)).call(this, props));

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

    _this.handleFormError = function (err) {
      var errorMessage = _reactIntlUniversal2.default.get('SAVE_FAIL_NOTIFICATION').defaultMessage('Unable to Save');
      _SnackbarManager2.default.error(errorMessage);
    };

    var title = props.entityType;
    if (props.apiDetailUrl || props.representedObjectId) {
      title = _reactIntlUniversal2.default.get('UPDATE').defaultMessage('Update') + ' ' + title;
    } else {
      title = _reactIntlUniversal2.default.get('ADD').defaultMessage('Add') + ' ' + title;
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
    key: 'render',
    value: function render() {
      var _this2 = this;

      if (this.state.redirectTo) {
        return _react2.default.createElement(_reactRouterDom.Redirect, { to: this.state.redirectTo });
      }

      var _props = this.props,
          apiCreateUrl = _props.apiCreateUrl,
          apiDetailUrl = _props.apiDetailUrl,
          apiDetailUrlPath = _props.apiDetailUrlPath,
          classes = _props.classes,
          defaults = _props.defaults,
          entityType = _props.entityType,
          fields = _props.fields,
          fieldArrangement = _props.fieldArrangement,
          representedObjectId = _props.representedObjectId;

      return _react2.default.createElement(
        _Dialog2.default,
        { open: true,
          classes: { paper: classes.paper },
          onClose: function onClose() {
            _this2.dismiss();
          }
        },
        _react2.default.createElement(
          _DialogTitle2.default,
          { id: 'form-dialog-title' },
          this.state.title
        ),
        _react2.default.createElement(
          _DialogContent2.default,
          null,
          _react2.default.createElement(
            _Form2.default,
            {
              apiCreateUrl: apiCreateUrl,
              apiDetailUrl: apiDetailUrl,
              apiDetailUrlPath: apiDetailUrlPath,
              defaultValues: defaults,
              entityType: entityType,
              fields: fields,
              fieldArrangement: fieldArrangement,
              onLoad: this.handleFormLoad,
              onSave: this.handleFormSave,
              onError: this.handleFormError,
              representedObjectId: representedObjectId
            },
            _react2.default.createElement(
              _FormActions2.default,
              null,
              _react2.default.createElement(
                _Button2.default,
                { onClick: function onClick() {
                    _this2.dismiss();
                  } },
                _reactIntlUniversal2.default.get('CANCEL').defaultMessage('Cancel')
              ),
              _react2.default.createElement(
                _Button2.default,
                { color: 'primary', type: 'submit' },
                _reactIntlUniversal2.default.get('SAVE').defaultMessage('Save')
              )
            )
          )
        )
      );
    }
  }]);

  return EditDialog;
}(_react2.default.Component);

EditDialog.propTypes = {
  apiCreateUrl: _propTypes2.default.string,
  apiDetailUrl: _propTypes2.default.string,
  apiDetailUrlPath: _propTypes2.default.string,
  classes: _propTypes2.default.object,
  defaults: _propTypes2.default.object,
  entityType: _propTypes2.default.string.isRequired,
  fields: _propTypes2.default.any,
  fieldArrangement: _propTypes2.default.array,
  onLoad: _propTypes2.default.func,
  onSave: _propTypes2.default.func,
  onClose: _propTypes2.default.func.isRequired,
  representedObjectId: _propTypes2.default.number,
  title: _propTypes2.default.any,
  titleKey: _propTypes2.default.string
};

EditDialog.defaultProps = {
  defaults: {}
};

exports.default = (0, _withStyles2.default)(function (theme) {
  return {
    paper: theme.editDialog.paper
  };
})(EditDialog);