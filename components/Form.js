'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _deepObjectDiff = require('deep-object-diff');

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

var _component = require('../util/component');

var _urls = require('../util/urls');

var _form = require('../util/form');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FIELD_TYPE_MAP = {
  'integer': 'number',
  'float': 'number',
  'decimal': 'number',
  'date': 'date',
  'email': 'email',
  'field': 'text',
  'string': 'text'
};

var Form = function (_React$PureComponent) {
  _inherits(Form, _React$PureComponent);

  function Form(props) {
    var _this2 = this;

    _classCallCheck(this, Form);

    var _this = _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).call(this, props));

    _this.load = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var referenceObject, fieldInfoMap, requests, optionsUrl, responses;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _this.setState({ loading: true });

              referenceObject = _this.props.persistedObject;
              fieldInfoMap = null;
              requests = [];

              // If the fields have not been explicitly provided, issue an OPTIONS request for
              // metadata about the represented object so the fields can be generated dynamically.

              optionsUrl = _this.detailUrl || _this.props.apiCreateUrl;

              requests.push(_this.props.serviceAgent.options(optionsUrl));

              if (!referenceObject) {
                if (_this.detailUrl) {
                  // If an original object was not explicitly provided, attempt to load one from the given detailUrl
                  requests.push(_this.props.serviceAgent.get(_this.detailUrl));
                } else {
                  referenceObject = _this.props.defaultValues;
                }
              }

              _context.next = 9;
              return Promise.all(requests);

            case 9:
              responses = _context.sent;


              responses.forEach(function (response) {
                if (response.req.method === 'OPTIONS') {
                  var optionsResponse = response.body;
                  if (_this.detailUrl) {
                    fieldInfoMap = optionsResponse.actions.PUT;
                  } else {
                    fieldInfoMap = optionsResponse.actions.POST;
                  }
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

              _this.setState({
                fieldInfoMap: fieldInfoMap,
                referenceObject: referenceObject,
                loading: false
              });

              if (_this.props.onLoad) {
                _this.props.onLoad(referenceObject, fieldInfoMap);
              }

            case 15:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this2);
    }));

    _this.save = function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(form) {
        var formData, saveRequest, pendingChanges, response, persistedObject;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _this.setState({ errors: {}, saving: true });

                formData = (0, _form.formToObject)(form);
                saveRequest = null;

                if (_this.detailUrl) {
                  pendingChanges = (0, _deepObjectDiff.updatedDiff)(_this.state.referenceObject, formData);

                  saveRequest = _this.props.serviceAgent.patch(_this.detailUrl, pendingChanges);
                } else {
                  saveRequest = _this.props.serviceAgent.post(_this.props.apiCreateUrl, formData);
                }

                _context2.prev = 4;
                _context2.next = 7;
                return saveRequest;

              case 7:
                response = _context2.sent;
                persistedObject = response.body;


                _this.setState({
                  saving: false,
                  referenceObject: persistedObject
                });
                if (_this.props.onSave) {
                  _this.props.onSave(persistedObject);
                }
                _context2.next = 17;
                break;

              case 13:
                _context2.prev = 13;
                _context2.t0 = _context2['catch'](4);

                _this.setState({
                  saving: false,
                  errors: _context2.t0.response ? _context2.t0.response.body : {}
                });

                if (_this.props.onError) {
                  _this.props.onError(_context2.t0);
                }

              case 17:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, _this2, [[4, 13]]);
      }));

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }();

    _this.handleFormSubmit = function (e) {
      e.preventDefault();

      _this.save(e.target);
    };

    _this.handleFormChange = function (e) {
      if (_this.props.autosaveDelay !== null) {
        var formElement = e.currentTarget;

        if (_this.autoSaveTimer) {
          clearTimeout(_this.autoSaveTimer);
        }
        _this.autoSaveTimer = setTimeout(function () {
          _this.save(formElement);
        }, _this.props.autosaveDelay);
      }
    };

    _this.state = {
      errors: {},
      referenceObject: null,
      fieldInfoMap: null,
      loading: false,
      saving: false
    };

    var detailUrl = null;
    if (props.apiDetailUrl) {
      detailUrl = props.apiDetailUrl;
    } else if (props.persistedObject) {
      detailUrl = (0, _urls.reverse)(_this.props.apiDetailUrlPath, { pk: props.persistedObject.id });
    } else if (props.representedObjectId) {
      detailUrl = (0, _urls.reverse)(_this.props.apiDetailUrlPath, { pk: props.representedObjectId });
    }
    _this.detailUrl = detailUrl;

    _this.autoSaveTimer = null;
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
          onChange: this.handleFormChange
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
        return this.props.fieldArrangement;
      }

      if (this.state.fieldInfoMap) {
        return Object.keys(this.state.fieldInfoMap);
      }

      return null;
    }
  }, {
    key: 'fields',
    get: function get() {
      var _this3 = this;

      if (this.props.fields) {
        return this.props.fields;
      }

      var classes = this.props.classes;


      var fields = [];
      this.fieldNames.forEach(function (fieldName) {
        var fieldInfo = _this3.state.fieldInfoMap[fieldName];
        if (!fieldInfo.read_only) {
          var field = null;
          var defaultValue = _this3.state.referenceObject[fieldName] || '';
          if (fieldInfo.hidden) {
            field = _react2.default.createElement('input', { type: 'hidden', name: fieldName, defaultValue: defaultValue });
          } else {
            var textFieldProps = {
              className: classes.field,
              disabled: _this3.state.saving,
              key: fieldName,
              fullWidth: true,
              label: fieldInfo.label,
              margin: "dense",
              name: fieldName,
              defaultValue: defaultValue,
              variant: "outlined"
            };

            if (fieldInfo.choices) {
              textFieldProps.select = true;
              textFieldProps.SelectProps = { native: true };
            } else {
              textFieldProps.type = FIELD_TYPE_MAP[fieldInfo.type];
            }

            if (textFieldProps.type === 'number') {
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
      var _this4 = this;

      return _react2.default.Children.map(this.props.children, function (child) {
        if (!child) {
          return child;
        }
        return _react2.default.cloneElement(child, { disabled: _this4.state.saving });
      });
    }
  }]);

  return Form;
}(_react2.default.PureComponent);

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
  serviceAgent: _propTypes2.default.object
};

Form.defaultProps = {
  autosaveDelay: null,
  defaultValues: {},
  autosave: false,
  entityType: '',
  serviceAgent: new _util.ServiceAgent()
};

exports.default = (0, _withStyles2.default)(function (theme) {
  return theme.form;
})(Form);