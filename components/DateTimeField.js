'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _moment3 = require('@date-io/moment');

var _moment4 = _interopRequireDefault(_moment3);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _FormControl = require('@material-ui/core/FormControl');

var _FormControl2 = _interopRequireDefault(_FormControl);

var _withStyles = require('@material-ui/core/styles/withStyles');

var _withStyles2 = _interopRequireDefault(_withStyles);

var _materialUiPickers = require('material-ui-pickers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * ItemListField
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */

var DateTimeField = function (_React$PureComponent) {
  _inherits(DateTimeField, _React$PureComponent);

  function DateTimeField(props) {
    _classCallCheck(this, DateTimeField);

    var _this = _possibleConstructorReturn(this, (DateTimeField.__proto__ || Object.getPrototypeOf(DateTimeField)).call(this, props));

    _this.handleDateChange = function (value) {
      _this.setState({ selectedDate: value });

      if (_this.props.onChange) {
        _this.props.onChange(value);
      }
    };

    var selectedDate = null;
    if (props.value) {
      selectedDate = props.value;
      if (typeof selectedDate === 'string') {
        selectedDate = (0, _moment2.default)(selectedDate);
      }
    }
    // TODO: Let the timezone be an optional property?
    _this.state = {
      selectedDate: selectedDate
    };
    return _this;
  }

  _createClass(DateTimeField, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          classes = _props.classes,
          label = _props.label;


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
            _materialUiPickers.MuiPickersUtilsProvider,
            { utils: _moment4.default },
            _react2.default.createElement(_materialUiPickers.DateTimePicker, {
              autoOk: true,
              value: this.state.selectedDate,
              onChange: this.handleDateChange
            })
          )
        )
      );
    }
  }]);

  return DateTimeField;
}(_react2.default.PureComponent);

DateTimeField.propTypes = {
  classes: _propTypes2.default.object.isRequired,
  label: _propTypes2.default.string,
  value: _propTypes2.default.any
};

DateTimeField.defaultProps = {};

exports.default = (0, _withStyles2.default)(function (theme) {
  return {
    fieldset: theme.form.customControl.fieldset,
    legend: theme.form.customControl.legend
  };
})(DateTimeField);