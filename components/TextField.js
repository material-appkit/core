'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Input = require('@material-ui/core/Input');

var _Input2 = _interopRequireDefault(_Input);

var _FilledInput = require('@material-ui/core/FilledInput');

var _FilledInput2 = _interopRequireDefault(_FilledInput);

var _OutlinedInput = require('@material-ui/core/OutlinedInput');

var _OutlinedInput2 = _interopRequireDefault(_OutlinedInput);

var _InputLabel = require('@material-ui/core/InputLabel');

var _InputLabel2 = _interopRequireDefault(_InputLabel);

var _FormControl = require('@material-ui/core/FormControl');

var _FormControl2 = _interopRequireDefault(_FormControl);

var _FormHelperText = require('@material-ui/core/FormHelperText');

var _FormHelperText2 = _interopRequireDefault(_FormHelperText);

var _Select = require('@material-ui/core/Select');

var _Select2 = _interopRequireDefault(_Select);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // @inheritedComponent FormControl

var variantComponent = {
  standard: _Input2.default,
  filled: _FilledInput2.default,
  outlined: _OutlinedInput2.default
};

/**
 * The `TextField` is a convenience wrapper for the most common cases (80%).
 * It cannot be all things to all people, otherwise the API would grow out of control.
 *
 * ## Advanced Configuration
 *
 * It's important to understand that the text field is a simple abstraction
 * on top of the following components:
 * - [FormControl](/api/form-control/)
 * - [InputLabel](/api/input-label/)
 * - [Input](/api/input/)
 * - [FormHelperText](/api/form-helper-text/)
 *
 * If you wish to alter the properties applied to the native input, you can do so as follows:
 *
 * ```jsx
 * const inputProps = {
 *   step: 300,
 * };
 *
 * return <TextField id="time" type="time" inputProps={inputProps} />;
 * ```
 *
 * For advanced cases, please look at the source of TextField by clicking on the
 * "Edit this page" button above. Consider either:
 * - using the upper case props for passing values directly to the components
 * - using the underlying components directly as shown in the demos
 */

