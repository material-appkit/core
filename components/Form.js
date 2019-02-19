'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash.isequal');

var _lodash2 = _interopRequireDefault(_lodash);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _CircularProgress = require('@material-ui/core/CircularProgress');

var _CircularProgress2 = _interopRequireDefault(_CircularProgress);

var _withStyles = require('@material-ui/core/styles/withStyles');

var _withStyles2 = _interopRequireDefault(_withStyles);

var _util = require('../util');

var _array = require('../util/array');

var _component = require('../util/component');

var _form = require('../util/form');

var _urls = require('../util/urls');

var _FormFieldSet = require('./FormFieldSet');

var _FormFieldSet2 = _interopRequireDefault(_FormFieldSet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Form = function (_React$PureComponent) {
  _inherits(Form, _React$PureComponent);

  function Form(props) {
    _classCallCheck(this, Form);

    var _this = _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).call(this, props));

    _initialiseProps.call(_this);

    _this.state = {
      errors: {},
      referenceObject: null,
      metadata: null,
      loading: false,
      saving: false
    };

    _this.autoSaveTimer = null;
    _this.formRef = _react2.default.createRef();
    _this._initialData = null;

    var detailUrl = null;
    if (props.apiDetailUrl) {
      detailUrl = props.apiDetailUrl;
    } else if (props.persistedObject) {
      if (props.persistedObject.url) {
        detailUrl = props.persistedObject.url;
      } else {
        detailUrl = (0, _urls.reverse)(_this.props.apiDetailUrlPath, { pk: props.persistedObject.id });
      }
    } else if (props.representedObjectId) {
      detailUrl = (0, _urls.reverse)(_this.props.apiDetailUrlPath, { pk: props.representedObjectId });
    }
    _this.detailUrl = detailUrl;

    _this.fieldArrangementMap = {};
    if (props.fieldArrangement) {
      props.fieldArrangement.forEach(function (fieldInfo) {
        if (typeof fieldInfo === 'string') {
          fieldInfo = { name: fieldInfo };
        }
        _this.fieldArrangementMap[fieldInfo.name] = fieldInfo;
      });
    }
    return _this;
  }

  _createClass(Form, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.load();

      if (this.props.onMount) {
        this.props.onMount(this);
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.props.onUnmount) {
        this.props.onUnmount(this);
      }

      if (this.autoSaveTimer) {
        clearTimeout(this.autoSaveTimer);
        this.autoSaveTimer = null;
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      var form = this.formRef.current;
      if (form && !this._initialData) {
        // When the form is rendered for the first time, gather its fields
        // values to serve as the initial data.
        this._initialData = (0, _form.formToObject)(form);
      }
    }
  }, {
    key: 'coerceRequestData',
    value: function coerceRequestData(data) {
      var fieldInfoMap = this.fieldInfoMap;
      if (!fieldInfoMap) {
        return data;
      }

      Object.keys(data).forEach(function (fieldName) {
        var fieldInfo = fieldInfoMap[fieldName];
        if (fieldInfo) {
          var value = data[fieldName];
          // For values representing dates, convert the empty string to null
          if (fieldInfo.type === 'date' && value === '') {
            data[fieldName] = null;
          }
        }
      });

      return data;
    }
  }, {
    key: 'render',
    value: function render() {
      if (this.state.loading || !this.state.referenceObject) {
        var loadingIndicatorContainerStyle = {
          display: 'flex',
          justifyContent: 'center'
        };
        return _react2.default.createElement(
          'div',
          { style: loadingIndicatorContainerStyle },
          _react2.default.createElement(_CircularProgress2.default, null)
        );
      }

      return _react2.default.createElement(
        'form',
        {
          onSubmit: this.handleFormSubmit,
          onChange: this.handleFormChange,
          ref: this.formRef
        },
        this.fields,
        this.children
      );
    }
  }, {
    key: 'fieldNames',
    get: function get() {
      if (this.props.fieldArrangement) {
        var fieldNames = [];
        this.props.fieldArrangement.forEach(function (fieldInfo) {
          var fieldInfoType = typeof fieldInfo === 'undefined' ? 'undefined' : _typeof(fieldInfo);
          if (fieldInfoType === 'string') {
            fieldNames.push(fieldInfo);
          } else if (fieldInfoType === 'object') {
            fieldNames.push(fieldInfo.name);
          }
        });
        return fieldNames;
      } else if (this.state.metadata) {
        return this.state.metadata.filter(function (fieldInfo) {
          return !fieldInfo.read_only;
        }).map(function (fieldInfo) {
          return fieldInfo.key;
        });
      } else {
        return [];
      }
    }
  }, {
    key: 'fieldInfoMap',
    get: function get() {
      if (!this.state.metadata) {
        return null;
      }

      return (0, _array.arrayToObject)(this.state.metadata, 'key');
    }
  }, {
    key: 'fields',
    get: function get() {
      return _react2.default.createElement(this.props.FieldSet, _extends({
        errors: this.state.errors,
        fieldArrangementMap: this.fieldArrangementMap,
        fieldInfoMap: this.fieldInfoMap,
        fieldNames: this.fieldNames,
        representedObject: this.state.referenceObject,
        saving: this.state.saving
      }, this.props.FieldSetProps));
    }

    /**
     * Decorate any given children with a 'disabled' prop while saving
     */

  }, {
    key: 'children',
    get: function get() {
      var disabled = this.state.saving;
      return (0, _component.recursiveMap)(this.props.children, function (child) {
        return _react2.default.cloneElement(child, { disabled: disabled });
      });
    }
  }]);

  return Form;
}(_react2.default.PureComponent);

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.load = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var referenceObject, metadata, requests, optionsUrl, responses;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _this2.setState({ loading: true });

            referenceObject = _this2.props.persistedObject;
            metadata = null;
            requests = [];

            // If the fields have not been explicitly provided, issue an OPTIONS request for
            // metadata about the represented object so the fields can be generated dynamically.

            optionsUrl = _this2.detailUrl || _this2.props.apiCreateUrl;

            requests.push(_util.ServiceAgent.options(optionsUrl));

            if (!referenceObject) {
              if (_this2.detailUrl) {
                // If an original object was not explicitly provided, attempt to load one from the given detailUrl
                requests.push(_util.ServiceAgent.get(_this2.detailUrl));
              } else {
                referenceObject = _this2.props.defaultValues;
              }
            }

            _context.next = 9;
            return Promise.all(requests);

          case 9:
            responses = _context.sent;


            responses.forEach(function (response) {
              if (response.req.method === 'OPTIONS') {
                metadata = response.body;
              } else {
                referenceObject = response.body;
              }
            });

            if (referenceObject) {
              _context.next = 13;
              break;
            }

            throw new Error('Failed to initialize form');

          case 13:

            _this2.setState({
              metadata: metadata,
              referenceObject: referenceObject,
              loading: false
            });

            if (_this2.props.onLoad) {
              _this2.props.onLoad(referenceObject, _this2.fieldInfoMap);
            }

          case 15:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, _this2);
  }));
  this.save = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var updateMethod, form, formData, requestUrl, requestMethod, requestData, detailUrl, changedData, response, persistedObject;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            updateMethod = _this2.props.updateMethod;


            _this2.setState({ errors: {}, saving: true });

            form = _this2.formRef.current;
            formData = (0, _form.formToObject)(form);
            requestUrl = null;
            requestMethod = null;
            requestData = null;
            detailUrl = _this2.detailUrl;

            if (detailUrl) {
              requestUrl = detailUrl;
              if (updateMethod === 'PATCH') {
                changedData = {};

                Object.keys(formData).forEach(function (key) {
                  var value = formData[key];
                  if (!(0, _lodash2.default)(value, _this2._initialData[key])) {
                    changedData[key] = value;
                  }
                });
                requestData = changedData;
                requestMethod = 'PATCH';
              } else {
                requestData = formData;
                requestMethod = 'PUT';
              }
            } else {
              requestUrl = _this2.props.apiCreateUrl;
              requestData = formData;
              requestMethod = 'POST';
            }

            if (requestMethod && requestUrl && requestData) {
              _context2.next = 11;
              break;
            }

            throw new Error('Missing one or more required paramers for form request');

          case 11:
            _context2.prev = 11;

            requestData = _this2.coerceRequestData(requestData);
            _context2.next = 15;
            return _util.ServiceAgent.request(requestMethod, requestUrl, requestData);

          case 15:
            response = _context2.sent;
            persistedObject = response.body;

            // When the form is saved and a new persisted object has been established,
            // we clear the initialData so that on the next componentDidUpdate it gets
            // reset to the new persisted values.

            _this2._initialData = null;

            _this2.setState({
              saving: false,
              referenceObject: persistedObject
            });

            if (_this2.props.onSave) {
              _this2.props.onSave(persistedObject);
            }

            return _context2.abrupt('return', persistedObject);

          case 23:
            _context2.prev = 23;
            _context2.t0 = _context2['catch'](11);

            _this2.setState({
              saving: false,
              errors: _context2.t0.response ? _context2.t0.response.body : {}
            });

            if (_this2.props.onError) {
              _this2.props.onError(_context2.t0);
            }

          case 27:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, _this2, [[11, 23]]);
  }));

  this.handleFormSubmit = function (e) {
    e.preventDefault();
    _this2.save();
  };

  this.handleFormChange = function (e) {
    if (_this2.props.autosaveDelay !== null) {
      if (_this2.autoSaveTimer) {
        clearTimeout(_this2.autoSaveTimer);
      }
      _this2.autoSaveTimer = setTimeout(function () {
        _this2.save();
      }, _this2.props.autosaveDelay);
    }
  };
};

