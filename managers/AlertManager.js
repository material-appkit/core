'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _mobx = require('mobx');

var _mobxReact = require('mobx-react');

var _Button = require('@material-ui/core/Button');

var _Button2 = _interopRequireDefault(_Button);

var _Dialog = require('@material-ui/core/Dialog');

var _Dialog2 = _interopRequireDefault(_Dialog);

var _DialogActions = require('@material-ui/core/DialogActions');

var _DialogActions2 = _interopRequireDefault(_DialogActions);

var _DialogContent = require('@material-ui/core/DialogContent');

var _DialogContent2 = _interopRequireDefault(_DialogContent);

var _DialogContentText = require('@material-ui/core/DialogContentText');

var _DialogContentText2 = _interopRequireDefault(_DialogContentText);

var _DialogTitle = require('@material-ui/core/DialogTitle');

var _DialogTitle2 = _interopRequireDefault(_DialogTitle);

var _TextField = require('@material-ui/core/TextField');

var _TextField2 = _interopRequireDefault(_TextField);

var _withStyles = require('@material-ui/core/styles/withStyles');

var _withStyles2 = _interopRequireDefault(_withStyles);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * AlertManager
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */

var AlertManager = function (_React$Component) {
  _inherits(AlertManager, _React$Component);

  function AlertManager() {
    _classCallCheck(this, AlertManager);

    return _possibleConstructorReturn(this, (AlertManager.__proto__ || Object.getPrototypeOf(AlertManager)).apply(this, arguments));
  }

  _createClass(AlertManager, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        _react.Fragment,
        null,
        this.dialogs
      );
    }
  }, {
    key: 'dialogs',
    get: function get() {
      var _this2 = this;

      var dialogs = [];
      AlertManager.queue.forEach(function (alertInfo, key) {
        var alertType = alertInfo.ALERT_TYPE;
        var commitValue = true;

        var promptField = null;
        if (alertType === 'prompt') {
          var promptFieldRef = _react2.default.createRef();
          promptField = _react2.default.createElement(_TextField2.default, {
            autoFocus: true,
            inputRef: promptFieldRef,
            margin: 'dense',
            label: alertInfo.label,
            fullWidth: true
          });
          commitValue = function commitValue() {
            return promptFieldRef.current.value;
          };
        }

        dialogs.push(_react2.default.createElement(
          _Dialog2.default,
          {
            key: key,
            fullWidth: true,
            maxWidth: 'sm',
            open: true,
            onClose: _this2.handleClose,
            'aria-labelledby': 'alert-dialog-title',
            'aria-describedby': 'alert-dialog-description'
          },
          _react2.default.createElement(
            _DialogTitle2.default,
            { id: 'alert-dialog-title' },
            alertInfo.title
          ),
          _react2.default.createElement(
            _DialogContent2.default,
            null,
            alertInfo.description && _react2.default.createElement(
              _DialogContentText2.default,
              { id: 'alert-dialog-description' },
              alertInfo.description
            ),
            promptField
          ),
          _react2.default.createElement(
            _DialogActions2.default,
            null,
            alertInfo.ALERT_TYPE !== 'info' && _react2.default.createElement(
              _Button2.default,
              { onClick: function onClick() {
                  AlertManager.dismiss(key, false);
                } },
              alertInfo.cancelButtonTitle || 'Cancel'
            ),
            _react2.default.createElement(
              _Button2.default,
              { onClick: function onClick() {
                  AlertManager.dismiss(key, commitValue);
                }, color: 'primary' },
              alertInfo.confirmButtonTitle || 'OK'
            )
          )
        ));
      });
      return dialogs;
    }
  }], [{
    key: 'alert',
    value: function alert(alertInfo, type) {
      alertInfo.ALERT_TYPE = type;
      var key = new Date().getTime();
      this.queue.set(key, alertInfo);
    }
  }, {
    key: 'info',
    value: function info(alertInfo) {
      this.alert(alertInfo, 'info');
    }
  }, {
    key: 'confirm',
    value: function confirm(alertInfo) {
      this.alert(alertInfo, 'confirm');
    }
  }, {
    key: 'prompt',
    value: function prompt(alertInfo) {
      this.alert(alertInfo, 'prompt');
    }
  }, {
    key: 'dismiss',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(key, value) {
        var alertInfo, returnValue;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                alertInfo = this.queue.get(key);

                if (!alertInfo.onDismiss) {
                  _context.next = 6;
                  break;
                }

                returnValue = value;

                if (typeof returnValue === 'function') {
                  returnValue = returnValue();
                }
                _context.next = 6;
                return alertInfo.onDismiss(returnValue);

              case 6:
                this.queue.delete(key);

              case 7:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function dismiss(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return dismiss;
    }()
  }]);

  return AlertManager;
}(_react2.default.Component);

AlertManager.queue = _mobx.observable.map();


AlertManager.propTypes = {
  classes: _propTypes2.default.object.isRequired
};

exports.default = (0, _withStyles2.default)({})((0, _mobxReact.observer)(AlertManager));