var TextField = function (_React$Component) {
  _inherits(TextField, _React$Component);

  function TextField(props) {
    _classCallCheck(this, TextField);

    var _this = _possibleConstructorReturn(this, (TextField.__proto__ || Object.getPrototypeOf(TextField)).call(this, props));

    _this.handleOnChange = function (e) {
      var _this$props = _this.props,
          name = _this$props.name,
          onChange = _this$props.onChange,
          onTimeout = _this$props.onTimeout,
          owner = _this$props.owner,
          timeoutDelay = _this$props.timeoutDelay;


      var value = e.target.value;

      if (name && owner && owner.setState) {
        owner.setState(_defineProperty({}, name, value));
      }

      if (onChange) {
        onChange(e);
      }

      if (!onTimeout) {
        // If there's no change handler there's no need for action.
        return;
      }

      if (timeoutDelay) {
        if (_this.delayedChangeTimer) {
          clearTimeout(_this.delayedChangeTimer);
        }

        _this.delayedChangeTimer = setTimeout(function () {
          onTimeout(value);
        }, timeoutDelay);
      } else {
        // If this TextField has no change delay, simply pass the event on to its listener
        onTimeout(value);
      }
    };

    _this.labelRef = _react2.default.createRef();
    _this.delayedChangeTimer = null;
    return _this;
  }

  _createClass(TextField, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (this.props.variant === 'outlined') {
        this.labelNode = _reactDom2.default.findDOMNode(this.labelRef.current);
        this.forceUpdate();
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          autoComplete = _props.autoComplete,
          autoFocus = _props.autoFocus,
          children = _props.children,
          className = _props.className,
          defaultValue = _props.defaultValue,
          error = _props.error,
          FormHelperTextProps = _props.FormHelperTextProps,
          fullWidth = _props.fullWidth,
          helperText = _props.helperText,
          id = _props.id,
          InputLabelProps = _props.InputLabelProps,
          inputProps = _props.inputProps,
          InputProps = _props.InputProps,
          inputRef = _props.inputRef,
          label = _props.label,
          multiline = _props.multiline,
          name = _props.name,
          onBlur = _props.onBlur,
          onChange = _props.onChange,
          onFocus = _props.onFocus,
          onTimeout = _props.onTimeout,
          owner = _props.owner,
          placeholder = _props.placeholder,
          required = _props.required,
          rows = _props.rows,
          rowsMax = _props.rowsMax,
          select = _props.select,
          SelectProps = _props.SelectProps,
          timeoutDelay = _props.timeoutDelay,
          type = _props.type,
          variant = _props.variant,
          other = _objectWithoutProperties(_props, ['autoComplete', 'autoFocus', 'children', 'className', 'defaultValue', 'error', 'FormHelperTextProps', 'fullWidth', 'helperText', 'id', 'InputLabelProps', 'inputProps', 'InputProps', 'inputRef', 'label', 'multiline', 'name', 'onBlur', 'onChange', 'onFocus', 'onTimeout', 'owner', 'placeholder', 'required', 'rows', 'rowsMax', 'select', 'SelectProps', 'timeoutDelay', 'type', 'variant']);

      (0, _warning2.default)(!select || Boolean(children), 'Material-UI: `children` must be passed when using the `TextField` component with `select`.');

      var InputMore = {};

      if (variant === 'outlined') {
        if (InputLabelProps && typeof InputLabelProps.shrink !== 'undefined') {
          InputMore.notched = InputLabelProps.shrink;
        }

        InputMore.labelWidth = this.labelNode && this.labelNode.offsetWidth || 0;
      }

      var value = this.props.value;
      if (!value && name && owner && owner.state) {
        value = owner.state[name];
      }

      var helperTextId = helperText && id ? id + '-helper-text' : undefined;
      var InputComponent = variantComponent[variant];
      var InputElement = _react2.default.createElement(InputComponent, _extends({
        'aria-describedby': helperTextId,
        autoComplete: autoComplete,
        autoFocus: autoFocus,
        defaultValue: defaultValue,
        fullWidth: fullWidth,
        multiline: multiline,
        name: name,
        rows: rows,
        rowsMax: rowsMax,
        type: type,
        value: value,
        id: id,
        inputRef: inputRef,
        onBlur: onBlur,
        onChange: this.handleOnChange,
        onFocus: onFocus,
        placeholder: placeholder,
        inputProps: inputProps
      }, InputMore, InputProps));

      return _react2.default.createElement(
        _FormControl2.default,
        _extends({
          className: className,
          error: error,
          fullWidth: fullWidth,
          required: required,
          variant: variant
        }, other),
        label && _react2.default.createElement(
          _InputLabel2.default,
          _extends({ htmlFor: id, ref: this.labelRef }, InputLabelProps),
          label
        ),
        select ? _react2.default.createElement(
          _Select2.default,
          _extends({
            'aria-describedby': helperTextId,
            value: value,
            input: InputElement
          }, SelectProps),
          children
        ) : InputElement,
        helperText && _react2.default.createElement(
          _FormHelperText2.default,
          _extends({ id: helperTextId }, FormHelperTextProps),
          helperText
        )
      );
    }
  }]);

  return TextField;
}(_react2.default.Component);

