'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _styles = require('@material-ui/core/styles');

var _useMediaQuery = require('@material-ui/core/useMediaQuery');

var _useMediaQuery2 = _interopRequireDefault(_useMediaQuery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var styles = (0, _styles.makeStyles)({
  splitView: {
    width: '100%',
    height: '100%',
    position: 'relative'
  },

  bar: {
    // position: 'absolute',
  },

  content: {
    // position: 'absolute',
  }
});

function SplitView(props) {
  var bar = props.bar,
      barSize = props.barSize,
      breakpoint = props.breakpoint,
      children = props.children,
      placement = props.placement;


  var classes = styles();
  var theme = (0, _styles.useTheme)();

  var matches = true;
  if (breakpoint) {
    matches = (0, _useMediaQuery2.default)(theme.breakpoints.up(breakpoint));
  }

  var splitViewStyles = {};
  var barStyles = {};
  var contentStyles = {};

  switch (placement) {
    case 'top':
      Object.assign(barStyles, {
        top: 0,
        right: 0,
        left: 0,
        height: barSize,
        position: 'absolute'
      });
      Object.assign(contentStyles, {
        top: barSize,
        right: 0,
        bottom: 0,
        left: 0,
        position: 'absolute'
      });
      break;
    case 'bottom':
      break;
    case 'left':
      if (matches) {
        Object.assign(barStyles, {
          top: 0,
          left: 0,
          bottom: 0,
          width: barSize,
          position: 'absolute'
        });
        Object.assign(contentStyles, {
          top: 0,
          right: 0,
          left: barSize,
          bottom: 0,
          position: 'absolute'
        });
      } else {}
      break;
    case 'right':
      if (matches) {
        Object.assign(barStyles, {
          position: 'absolute',
          top: 0,
          width: barSize,
          bottom: 0,
          right: 0
        });
        Object.assign(contentStyles, {
          position: 'absolute',
          top: 0,
          left: 0,
          right: barSize,
          bottom: 0
        });
      } else {}
      break;
  }

  return _react2.default.createElement(
    'div',
    { className: classes.splitView, style: splitViewStyles },
    _react2.default.createElement(
      'div',
      { style: barStyles },
      bar
    ),
    _react2.default.createElement(
      'div',
      { style: contentStyles },
      children
    )
  );
}

SplitView.propTypes = {
  bar: _propTypes2.default.object.isRequired,
  barSize: _propTypes2.default.number.isRequired,
  breakpoint: _propTypes2.default.oneOf(['xs', 'sm', 'md', 'lg']),
  classes: _propTypes2.default.object,
  placement: _propTypes2.default.oneOf(['top', 'right', 'bottom', 'left'])
};

exports.default = SplitView;