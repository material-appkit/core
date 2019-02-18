'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactIntlUniversal = require('react-intl-universal');

var _reactIntlUniversal2 = _interopRequireDefault(_reactIntlUniversal);

var _docs = require('docs.flowjs');

var _docs2 = _interopRequireDefault(_docs);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _Card = require('@material-ui/core/Card');

var _Card2 = _interopRequireDefault(_Card);

var _CardMedia = require('@material-ui/core/CardMedia');

var _CardMedia2 = _interopRequireDefault(_CardMedia);

var _CardContent = require('@material-ui/core/CardContent');

var _CardContent2 = _interopRequireDefault(_CardContent);

var _CardActions = require('@material-ui/core/CardActions');

var _CardActions2 = _interopRequireDefault(_CardActions);

var _IconButton = require('@material-ui/core/IconButton');

var _IconButton2 = _interopRequireDefault(_IconButton);

var _LinearProgress = require('@material-ui/core/LinearProgress');

var _LinearProgress2 = _interopRequireDefault(_LinearProgress);

var _RootRef = require('@material-ui/core/RootRef');

var _RootRef2 = _interopRequireDefault(_RootRef);

var _Tooltip = require('@material-ui/core/Tooltip');

var _Tooltip2 = _interopRequireDefault(_Tooltip);

var _Typography = require('@material-ui/core/Typography');

var _Typography2 = _interopRequireDefault(_Typography);

var _withStyles = require('@material-ui/core/styles/withStyles');

var _withStyles2 = _interopRequireDefault(_withStyles);

var _CloudUpload = require('@material-ui/icons/CloudUpload');

var _CloudUpload2 = _interopRequireDefault(_CloudUpload);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * FlowFileUploader
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */

var DEFAULT_CHUNK_SIZE = 1024 * 512; // 512Kb

var FlowFileUploader = function (_React$PureComponent) {
  _inherits(FlowFileUploader, _React$PureComponent);

  function FlowFileUploader(props) {
    var _this2 = this;

    _classCallCheck(this, FlowFileUploader);

    var _this = _possibleConstructorReturn(this, (FlowFileUploader.__proto__ || Object.getPrototypeOf(FlowFileUploader)).call(this, props));

    _this.handleReaderLoad = function (e) {
      _this.setState({ previewImage: e.target.result });
    };

    _this.handleImageLoad = function () {
      // When a source image is loaded, update the state with its content,
      // clear any preview that might be present, and reset the progress indicator.
      _this.setStatus('', null);
      _this.setState({
        mediaImage: _this.loader.src,
        previewImage: null
      });
    };

    _this.setStatus = function (status, progress) {
      var progressMode = null;
      if (progress === null) {
        progressMode = null;
      } else if (progress === undefined) {
        progressMode = 'indeterminate';
      } else {
        progressMode = 'determinate';
      }

      var progressPercentage = (progress || 0) * 100;

      _this.setState({
        status: status,
        progressPercentage: progressPercentage,
        progressMode: progressMode
      });

      if (_this.props.variant === 'image') {
        var gradientStart = Math.round(progressPercentage);
        var gradientEnd = 0;

        if (progress !== null) {
          gradientEnd = gradientStart + 5;

          var previewImageMask = _this.previewImageMask.current;
          if (_this.previewImageMask.current) {
            var gradient = '-webkit-mask-image: linear-gradient(to right, black ' + gradientStart + '%, transparent ' + gradientEnd + '%);';
            previewImageMask.setAttribute("style", gradient);
          }
        }
      }
    };

    _this.handleFileSubmit = function (files) {
      if (files.length !== 1) {
        throw new Error("Expecting a single file");
      }
      var flowFile = files[0];

      _this.setStatus(_reactIntlUniversal2.default.get('PREPARING') + '...', undefined);

      if (_this.reader) {
        _this.reader.readAsDataURL(flowFile.file);
      }

      // Begin the upload immediately
      flowFile.resume();
    };

    _this.handleFileProgress = function (file) {
      _this.setStatus(_reactIntlUniversal2.default.get('UPLOADING') + '...', file.progress());
    };

    _this.handleFileSuccess = function (file, message) {
      _this.setStatus(_reactIntlUniversal2.default.get('UPLOAD_COMPLETE') + '...', null);

      _this.flow.removeFile(file);

      if (_this.props.onComplete) {
        _this.props.onComplete(JSON.parse(message));
      }
    };

    _this.handleFileError = function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(file, message) {
        var errorContext;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!_this.props.onError) {
                  _this.flow.removeFile(file);
                  _this.setStatus('Error', null);
                }

                _context.next = 3;
                return _this.props.onError(message);

              case 3:
                errorContext = _context.sent;

                if (errorContext.retry === true) {
                  if (errorContext.headers) {
                    _this.flow.opts.headers = errorContext.headers;
                  }
                  file.retry();
                } else {
                  _this.flow.removeFile(file);
                  _this.setStatus('Error', null);
                }

              case 5:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, _this2);
      }));

      return function (_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }();

    _this.flow = new _docs2.default({
      chunkSize: props.chunkSize,
      headers: props.headers,
      maxChunkRetries: 0,
      simultaneousUploads: 1,
      singleFile: !props.multiple,
      target: props.uploadUrl,
      testChunks: false,
      query: props.query
    });

    if (!_this.flow.support) {
      throw new Error('Flow.js is not supported :/');
    }

    _this.state = {
      progressPercentage: null,
      progressMode: null,
      status: '',
      previewImage: null,
      mediaImage: props.defaultImage
    };

    _this.browseButtonRef = _react2.default.createRef();

    if (props.variant === 'image') {
      _this.previewImageMask = _react2.default.createRef();

      _this.reader = new FileReader();
      _this.reader.addEventListener("load", _this.handleReaderLoad, false);

      _this.loader = new Image();
      _this.loader.addEventListener("load", _this.handleImageLoad);
    }
    return _this;
  }

  _createClass(FlowFileUploader, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.flow.on('filesSubmitted', this.handleFileSubmit);
      this.flow.on('fileProgress', this.handleFileProgress);
      this.flow.on('fileSuccess', this.handleFileSuccess);
      this.flow.on('fileError', this.handleFileError);

      this.flow.assignBrowse(this.browseButtonRef.current, false, !this.props.multiple, this.props.attributes);

      if (this.props.variant === 'image' && this.props.defaultSrc) {
        // If a default image was supplied, load it now
        this.setStatus('Loading...', undefined);
        this.loader.src = this.props.defaultSrc;
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.flow.off();

      if (this.reader) {
        this.reader.removeEventListener("load", this.handleReaderLoad);
      }
      if (this.loader) {
        this.loader.removeEventListener("load", this.handleImageLoad);
      }
    }

    //----------------------------------------------------------------------
    // Handler that's invoked when a file has been set via browse or drop

  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          classes = _props.classes,
          UploadButtonIcon = _props.UploadButtonIcon,
          uploadButtonTooltip = _props.uploadButtonTooltip,
          variant = _props.variant;


      var uploadButton = _react2.default.createElement(
        _RootRef2.default,
        { rootRef: this.browseButtonRef },
        _react2.default.createElement(
          _Tooltip2.default,
          { title: uploadButtonTooltip },
          _react2.default.createElement(
            _IconButton2.default,
            { className: classes.uploadButton },
            _react2.default.createElement(UploadButtonIcon, null)
          )
        )
      );

      var progressBar = null;
      if (this.state.progressMode) {
        progressBar = _react2.default.createElement(_LinearProgress2.default, {
          className: classes.linearProgress,
          value: this.state.progressPercentage,
          variant: this.state.progressMode
        });
      }

      var content = null;
      if (variant === 'inline') {
        content = _react2.default.createElement(
          'div',
          { className: classes.inlineContainer },
          uploadButton,
          progressBar
        );
      } else if (variant === 'image') {
        content = _react2.default.createElement(
          _Card2.default,
          null,
          !this.state.previewImage && _react2.default.createElement(_CardMedia2.default, { className: classes.cardMedia, image: this.state.mediaImage }),
          _react2.default.createElement(
            _CardContent2.default,
            { className: classes.cardContent },
            this.state.previewImage && _react2.default.createElement(
              'div',
              { className: classes.previewImageContainer },
              _react2.default.createElement('img', {
                alt: 'Preview',
                className: (0, _classnames2.default)(classes.previewImage, classes.previewImageGreyscale),
                src: this.state.previewImage
              }),
              _react2.default.createElement('img', {
                alt: 'Preview Gradient Mask',
                className: (0, _classnames2.default)(classes.previewImage, classes.previewImageMask),
                src: this.state.previewImage,
                ref: this.previewImageMask
              })
            ),
            progressBar
          ),
          _react2.default.createElement(
            _CardActions2.default,
            { className: classes.cardActions, disableActionSpacing: true },
            uploadButton,
            _react2.default.createElement(
              _Typography2.default,
              null,
              this.state.status
            )
          )
        );
      }

      return _react2.default.createElement(
        'div',
        { className: classes.root },
        content
      );
    }
  }]);

  return FlowFileUploader;
}(_react2.default.PureComponent);