Form.propTypes = {
  apiCreateUrl: _propTypes2.default.string,
  apiDetailUrl: _propTypes2.default.string,
  apiDetailUrlPath: _propTypes2.default.string,
  autosaveDelay: _propTypes2.default.number,
  children: _propTypes2.default.any,
  defaultValues: _propTypes2.default.object,
  entityType: _propTypes2.default.string,
  FieldSet: _propTypes2.default.func,
  FieldSetProps: _propTypes2.default.object,
  fieldArrangement: _propTypes2.default.array,
  representedObjectId: _propTypes2.default.number,
  onMount: _propTypes2.default.func,
  onUnmount: _propTypes2.default.func,
  onLoad: _propTypes2.default.func,
  onSave: _propTypes2.default.func,
  onError: _propTypes2.default.func,
  persistedObject: _propTypes2.default.object,
  loadingIndicator: _propTypes2.default.node,
  updateMethod: _propTypes2.default.oneOf(['PUT', 'PATCH'])
};

Form.defaultProps = {
  autosave: false,
  autosaveDelay: null,
  defaultValues: {},
  entityType: '',
  FieldSet: _FormFieldSet2.default,
  FieldSetProps: {},
  updateMethod: 'PATCH'
};

exports.default = (0, _withStyles2.default)(function (theme) {
  return theme.form;
})(Form);