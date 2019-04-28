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

var _FormControl = require('@material-ui/core/FormControl');

var _FormControl2 = _interopRequireDefault(_FormControl);

var _withStyles = require('@material-ui/core/styles/withStyles');

var _withStyles2 = _interopRequireDefault(_withStyles);

var _ListDialog = require('./ListDialog');

var _ListDialog2 = _interopRequireDefault(_ListDialog);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * ModelSelectField
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */

var ModelSelectField = function (_React$PureComponent) {
  _inherits(ModelSelectField, _React$PureComponent);

  _createClass(ModelSelectField, null, [{
    key: 'coerceValue',
    value: function coerceValue(value) {
      return value.url;
    }
  }]);

  function ModelSelectField(props) {
    _classCallCheck(this, ModelSelectField);

    var _this = _possibleConstructorReturn(this, (ModelSelectField.__proto__ || Object.getPrototypeOf(ModelSelectField)).call(this, props));

    _this.handleListDialogDismiss = function (selection) {
      var newState = { listDialogOpen: false };
      if (selection) {
        newState.selectedModel = selection;

        if (_this.props.onChange) {
          _this.props.onChange(selection);
        }
      }
      _this.setState(newState);
    };

    _this.state = {
      listDialogOpen: false,
      selectedModel: props.value,
      buttonLabel: ''
    };
    return _this;
  }

  _createClass(ModelSelectField, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          classes = _props.classes,
          fieldInfo = _props.fieldInfo,
          label = _props.label,
          listDialogProps = _props.listDialogProps;


      var apiListUrl = fieldInfo.related_endpoint.singular + '/';

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
          _react2.default.createElement(
            _Button2.default,
            {
              color: 'primary',
              onClick: function onClick() {
                _this2.setState({ listDialogOpen: true });
              }
            },
            this.buttonLabel
          )
        ),
        this.state.listDialogOpen && _react2.default.createElement(_ListDialog2.default, _extends({
          apiListUrl: apiListUrl,
          onDismiss: this.handleListDialogDismiss
        }, listDialogProps))
      );
    }
  }, {
    key: 'buttonLabel',
    get: function get() {
      var selectedModel = this.state.selectedModel;
      var _props2 = this.props,
          listDialogProps = _props2.listDialogProps,
          titleKey = _props2.titleKey;


      if (selectedModel) {
        if (typeof titleKey === 'function') {
          return titleKey(selectedModel);
        }
        return selectedModel[titleKey];
      } else {
        return 'Choose ' + (listDialogProps.entityType || 'Option') + '...';
      }
    }
  }]);

  return ModelSelectField;
}(_react2.default.PureComponent);

ModelSelectField.propTypes = {
  classes: _propTypes2.default.object.isRequired,
  label: _propTypes2.default.string,
  listDialogProps: _propTypes2.default.object,
  titleKey: _propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes2.default.string]),
  value: _propTypes2.default.any
};

ModelSelectField.defaultProps = {
  listDialogProps: {}
};

exports.default = (0, _withStyles2.default)(function (theme) {
  return {
    fieldset: theme.form.customControl.fieldset,
    legend: theme.form.customControl.legend
  };
})(ModelSelectField);