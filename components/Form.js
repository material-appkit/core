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

var _TextField = require('@material-ui/core/TextField');

var _TextField2 = _interopRequireDefault(_TextField);

var _withStyles = require('@material-ui/core/styles/withStyles');

var _withStyles2 = _interopRequireDefault(_withStyles);

var _util = require('../util');

var _array = require('../util/array');

var _component = require('../util/component');

var _form = require('../util/form');

var _urls = require('../util/urls');

var _ItemListField = require('./ItemListField');

var _ItemListField2 = _interopRequireDefault(_ItemListField);

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
        _react2.default.createElement(
          _react2.default.Fragment,
          null,
          (0, _component.decorateErrors)(this.fields, this.state.errors),
          this.children
        )
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
      var _this2 = this;

      if (this.props.fields) {
        // If a field set was explicitly provided, simply use it.
        return this.props.fields;
      }

      var classes = this.props.classes;

      var referenceObject = this.state.referenceObject;

      var fields = [];
      this.fieldNames.forEach(function (fieldName) {
        var fieldInfo = _this2.fieldInfoMap[fieldName];
        if (!fieldInfo.read_only) {
          var field = null;
          var defaultValue = _this2.state.referenceObject[fieldName] || '';

          if (fieldInfo.hidden) {
            field = _react2.default.createElement('input', { type: 'hidden', name: fieldName, defaultValue: defaultValue });
          } else if (fieldInfo.type === 'itemlist') {
            var fieldArrangementInfo = _this2.fieldArrangementMap[fieldName];
            field = _react2.default.createElement(_ItemListField2.default, _extends({
              defaultItems: referenceObject[fieldName],
              listUrl: fieldInfo.related_endpoint.singular + '/',
              name: fieldName,
              label: fieldInfo.ui.label
            }, fieldArrangementInfo));
          } else {
            var textFieldProps = {
              disabled: _this2.state.saving,
              key: fieldName,
              fullWidth: true,
              InputLabelProps: { classes: { root: classes.inputLabel } },
              label: fieldInfo.ui.label,
              margin: "dense",
              name: fieldName,
              defaultValue: defaultValue,
              variant: "outlined"
            };

            if (fieldInfo.choices) {
              textFieldProps.select = true;
              textFieldProps.SelectProps = { native: true };
            } else {
              var inputType = fieldInfo.type;
              if (inputType === 'textarea') {
                textFieldProps.multiline = true;
                textFieldProps.rows = 2;
                textFieldProps.rowsMax = 4;
              } else {
                textFieldProps.type = inputType;
              }
            }

            if (fieldInfo.type === 'number') {
              textFieldProps.inputProps = { min: 0, step: 'any' };
            }

            field = _react2.default.createElement(
              _TextField2.default,
              textFieldProps,
              fieldInfo.choices && _react2.default.createElement(
                _react2.default.Fragment,
                null,
                _react2.default.createElement('option', null),
                fieldInfo.choices.map(function (choice) {
                  return _react2.default.createElement(
                    'option',
                    { key: choice.value, value: choice.value },
                    choice.display_name
                  );
                })
              )
            );
          }

          fields.push(field);
        }
      });
      return fields;
    }

    /**
     * Decorate any given children with a 'disabled' prop while saving
     */

  }, {
    key: 'children',
    get: function get() {
      var _this3 = this;

      return _react2.default.Children.map(this.props.children, function (child) {
        if (!child) {
          return child;
        }
        return _react2.default.cloneElement(child, { disabled: _this3.state.saving });
      });
    }
  }]);

  return Form;
}(_react2.default.PureComponent);

