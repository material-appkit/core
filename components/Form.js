'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash.isequal');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.clonedeep');

var _lodash4 = _interopRequireDefault(_lodash3);

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

var _urls = require('../util/urls');

var _FormFieldSet = require('./FormFieldSet');

var _FormFieldSet2 = _interopRequireDefault(_FormFieldSet);

var _ItemListField = require('./ItemListField');

var _ItemListField2 = _interopRequireDefault(_ItemListField);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Form = function (_React$PureComponent) {
  _inherits(Form, _React$PureComponent);

  _createClass(Form, null, [{
    key: 'registerWidgetClass',
    value: function registerWidgetClass(widgetType, WidgetClass) {
      this.widgetClassMap[widgetType] = WidgetClass;
    }
  }, {
    key: 'widgetClassForType',
    value: function widgetClassForType(widgetType) {
      return widgetType ? this.widgetClassMap[widgetType] : null;
    }
  }, {
    key: 'coerceValue',
    value: function coerceValue(value, fieldInfo) {
      var _ref = fieldInfo.ui || {},
          widget = _ref.widget;

      var WidgetClass = this.widgetClassForType(widget);
      if (WidgetClass && WidgetClass.hasOwnProperty('coerceValue')) {
        return WidgetClass.coerceValue(value);
      }

      var fieldType = fieldInfo.type;
      if ((fieldType === 'date' || fieldType === 'number') && value === '') {
        // For values representing numbers or dates, convert the empty string to null
        return null;
      }

      return value;
    }
  }]);

  function Form(props) {
    _classCallCheck(this, Form);

    var _this = _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).call(this, props));

    _initialiseProps.call(_this);

    _this.state = {
      errors: {},
      referenceObject: null,
      formData: null,
      initialData: null,
      metadata: null,
      loading: false,
      saving: false
    };

    _this.autoSaveTimer = null;
    _this.formRef = _react2.default.createRef();

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
    key: 'getFieldNames',
    value: function getFieldNames(metadata) {
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
      } else if (metadata) {
        return metadata.filter(function (fieldInfo) {
          return !fieldInfo.read_only;
        }).map(function (fieldInfo) {
          return fieldInfo.key;
        });
      } else {
        return [];
      }
    }
  }, {
    key: 'getFieldArrangementMap',
    value: function getFieldArrangementMap(metadata) {
      var fieldArrangementMap = {};
      if (this.props.fieldArrangement) {
        this.props.fieldArrangement.forEach(function (fieldInfo) {
          if (typeof fieldInfo === 'string') {
            fieldInfo = { name: fieldInfo };
          }
          fieldArrangementMap[fieldInfo.name] = fieldInfo;
        });
      } else if (metadata) {
        metadata.forEach(function (fieldInfo) {
          if (!fieldInfo.read_only) {
            var fieldName = fieldInfo.key;
            fieldArrangementMap[fieldName] = { name: fieldName };
          }
        });
      }
      return fieldArrangementMap;
    }
  }, {
    key: 'getFieldInfoMap',
    value: function getFieldInfoMap(metadata) {
      if (!metadata) {
        return null;
      }

      return (0, _array.arrayToObject)(metadata, 'key');
    }

    /**
     * Decorate any given children with a 'disabled' prop while saving
     */

  }, {
    key: 'initialData',
    value: function initialData(metadata, referenceObject) {
      var fieldInfoMap = this.getFieldInfoMap(metadata);
      var data = {};

      var fieldNames = this.getFieldNames(metadata);
      fieldNames.forEach(function (fieldName) {
        var fieldInfo = fieldInfoMap[fieldName];

        var _ref2 = fieldInfo.ui || {},
            widget = _ref2.widget;

        var value = referenceObject[fieldName];
        switch (widget) {
          case 'itemlist':
            value = value || [];
            break;
          case 'select':
            if (!value) {
              value = '';
            } else if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
              value = value.url;
            }
            break;
          default:
            value = value || '';
            break;
        }

        data[fieldName] = value;
      });

      return (0, _lodash4.default)(data);
    }
  }, {
    key: 'coerceRequestData',
    value: function coerceRequestData(data) {
      var _this2 = this;

      var fieldInfoMap = this.getFieldInfoMap(this.state.metadata);
      if (!fieldInfoMap) {
        return data;
      }

      var coercedData = {};
      Object.keys(data).forEach(function (fieldName) {
        var fieldInfo = fieldInfoMap[fieldName];
        var value = data[fieldName];
        if (fieldInfo) {
          coercedData[fieldName] = _this2.constructor.coerceValue(value, fieldInfo);
        } else {
          coercedData[fieldName] = value;
        }
      });
      return coercedData;
    }

    /**
     * Whenever a value in the form changes, if the form has been configured to
     * autosave after a given delay period, set up a timer to do so.
     * NOTE: This is only applicable when editing a persisted record.
     */

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
        _react2.default.createElement(this.props.FieldSet, {
          errors: this.state.errors,
          fieldArrangementMap: this.getFieldArrangementMap(this.state.metadata),
          fieldInfoMap: this.getFieldInfoMap(this.state.metadata),
          fieldNames: this.getFieldNames(this.state.metadata),
          form: this,
          representedObject: this.state.referenceObject,
          saving: this.state.saving
        }),
        this.children
      );
    }
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