FlowFileUploader.propTypes = {
  attributes: _propTypes2.default.object,
  chunkSize: _propTypes2.default.number,
  classes: _propTypes2.default.object.isRequired,
  defaultImage: _propTypes2.default.any,
  defaultSrc: _propTypes2.default.string,
  headers: _propTypes2.default.object,
  multiple: _propTypes2.default.bool,
  onError: _propTypes2.default.func,
  onComplete: _propTypes2.default.func,
  query: _propTypes2.default.object,
  uploadUrl: _propTypes2.default.string.isRequired,
  uploadButtonTooltip: _propTypes2.default.string,
  UploadButtonIcon: _propTypes2.default.func,
  variant: _propTypes2.default.oneOf(['inline', 'image'])
};

FlowFileUploader.defaultProps = {
  attributes: {},
  chunkSize: DEFAULT_CHUNK_SIZE,
  headers: {},
  multiple: false,
  query: {},
  uploadButtonTooltip: 'Upload',
  UploadButtonIcon: _CloudUpload2.default,
  variant: 'inline'
};

exports.default = (0, _withStyles2.default)(function (theme) {
  return {
    // --------------------------------------------------------------------------
    root: {
      flexGrow: 1
    },

    // Variant: any
    linearProgress: {
      flexGrow: 1
    },

    uploadButton: {
      padding: 4
    },

    // --------------------------------------------------------------------------
    // Variant: inline
    inlineContainer: {
      alignItems: 'center',
      display: 'flex'
    },

    // --------------------------------------------------------------------------
    // Variant: image
    previewImageContainer: {
      height: 250,
      borderRadius: 4,
      marginBottom: theme.spacing.unit * 2,
      overflow: 'hidden',
      position: 'relative'
    },

    previewImage: {
      height: '100%',
      objectFit: 'cover',
      position: 'absolute',
      width: '100%'
    },

    previewImageGreyscale: {
      filter: 'grayscale(100%)'
    },

    previewImageMask: {
      maskImage: 'linear-gradient(to right, black 0%, transparent 0%)'
    },

    cardMedia: {
      borderRadius: 4,
      height: 250,
      margin: '16px 16px 0'
    },

    cardContent: {
      paddingBottom: 0
    },

    cardActions: {
      paddingTop: 0
    }
  };
})(FlowFileUploader);