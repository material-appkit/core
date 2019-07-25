'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         * DataCard
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         */

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

var _styles = require('@material-ui/core/styles');

var _Edit = require('@material-ui/icons/Edit');

var _Edit2 = _interopRequireDefault(_Edit);

var _Check = require('@material-ui/icons/Check');

var _Check2 = _interopRequireDefault(_Check);

var _component = require('../util/component');

var _Form = require('./Form');

var _Form2 = _interopRequireDefault(_Form);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var styles = (0, _styles.makeStyles)(function (theme) {
  return theme.dataCard;
});

function DataCard(props) {
  var _this = this;

  var _useState = (0, _react.useState)('view'),
      _useState2 = _slicedToArray(_useState, 2),
      mode = _useState2[0],
      setMode = _useState2[1];

  var classes = styles();

  var formRef = (0, _react.useRef)(null);

  var toggleMode = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var newMode, shouldToggleView, record;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              newMode = mode === 'view' ? 'edit' : 'view';
              shouldToggleView = true;

              if (!(mode === 'edit' && newMode === 'view')) {
                _context.next = 8;
                break;
              }

              if (!formRef.current) {
                _context.next = 8;
                break;
              }

              _context.next = 6;
              return formRef.current.save();

            case 6:
              record = _context.sent;

              if (!record) {
                shouldToggleView = false;
              }

            case 8:

              if (shouldToggleView) {
                setMode(newMode);
              }

            case 9:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this);
    }));

    return function toggleMode() {
      return _ref.apply(this, arguments);
    };
  }();

  var getActiveView = function getActiveView() {
    var children = _react2.default.Children.toArray(props.children);
    var childCount = children.length;
    if (childCount < 1 || 2 < childCount) {
      throw new Error("A DataCard may only have ONE or TWO children");
    }

    if (childCount === 2) {
      return mode === 'view' ? children[0] : children[1];
    }

    if (mode === 'edit' && props.formConfig) {
      return _react2.default.createElement(_Form2.default, _extends({ innerRef: formRef }, props.formConfig));
    }
    // If there is a single child, allow it to manage its own presentation
    // via a given 'mode' prop.
    return (0, _component.recursiveMap)(children[0], function (child) {
      return _react2.default.cloneElement(child, { mode: mode });
    }, 2);
  };

  var variant = props.variant;


  var cardProps = {};

  var cardHeaderClasses = {
    root: classes.cardHeaderRoot,
    action: classes.cardHeaderAction,
    title: classes.cardHeaderTitle
  };

  if (variant === 'plain') {
    cardProps.elevation = 0;
    cardHeaderClasses.root = classes.plainCardHeaderRoot;
  }

  return _react2.default.createElement(
    _Card2.default,
    cardProps,
    _react2.default.createElement(_CardHeader2.default, {
      action: _react2.default.createElement(
        _IconButton2.default,
        {
          classes: { root: classes.modeToggleButton },
          color: 'primary',
          onClick: toggleMode
        },
        mode === 'view' ? _react2.default.createElement(_Edit2.default, { fontSize: 'small' }) : _react2.default.createElement(_Check2.default, { fontSize: 'small' })
      ),
      classes: cardHeaderClasses,
      title: props.title
    }),
    _react2.default.createElement(
      _CardContent2.default,
      { classes: { root: classes.cardContentRoot } },
      getActiveView()
    )
  );
}

DataCard.propTypes = {
  children: _propTypes2.default.oneOfType([_propTypes2.default.element, _propTypes2.default.array]),
  formConfig: _propTypes2.default.object,
  title: _propTypes2.default.string,
  variant: _propTypes2.default.oneOf(['card', 'plain'])
};

DataCard.defaultProps = {
  variant: 'card'
};

exports.default = DataCard;