var _initialiseProps = function _initialiseProps() {
  var _this4 = this;

  this.load = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var referenceObject, metadata, requests, optionsUrl, responses;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _this4.setState({ loading: true });

            referenceObject = _this4.props.persistedObject;
            metadata = null;
            requests = [];

            // If the fields have not been explicitly provided, issue an OPTIONS request for
            // metadata about the represented object so the fields can be generated dynamically.

            optionsUrl = _this4.detailUrl || _this4.props.apiCreateUrl;

            requests.push(_util.ServiceAgent.options(optionsUrl));

            if (!referenceObject) {
              if (_this4.detailUrl) {
                // If an original object was not explicitly provided, attempt to load one from the given detailUrl
                requests.push(_util.ServiceAgent.get(_this4.detailUrl));
              } else {
                referenceObject = _this4.props.defaultValues;
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

            _this4.setState({
              metadata: metadata,
              referenceObject: referenceObject,
              loading: false
            });

            if (_this4.props.onLoad) {
              _this4.props.onLoad(referenceObject, _this4.fieldInfoMap);
            }

          case 15:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, _this4);
  }));
  this.save = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var updateMethod, form, formData, saveRequest, detailUrl, pendingChanges, response, persistedObject;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            updateMethod = _this4.props.updateMethod;


            _this4.setState({ errors: {}, saving: true });

            form = _this4.formRef.current;
            formData = (0, _form.formToObject)(form);
            saveRequest = null;
            detailUrl = _this4.detailUrl;

            if (detailUrl) {
              if (updateMethod === 'PATCH') {
                pendingChanges = {};

                Object.keys(formData).forEach(function (key) {
                  var value = formData[key];
                  if (!(0, _lodash2.default)(value, _this4._initialData[key])) {
                    pendingChanges[key] = value;
                  }
                });
                console.log(pendingChanges);
                saveRequest = _util.ServiceAgent.patch(detailUrl, pendingChanges);
              } else {
                saveRequest = _util.ServiceAgent.put(detailUrl, formData);
              }
            } else {
              saveRequest = _util.ServiceAgent.post(_this4.props.apiCreateUrl, formData);
            }

            _context2.prev = 7;
            _context2.next = 10;
            return saveRequest;

          case 10:
            response = _context2.sent;
            persistedObject = response.body;

            // When the form is saved and a new persisted object has been established,
            // we clear the initialData so that on the next componentDidUpdate it gets
            // reset to the new persisted values.

            _this4._initialData = null;

            _this4.setState({
              saving: false,
              referenceObject: persistedObject
            });

            if (_this4.props.onSave) {
              _this4.props.onSave(persistedObject);
            }

            return _context2.abrupt('return', persistedObject);

          case 18:
            _context2.prev = 18;
            _context2.t0 = _context2['catch'](7);

            _this4.setState({
              saving: false,
              errors: _context2.t0.response ? _context2.t0.response.body : {}
            });

            if (_this4.props.onError) {
              _this4.props.onError(_context2.t0);
            }

          case 22:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, _this4, [[7, 18]]);
  }));

  this.handleFormSubmit = function (e) {
    e.preventDefault();

    _this4.save();
  };

  this.handleFormChange = function (e) {
    if (_this4.props.autosaveDelay !== null) {
      if (_this4.autoSaveTimer) {
        clearTimeout(_this4.autoSaveTimer);
      }
      _this4.autoSaveTimer = setTimeout(function () {
        _this4.save();
      }, _this4.props.autosaveDelay);
    }
  };
};

Form.propTypes = {
  apiCreateUrl: _propTypes2.default.string,
  apiDetailUrl: _propTypes2.default.string,
  apiDetailUrlPath: _propTypes2.default.string,
  autosaveDelay: _propTypes2.default.number,
  children: _propTypes2.default.any,
  classes: _propTypes2.default.object.isRequired,
  defaultValues: _propTypes2.default.object,
  entityType: _propTypes2.default.string,
  fields: _propTypes2.default.any,
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
  autosave: false,
  entityType: '',
  updateMethod: 'PATCH'
};

exports.default = (0, _withStyles2.default)(function (theme) {
  return theme.form;
})(Form);