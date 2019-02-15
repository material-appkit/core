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

var _Card = require('@material-ui/core/Card');

var _Card2 = _interopRequireDefault(_Card);

var _CardHeader = require('@material-ui/core/CardHeader');

var _CardHeader2 = _interopRequireDefault(_CardHeader);

var _CardContent = require('@material-ui/core/CardContent');

var _CardContent2 = _interopRequireDefault(_CardContent);

var _IconButton = require('@material-ui/core/IconButton');

var _IconButton2 = _interopRequireDefault(_IconButton);

var _withStyles = require('@material-ui/core/styles/withStyles');

var _withStyles2 = _interopRequireDefault(_withStyles);

var _Edit = require('@material-ui/icons/Edit');

var _Edit2 = _interopRequireDefault(_Edit);

var _Check = require('@material-ui/icons/Check');

var _Check2 = _interopRequireDefault(_Check);

var _Form = require('./Form');

var _Form2 = _interopRequireDefault(_Form);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * DataCard
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */

var DataCard = function (_React$PureComponent) {
  _inherits(DataCard, _React$PureComponent);

  function DataCard() {
    var _ref,
        _this2 = this;

    var _temp, _this, _ret;

    _classCallCheck(this, DataCard);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = DataCard.__proto__ || Object.getPrototypeOf(DataCard)).call.apply(_ref, [this].concat(args))), _this), _this.formRef = _react2.default.createRef(), _this.state = {
      mode: 'view'
    }, _this.toggleMode = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var currentMode, newMode, shouldToggleView, record;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              currentMode = _this.state.mode;
              newMode = currentMode === 'view' ? 'edit' : 'view';
              shouldToggleView = true;

              if (!(currentMode === 'edit' && newMode === 'view')) {
                _context.next = 9;
                break;
              }

              if (!_this.formRef.current) {
                _context.next = 9;
                break;
              }

              _context.next = 7;
              return _this.formRef.current.save();

            case 7:
              record = _context.sent;

              if (!record) {
                shouldToggleView = false;
              }

            case 9:

              if (shouldToggleView) {
                _this.setState({ mode: newMode });
              }

            case 10:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this2);
    })), _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(DataCard, [{
    key: 'render',
    value: function render() {
      var _this3 = this;

      var classes = this.props.classes;


      return _react2.default.createElement(
        _Card2.default,
        null,
        _react2.default.createElement(_CardHeader2.default, {
          action: _react2.default.createElement(
            _IconButton2.default,
            {
              color: 'primary',
              onClick: function onClick() {
                _this3.toggleMode();
              }
            },
            this.state.mode === 'view' ? _react2.default.createElement(_Edit2.default, { fontSize: 'small' }) : _react2.default.createElement(_Check2.default, { fontSize: 'small' })
          ),
          classes: {
            action: classes.cardHeaderAction,
            root: classes.cardHeaderRoot,
            title: classes.cardHeaderTitle
          },
          title: this.props.title
        }),
        _react2.default.createElement(
          _CardContent2.default,
          null,
          this.activeView
        )
      );
    }
  }, {
    key: 'activeView',
    get: function get() {
      var children = _react2.default.Children.toArray(this.props.children);
      var childCount = children.length;
      if (childCount < 1 || 2 < childCount) {
        throw new Error("A DataCard may only have ONE or TWO children");
      }

      if (childCount === 2) {
        return this.state.mode === 'view' ? children[0] : children[1];
      }

      if (this.state.mode === 'edit' && this.props.formConfig) {
        return _react2.default.createElement(_Form2.default, _extends({ innerRef: this.formRef }, this.props.formConfig));
      }
      // If there is a single child, allow it to manage its own presentation
      // via a given 'mode' prop.
      return _react2.default.cloneElement(children[0], {
        mode: this.state.mode
      });
    }
  }]);

  return DataCard;
}(_react2.default.PureComponent);

DataCard.propTypes = {
  children: _propTypes2.default.oneOfType([_propTypes2.default.element, _propTypes2.default.array]),
  classes: _propTypes2.default.object.isRequired,
  formConfig: _propTypes2.default.object,
  title: _propTypes2.default.string
};

exports.default = (0, _withStyles2.default)({
  cardHeaderAction: {
    marginTop: 0
  },

  cardHeaderRoot: {
    backgroundColor: '#fafafa',
    padding: '2px 16px'
  },

  cardHeaderTitle: {
    fontSize: '1.1rem',
    fontWeight: 500
  }
})(DataCard);