'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _mobx = require('mobx');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _CheckCircle = require('@material-ui/icons/CheckCircle');

var _CheckCircle2 = _interopRequireDefault(_CheckCircle);

var _Error = require('@material-ui/icons/Error');

var _Error2 = _interopRequireDefault(_Error);

var _Info = require('@material-ui/icons/Info');

var _Info2 = _interopRequireDefault(_Info);

var _Close = require('@material-ui/icons/Close');

var _Close2 = _interopRequireDefault(_Close);

var _blue = require('@material-ui/core/colors/blue');

var _blue2 = _interopRequireDefault(_blue);

var _green = require('@material-ui/core/colors/green');

var _green2 = _interopRequireDefault(_green);

var _amber = require('@material-ui/core/colors/amber');

var _amber2 = _interopRequireDefault(_amber);

var _IconButton = require('@material-ui/core/IconButton');

var _IconButton2 = _interopRequireDefault(_IconButton);

var _Snackbar = require('@material-ui/core/Snackbar');

var _Snackbar2 = _interopRequireDefault(_Snackbar);

var _SnackbarContent = require('@material-ui/core/SnackbarContent');

var _SnackbarContent2 = _interopRequireDefault(_SnackbarContent);

var _Warning = require('@material-ui/icons/Warning');

var _Warning2 = _interopRequireDefault(_Warning);

var _styles = require('@material-ui/core/styles');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

//------------------------------------------------------------------------------
var variantIcon = {
  success: _CheckCircle2.default,
  warning: _Warning2.default,
  error: _Error2.default,
  info: _Info2.default
};

function MessageSnackbarContent(props) {
  var classes = props.classes,
      className = props.className,
      message = props.message,
      onClose = props.onClose,
      variant = props.variant,
      other = _objectWithoutProperties(props, ['classes', 'className', 'message', 'onClose', 'variant']);

  var Icon = variantIcon[variant];

  return _react2.default.createElement(_SnackbarContent2.default, _extends({
    className: (0, _classnames2.default)(classes[variant], className),
    'aria-describedby': 'client-snackbar',
    message: _react2.default.createElement(
      'span',
      { id: 'client-snackbar', className: classes.message },
      _react2.default.createElement(Icon, { className: (0, _classnames2.default)(classes.icon, classes.iconVariant) }),
      message
    ),
    action: [_react2.default.createElement(
      _IconButton2.default,
      {
        key: 'close',
        'aria-label': 'Close',
        color: 'inherit',
        className: classes.close,
        onClick: onClose
      },
      _react2.default.createElement(_Close2.default, { className: classes.icon })
    )]
  }, other));
}

MessageSnackbarContent.propTypes = {
  classes: _propTypes2.default.object.isRequired,
  className: _propTypes2.default.string,
  message: _propTypes2.default.node,
  onClose: _propTypes2.default.func,
  variant: _propTypes2.default.oneOf(['success', 'warning', 'error', 'info']).isRequired
};

var MessageSnackbarContentWrapper = (0, _styles.withStyles)(function (theme) {
  return {
    success: {
      backgroundColor: _green2.default[600]
    },
    error: {
      backgroundColor: theme.palette.error.dark
    },
    info: {
      backgroundColor: _blue2.default[400]
    },
    warning: {
      backgroundColor: _amber2.default[700]
    },
    icon: {
      fontSize: 20
    },
    iconVariant: {
      opacity: 0.9,
      marginRight: theme.spacing(1)
    },
    message: {
      display: 'flex',
      alignItems: 'center'
    }
  };
})(MessageSnackbarContent);

//------------------------------------------------------------------------------

var SnackbarManager = function (_React$PureComponent) {
  _inherits(SnackbarManager, _React$PureComponent);

  function SnackbarManager() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, SnackbarManager);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = SnackbarManager.__proto__ || Object.getPrototypeOf(SnackbarManager)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      isOpen: false,
      messageInfo: {}
    }, _this.handleQueueChange = function (changeInfo) {
      if (changeInfo.addedCount) {
        if (_this.state.isOpen) {
          // immediately begin dismissing current message
          // to start showing new one
          _this.setState({ isOpen: false });
        } else {
          _this.processQueue();
        }
      }
    }, _this.processQueue = function () {
      if (SnackbarManager.queue.length > 0) {
        _this.setState({
          messageInfo: SnackbarManager.queue.shift(),
          isOpen: true
        });
      }
    }, _this.handleClose = function (event, reason) {
      if (reason === 'clickaway') {
        return;
      }
      _this.setState({ isOpen: false });
    }, _this.handleExited = function () {
      _this.processQueue();
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(SnackbarManager, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.observeQueueDisposer = SnackbarManager.queue.observe(this.handleQueueChange);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.observeQueueDisposer();
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        _Snackbar2.default,
        {
          key: this.state.messageInfo.key,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center'
          },
          open: this.state.isOpen,
          autoHideDuration: 3000,
          onClose: this.handleClose,
          onExited: this.handleExited
        },
        _react2.default.createElement(MessageSnackbarContentWrapper, {
          variant: this.state.messageInfo.variant,
          className: this.props.classes.margin,
          message: this.state.messageInfo.message,
          onClose: this.handleClose
        })
      );
    }
  }], [{
    key: 'addMessage',
    value: function addMessage(messageInfo) {
      this.queue.push(_extends({
        key: new Date().getTime()
      }, messageInfo));
    }
  }, {
    key: 'success',
    value: function success(message) {
      this.addMessage({ message: message, variant: 'success' });
    }
  }, {
    key: 'info',
    value: function info(message) {
      this.addMessage({ message: message, variant: 'info' });
    }
  }, {
    key: 'warning',
    value: function warning(message) {
      this.addMessage({ message: message, variant: 'warning' });
    }
  }, {
    key: 'error',
    value: function error(err, defaultMessage) {
      var message = defaultMessage;
      if (typeof err === 'string') {
        message = err;
      } else {
        // // TODO: Construct an error from the response body
        // if (err.response && err.response.body) {
        //   console.log(err.response.body);
        // }
      }
      this.addMessage({ message: message, variant: 'error' });
    }
  }]);

  return SnackbarManager;
}(_react2.default.PureComponent);

SnackbarManager.queue = _mobx.observable.array();


SnackbarManager.propTypes = {
  classes: _propTypes2.default.object.isRequired
};

exports.default = (0, _styles.withStyles)(function (theme) {
  return {
    close: {
      padding: theme.spacing(2)
    }
  };
})(SnackbarManager);