TextField.propTypes = {
  /**
   * This property helps users to fill forms faster, especially on mobile devices.
   * The name can be confusing, as it's more like an autofill.
   * You can learn more about it here:
   * https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill
   */
  autoComplete: _propTypes2.default.string,
  /**
   * If `true`, the input will be focused during the first mount.
   */
  autoFocus: _propTypes2.default.bool,
  /**
   * @ignore
   */
  children: _propTypes2.default.node,
  /**
   * @ignore
   */
  className: _propTypes2.default.string,
  /**
   * The default value of the `Input` element.
   */
  defaultValue: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]),
  /**
   * If `true`, the input will be disabled.
   */
  disabled: _propTypes2.default.bool,
  /**
   * If `true`, the label will be displayed in an error state.
   */
  error: _propTypes2.default.bool,
  /**
   * Properties applied to the [`FormHelperText`](/api/form-helper-text/) element.
   */
  FormHelperTextProps: _propTypes2.default.object,
  /**
   * If `true`, the input will take up the full width of its container.
   */
  fullWidth: _propTypes2.default.bool,
  /**
   * The helper text content.
   */
  helperText: _propTypes2.default.node,
  /**
   * The id of the `input` element.
   * Use this property to make `label` and `helperText` accessible for screen readers.
   */
  id: _propTypes2.default.string,
  /**
   * Properties applied to the [`InputLabel`](/api/input-label/) element.
   */
  InputLabelProps: _propTypes2.default.object,
  /**
   * Properties applied to the `Input` element.
   */
  InputProps: _propTypes2.default.object,
  /**
   * Attributes applied to the native `input` element.
   */
  inputProps: _propTypes2.default.object,
  /**
   * Use this property to pass a ref callback to the native input component.
   */
  inputRef: _propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes2.default.object]),
  /**
   * The label content.
   */
  label: _propTypes2.default.node,
  /**
   * If `dense` or `normal`, will adjust vertical spacing of this and contained components.
   */
  margin: _propTypes2.default.oneOf(['none', 'dense', 'normal']),
  /**
   * If `true`, a textarea element will be rendered instead of an input.
   */
  multiline: _propTypes2.default.bool,
  /**
   * Name attribute of the `input` element.
   */
  name: _propTypes2.default.string,
  /**
   * @ignore
   */
  onBlur: _propTypes2.default.func,
  /**
   * Callback fired when the value is changed.
   *
   * @param {object} event The event source of the callback.
   * You can pull out the new value by accessing `event.target.value`.
   */
  onChange: _propTypes2.default.func,
  /**
   * @ignore
   */
  onFocus: _propTypes2.default.func,
  /**
   * Callback fired when the timeout timer elapses.
   */
  onTimeout: _propTypes2.default.func,
  /**
   * Component to which this field is bound
   */
  owner: _propTypes2.default.object,
  /**
   * The short hint displayed in the input before the user enters a value.
   */
  placeholder: _propTypes2.default.string,
  /**
   * If `true`, the label is displayed as required and the input will be required.
   */
  required: _propTypes2.default.bool,
  /**
   * Number of rows to display when multiline option is set to true.
   */
  rows: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]),
  /**
   * Maximum number of rows to display when multiline option is set to true.
   */
  rowsMax: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]),
  /**
   * Render a `Select` element while passing the `Input` element to `Select` as `input` parameter.
   * If this option is set you must pass the options of the select as children.
   */
  select: _propTypes2.default.bool,
  /**
   * Properties applied to the [`Select`](/api/select/) element.
   */
  SelectProps: _propTypes2.default.object,
  /**
   * Number of seconds to wait before firing the onTimeout event
   */
  /**
   * State property to which this field is bound
   */
  stateKey: _propTypes2.default.string,
  /**
   * Number of milliseconds of inactivity before the onTimeout callback is invoked.
   */
  timeoutDelay: _propTypes2.default.number,
  /**
   * Type attribute of the `Input` element. It should be a valid HTML5 input type.
   */
  type: _propTypes2.default.string,
  /**
   * The value of the `Input` element, required for a controlled component.
   */
  value: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number, _propTypes2.default.bool, _propTypes2.default.arrayOf(_propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number, _propTypes2.default.bool]))]),
  /**
   * The variant to use.
   */
  variant: _propTypes2.default.oneOf(['standard', 'outlined', 'filled'])
};

TextField.defaultProps = {
  required: false,
  select: false,
  timeoutDelay: 0,
  variant: 'standard'
};

exports.default = TextField;