Form.widgetClassMap = {
  'itemlist': _ItemListField2.default
};

var _initialiseProps = function _initialiseProps() {
  var _this3 = this;

  this.setValues = function (values) {
    var formData = _extends({}, _this3.state.formData, values);
    _this3.setState({ formData: formData });
  };

  this.setValue = function (fieldName, value) {
    _this3.setValues(_defineProperty({}, fieldName, value));
  };

  this.load = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var referenceObject, metadata, requests, optionsUrl, responses, initialData;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _this3.setState({ loading: true });

            referenceObject = _this3.props.persistedObject;
            metadata = null;
            requests = [];

            // If the fields have not been explicitly provided, issue an OPTIONS request for
            // metadata about the represented object so the fields can be generated dynamically.

            optionsUrl = _this3.props.apiCreateUrl || _this3.detailUrl;

            requests.push(_util.ServiceAgent.options(optionsUrl));

            if (!referenceObject) {
              if (_this3.detailUrl) {
                // If an original object was not explicitly provided, attempt to load one from the given detailUrl
                requests.push(_util.ServiceAgent.get(_this3.detailUrl));
              } else {
                referenceObject = _this3.props.defaultValues;
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

            initialData = _this3.initialData(metadata, referenceObject);

            if (initialData) {
              _context.next = 14;
              break;
            }

            throw new Error('Failed to initialize form');

          case 14:

            _this3.setState({
              formData: initialData,
              loading: false,
              metadata: metadata,
              referenceObject: referenceObject
            });

            if (_this3.props.onLoad) {
              _this3.props.onLoad(referenceObject, _this3.getFieldInfoMap(metadata));
            }

          case 16:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, _this3);
  }));
  this.save = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var updateMethod, _state, formData, metadata, referenceObject, requestUrl, requestMethod, requestData, detailUrl, persistedData, changedData, response, persistedObject;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            updateMethod = _this3.props.updateMethod;
            _state = _this3.state, formData = _state.formData, metadata = _state.metadata, referenceObject = _state.referenceObject;


            _this3.setState({ errors: {}, saving: true });

            requestUrl = null;
            requestMethod = null;
            requestData = null;
            detailUrl = _this3.detailUrl;

            if (detailUrl) {
              requestUrl = detailUrl;
              if (updateMethod === 'PATCH') {
                persistedData = _this3.initialData(metadata, referenceObject);
                changedData = {};

                Object.keys(formData).forEach(function (key) {
                  var value = formData[key];
                  if (!(0, _lodash2.default)(value, persistedData[key])) {
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
              requestUrl = _this3.props.apiCreateUrl;
              requestData = formData;
              requestMethod = 'POST';
            }

            if (requestMethod && requestUrl && requestData) {
              _context2.next = 10;
              break;
            }

            throw new Error('Missing one or more required paramers for form request');

          case 10:
            _context2.prev = 10;

            requestData = _this3.coerceRequestData(requestData);
            _context2.next = 14;
            return _util.ServiceAgent.request(requestMethod, requestUrl, requestData);

          case 14:
            response = _context2.sent;
            persistedObject = response.body;


            _this3.setState({
              saving: false,
              referenceObject: persistedObject
            });

            if (_this3.props.onSave) {
              _this3.props.onSave(persistedObject);
            }

            return _context2.abrupt('return', persistedObject);

          case 21:
            _context2.prev = 21;
            _context2.t0 = _context2['catch'](10);

            _this3.setState({
              saving: false,
              errors: _context2.t0.response ? _context2.t0.response.body : {}
            });

            if (_this3.props.onError) {
              _this3.props.onError(_context2.t0);
            }

          case 25:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, _this3, [[10, 21]]);
  }));

  this.handleFormSubmit = function (e) {
    e.preventDefault();

    if (e.target !== _this3.formRef.current) {
      // Due to event bubbling, a <form> is submitted within a dialog that
      // is rendered atop a view that also has a <form>, the underlying
      // form also gets submitted.
      // This check ensures that only the intended save method is invoked.
      return;
    }

    _this3.save();
  };

  this.handleFormChange = function (e) {
    if (e.currentTarget !== _this3.formRef.current) {
      // Due to event bubbling, a <form> is submitted within a dialog that
      // is rendered atop a view that also has a <form>, the underlying
      // form also gets submitted.
      // This check ensures that only the intended save method is invoked.
      return;
    }

    if (_this3.detailUrl && _this3.props.autosaveDelay) {
      if (_this3.autoSaveTimer) {
        clearTimeout(_this3.autoSaveTimer);
      }
      _this3.autoSaveTimer = setTimeout(function () {
        _this3.save();
      }, _this3.props.autosaveDelay);
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
  autosaveDelay: null,
  defaultValues: {},
  entityType: '',
  FieldSet: _FormFieldSet2.default,
  updateMethod: 'PATCH'
};

exports.default = (0, _withStyles2.default)(function (theme) {
  return theme.form;
})(Form);