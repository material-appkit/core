// @inheritedComponent FormControl

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import Input from '@material-ui/core/Input';
import FilledInput from '@material-ui/core/FilledInput';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';

const variantComponent = {
  standard: Input,
  filled: FilledInput,
  outlined: OutlinedInput,
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
class TextField extends React.Component {
  constructor(props) {
    super(props);

    this.labelRef = React.createRef();
    this.delayedChangeTimer = null;
  }

  componentDidMount() {
    if (this.props.variant === 'outlined') {
      this.labelNode = ReactDOM.findDOMNode(this.labelRef.current);
      this.forceUpdate();
    }
  }

  handleOnChange = (e) => {
    const {
      name,
      onChange,
      onTimeout,
      owner,
      timeoutDelay
    } = this.props;

    const value = e.target.value;

    if (name && owner && owner.setState) {
      owner.setState({ [name]: value });
    }

    if (onChange) {
      onChange(e);
    }

    if (!onTimeout) {
      // If there's no change handler there's no need for action.
      return;
    }

    if (timeoutDelay) {
      if (this.delayedChangeTimer) {
        clearTimeout(this.delayedChangeTimer);
      }

      this.delayedChangeTimer = setTimeout(() => {
        onTimeout(value);
      }, timeoutDelay);
    } else {
      // If this TextField has no change delay, simply pass the event on to its listener
      onTimeout(value);
    }
  };

  render() {
    const {
      autoComplete,
      autoFocus,
      children,
      className,
      defaultValue,
      error,
      FormHelperTextProps,
      fullWidth,
      helperText,
      id,
      InputLabelProps,
      inputProps,
      InputProps,
      inputRef,
      label,
      multiline,
      name,
      onBlur,
      onChange,
      onFocus,
      onTimeout,
      owner,
      placeholder,
      required,
      rows,
      rowsMax,
      select,
      SelectProps,
      timeoutDelay,
      type,
      variant,
      ...other
    } = this.props;


    const InputMore = {};

    if (variant === 'outlined') {
      if (InputLabelProps && typeof InputLabelProps.shrink !== 'undefined') {
        InputMore.notched = InputLabelProps.shrink;
      }

      InputMore.labelWidth = (this.labelNode && this.labelNode.offsetWidth) || 0;
    }

    let value = this.props.value;
    if (!value && name && owner && owner.state) {
      value = owner.state[name];
    }

    const helperTextId = helperText && id ? `${id}-helper-text` : undefined;
    const InputComponent = variantComponent[variant];
    const InputElement = (
      <InputComponent
        aria-describedby={helperTextId}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        defaultValue={defaultValue}
        fullWidth={fullWidth}
        multiline={multiline}
        name={name}
        rows={rows}
        rowsMax={rowsMax}
        type={type}
        value={value}
        id={id}
        inputRef={inputRef}
        onBlur={onBlur}
        onChange={this.handleOnChange}
        onFocus={onFocus}
        placeholder={placeholder}
        inputProps={inputProps}
        {...InputMore}
        {...InputProps}
      />
    );

    return (
      <FormControl
        className={className}
        error={error}
        fullWidth={fullWidth}
        required={required}
        variant={variant}
        {...other}
      >
        {label && (
          <InputLabel htmlFor={id} ref={this.labelRef} {...InputLabelProps}>
            {label}
          </InputLabel>
        )}
        {select ? (
          <Select
            aria-describedby={helperTextId}
            value={value}
            input={InputElement}
            {...SelectProps}
          >
            {children}
          </Select>
        ) : (
          InputElement
        )}
        {helperText && (
          <FormHelperText id={helperTextId} {...FormHelperTextProps}>
            {helperText}
          </FormHelperText>
        )}
      </FormControl>
    );
  }
}

TextField.propTypes = {
  /**
   * This property helps users to fill forms faster, especially on mobile devices.
   * The name can be confusing, as it's more like an autofill.
   * You can learn more about it here:
   * https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill
   */
  autoComplete: PropTypes.string,
  /**
   * If `true`, the input will be focused during the first mount.
   */
  autoFocus: PropTypes.bool,
  /**
   * @ignore
   */
  children: PropTypes.node,
  /**
   * @ignore
   */
  className: PropTypes.string,
  /**
   * The default value of the `Input` element.
   */
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /**
   * If `true`, the input will be disabled.
   */
  disabled: PropTypes.bool,
  /**
   * If `true`, the label will be displayed in an error state.
   */
  error: PropTypes.bool,
  /**
   * Properties applied to the [`FormHelperText`](/api/form-helper-text/) element.
   */
  FormHelperTextProps: PropTypes.object,
  /**
   * If `true`, the input will take up the full width of its container.
   */
  fullWidth: PropTypes.bool,
  /**
   * The helper text content.
   */
  helperText: PropTypes.node,
  /**
   * The id of the `input` element.
   * Use this property to make `label` and `helperText` accessible for screen readers.
   */
  id: PropTypes.string,
  /**
   * Properties applied to the [`InputLabel`](/api/input-label/) element.
   */
  InputLabelProps: PropTypes.object,
  /**
   * Properties applied to the `Input` element.
   */
  InputProps: PropTypes.object,
  /**
   * Attributes applied to the native `input` element.
   */
  inputProps: PropTypes.object,
  /**
   * Use this property to pass a ref callback to the native input component.
   */
  inputRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  /**
   * The label content.
   */
  label: PropTypes.node,
  /**
   * If `dense` or `normal`, will adjust vertical spacing of this and contained components.
   */
  margin: PropTypes.oneOf(['none', 'dense', 'normal']),
  /**
   * If `true`, a textarea element will be rendered instead of an input.
   */
  multiline: PropTypes.bool,
  /**
   * Name attribute of the `input` element.
   */
  name: PropTypes.string,
  /**
   * @ignore
   */
  onBlur: PropTypes.func,
  /**
   * Callback fired when the value is changed.
   *
   * @param {object} event The event source of the callback.
   * You can pull out the new value by accessing `event.target.value`.
   */
  onChange: PropTypes.func,
  /**
   * @ignore
   */
  onFocus: PropTypes.func,
  /**
   * Callback fired when the timeout timer elapses.
   */
  onTimeout: PropTypes.func,
  /**
   * Component to which this field is bound
   */
  owner: PropTypes.object,
  /**
   * The short hint displayed in the input before the user enters a value.
   */
  placeholder: PropTypes.string,
  /**
   * If `true`, the label is displayed as required and the input will be required.
   */
  required: PropTypes.bool,
  /**
   * Number of rows to display when multiline option is set to true.
   */
  rows: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /**
   * Maximum number of rows to display when multiline option is set to true.
   */
  rowsMax: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /**
   * Render a `Select` element while passing the `Input` element to `Select` as `input` parameter.
   * If this option is set you must pass the options of the select as children.
   */
  select: PropTypes.bool,
  /**
   * Properties applied to the [`Select`](/api/select/) element.
   */
  SelectProps: PropTypes.object,
  /**
   * Number of seconds to wait before firing the onTimeout event
   */
  /**
   * State property to which this field is bound
   */
  stateKey: PropTypes.string,
  /**
   * Number of milliseconds of inactivity before the onTimeout callback is invoked.
   */
  timeoutDelay: PropTypes.number,
  /**
   * Type attribute of the `Input` element. It should be a valid HTML5 input type.
   */
  type: PropTypes.string,
  /**
   * The value of the `Input` element, required for a controlled component.
   */
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool])),
  ]),
  /**
   * The variant to use.
   */
  variant: PropTypes.oneOf(['standard', 'outlined', 'filled']),
};

TextField.defaultProps = {
  required: false,
  select: false,
  timeoutDelay: 0,
  variant: 'standard',
};

export default TextField;
