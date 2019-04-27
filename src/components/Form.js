import isEqual from 'lodash.isequal';
import cloneDeep from 'lodash.clonedeep';

import PropTypes from 'prop-types';
import React from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import withStyles from '@material-ui/core/styles/withStyles';

import { ServiceAgent } from '../util';
import { arrayToObject } from '../util/array';
import { recursiveMap } from '../util/component';
import { reverse } from '../util/urls';

import FormFieldSet from './FormFieldSet';
import ItemListField from './ItemListField';
import DateTimeField from './DateTimeField';

class Form extends React.PureComponent {
  static widgetClassMap = {
    'itemlist': ItemListField,
    'datetime': DateTimeField,
  };

  static registerWidgetClass(widgetType, WidgetClass) {
    this.widgetClassMap[widgetType] = WidgetClass;
  }

  static widgetClassForType(widgetType) {
    return widgetType ? this.widgetClassMap[widgetType] : null;
  }

  static coerceValue(value, fieldInfo) {
    const { widget } = fieldInfo.ui || {};
    const WidgetClass = this.widgetClassForType(widget);
    if (WidgetClass && WidgetClass.hasOwnProperty('coerceValue')) {
      return WidgetClass.coerceValue(value);
    }

    const fieldType =  fieldInfo.type;
    if ((fieldType === 'date' || fieldType === 'number') && value === '') {
      // For values representing numbers or dates, convert the empty string to null
      return null;
    }

    return value;
  }

  constructor(props) {
    super(props);

    this.state = {
      errors: {},
      referenceObject: null,
      formData: null,
      initialData: null,
      metadata: null,
      loading: false,
      saving: false,
    };

    this.autoSaveTimer = null;
    this.formRef = React.createRef();

    let detailUrl = null;
    if (props.apiDetailUrl) {
      detailUrl = props.apiDetailUrl;
    } else if (props.persistedObject) {
      if (props.persistedObject.url) {
        detailUrl = props.persistedObject.url;
      } else {
        detailUrl = reverse(this.props.apiDetailUrlPath, { pk: props.persistedObject.id });
      }
    } else if (props.representedObjectId) {
      detailUrl = reverse(this.props.apiDetailUrlPath, { pk: props.representedObjectId });
    }
    this.detailUrl = detailUrl;
  }

  componentDidMount() {
    this.load();

    if (this.props.onMount) {
      this.props.onMount(this);
    }
  }

  componentWillUnmount() {
    if (this.props.onUnmount) {
      this.props.onUnmount(this);
    }

    if (this.autoSaveTimer) {
      clearTimeout(this.autoSaveTimer);
      this.autoSaveTimer = null;
    }
  }

  getFieldNames(metadata) {
    if (this.props.fieldArrangement) {
      const fieldNames = [];
      this.props.fieldArrangement.forEach((fieldInfo) => {
        const fieldInfoType = typeof(fieldInfo);
        if (fieldInfoType === 'string') {
          fieldNames.push(fieldInfo);
        } else if (fieldInfoType === 'object') {
          fieldNames.push(fieldInfo.name)
        }
      });
      return fieldNames;
    } else if (metadata) {
      return metadata
        .filter((fieldInfo) => !fieldInfo.read_only)
        .map((fieldInfo) => fieldInfo.key);
    } else {
      return [];
    }
  }

  getFieldArrangementMap(metadata) {
    const fieldArrangementMap = {};
    if (this.props.fieldArrangement) {
      this.props.fieldArrangement.forEach((fieldInfo) => {
        if (typeof(fieldInfo) === 'string') {
          fieldInfo = { name: fieldInfo };
        }
        fieldArrangementMap[fieldInfo.name] = fieldInfo;
      });
    } else if (metadata) {
      metadata.forEach((fieldInfo) => {
        if (!fieldInfo.read_only) {
          const fieldName = fieldInfo.key;
          fieldArrangementMap[fieldName] = { name: fieldName };
        }
      });
    }
    return fieldArrangementMap;
  }

  getFieldInfoMap(metadata) {
    if (!metadata) {
      return null;
    }

    return arrayToObject(metadata, 'key');
  }

  initialData(metadata, referenceObject) {
    const fieldInfoMap = this.getFieldInfoMap(metadata);
    const data = {};

    const fieldNames = this.getFieldNames(metadata);
    fieldNames.forEach((fieldName) => {
      const fieldInfo = fieldInfoMap[fieldName];
      const { widget } = fieldInfo.ui || {};
      let value = referenceObject[fieldName];
      switch (widget) {
        case 'itemlist':
          value = value || [];
          break;
        case 'select':
          if (!value) {
            value = '';
          } else if (typeof(value) === 'object') {
            value = value.url;
          }
          break;
        default:
          value = value || '';
          break;
      }

      data[fieldName] = value;
    });

    return cloneDeep(data);
  }


  coerceRequestData(data) {
    const fieldInfoMap = this.getFieldInfoMap(this.state.metadata);
    if (!fieldInfoMap) {
      return data;
    }

    const coercedData = {};
    Object.keys(data).forEach((fieldName) => {
      const fieldInfo = fieldInfoMap[fieldName];
      const value = data[fieldName];
      if (fieldInfo) {
        coercedData[fieldName] = this.constructor.coerceValue(value, fieldInfo);
      } else {
        coercedData[fieldName] = value;
      }
    });
    return coercedData;
  }

  setValues = (values) => {
    const formData = {...this.state.formData, ...values };
    this.setState({ formData });
  };

  setValue = (fieldName, value) => {
    this.setValues({ [fieldName]: value });
  };

  load = async() => {
    this.setState({ loading: true });

    let referenceObject = this.props.persistedObject;
    let metadata = null;
    const requests = [];

    // If the fields have not been explicitly provided, issue an OPTIONS request for
    // metadata about the represented object so the fields can be generated dynamically.
    const optionsUrl = this.props.apiCreateUrl || this.detailUrl;
    requests.push(ServiceAgent.options(optionsUrl));

    if (!referenceObject) {
      if (this.detailUrl) {
        // If an original object was not explicitly provided, attempt to load one from the given detailUrl
        requests.push(ServiceAgent.get(this.detailUrl));
      } else {
        referenceObject = this.props.defaultValues;
      }
    }

    let responses = await(Promise.all(requests));

    responses.forEach((response) => {
      if (response.req.method === 'OPTIONS') {
        metadata = response.body;
      } else {
        referenceObject = response.body;
      }
    });

    const initialData = this.initialData(metadata, referenceObject);
    if (!initialData) {
      throw new Error('Failed to initialize form');
    }

    this.setState({
      formData: initialData,
      loading: false,
      metadata,
      referenceObject,
    });

    if (this.props.onLoad) {
      this.props.onLoad(referenceObject, this.getFieldInfoMap(metadata));
    }
  };

  save = async() => {
    const { updateMethod} = this.props;
    const { formData, metadata, referenceObject } = this.state;

    this.setState({ errors: {}, saving: true });

    let requestUrl = null;
    let requestMethod = null;
    let requestData = null;

    const detailUrl = this.detailUrl;
    if (detailUrl) {
      requestUrl = detailUrl;
      if (updateMethod === 'PATCH') {
        const persistedData = this.initialData(metadata, referenceObject);
        const changedData = {};
        Object.keys(formData).forEach((key) => {
          const value = formData[key];
          if (!isEqual(value, persistedData[key])) {
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
      requestUrl = this.props.apiCreateUrl;
      requestData = formData;
      requestMethod = 'POST';
    }

    if (!(requestMethod && requestUrl && requestData)) {
      throw new Error('Missing one or more required parameters for form request');
    }

    try {
      requestData = this.coerceRequestData(requestData);

      if (this.props.onWillSave) {
        this.props.onWillSave(requestData);
      }

      const response = await ServiceAgent.request(requestMethod, requestUrl, requestData);
      const persistedObject = response.body;

      this.setState({
        saving: false,
        referenceObject: persistedObject,
      });

      if (this.props.onSave) {
        this.props.onSave(persistedObject);
      }

      return persistedObject;
    } catch (err) {
      this.setState({
        saving: false,
        errors: err.response ? err.response.body : {},
      });

      if (this.props.onError) {
        this.props.onError(err);
      }
    }
  };

  handleFormSubmit = (e) => {
    e.preventDefault();

    if (e.target !== this.formRef.current) {
      // Due to event bubbling, a <form> is submitted within a dialog that
      // is rendered atop a view that also has a <form>, the underlying
      // form also gets submitted.
      // This check ensures that only the intended save method is invoked.
      return;
    }

    this.save();
  };

  /**
   * Whenever a value in the form changes, if the form has been configured to
   * autosave after a given delay period, set up a timer to do so.
   * NOTE: This is only applicable when editing a persisted record.
   */
  handleFormChange = (e) => {
    if (e.currentTarget !== this.formRef.current) {
      // Due to event bubbling, a <form> is submitted within a dialog that
      // is rendered atop a view that also has a <form>, the underlying
      // form also gets submitted.
      // This check ensures that only the intended save method is invoked.
      return;
    }

    if (this.detailUrl && this.props.autosaveDelay) {
      if (this.autoSaveTimer) {
        clearTimeout(this.autoSaveTimer);
      }
      this.autoSaveTimer = setTimeout(() => {
        this.save();
      }, this.props.autosaveDelay);
    }
  };

  render() {
    if (this.state.loading || !this.state.referenceObject) {
      const loadingIndicatorContainerStyle = {
        display: 'flex',
        justifyContent: 'center',
      };
      return (
        <div style={loadingIndicatorContainerStyle}>
          <CircularProgress />
        </div>
      );
    }

    return (
      <form
        onSubmit={this.handleFormSubmit}
        onChange={this.handleFormChange}
        ref={this.formRef}
      >
        <this.props.FieldSet
          errors={this.state.errors}
          fieldArrangementMap={this.getFieldArrangementMap(this.state.metadata)}
          fieldInfoMap={this.getFieldInfoMap(this.state.metadata)}
          fieldNames={this.getFieldNames(this.state.metadata)}
          form={this}
          representedObject={this.state.referenceObject}
        />
        {this.props.children}
      </form>
    );
  }
}

Form.propTypes = {
  apiCreateUrl: PropTypes.string,
  apiDetailUrl: PropTypes.string,
  apiDetailUrlPath: PropTypes.string,
  autosaveDelay: PropTypes.number,
  children: PropTypes.any,
  defaultValues: PropTypes.object,
  entityType: PropTypes.string,
  FieldSet: PropTypes.func,
  fieldArrangement: PropTypes.array,
  representedObjectId: PropTypes.number,
  onMount: PropTypes.func,
  onUnmount: PropTypes.func,
  onLoad: PropTypes.func,
  onWillSave: PropTypes.func,
  onSave: PropTypes.func,
  onError: PropTypes.func,
  persistedObject: PropTypes.object,
  loadingIndicator: PropTypes.node,
  updateMethod: PropTypes.oneOf(['PUT', 'PATCH']),
};

Form.defaultProps = {
  autosaveDelay: null,
  defaultValues: {},
  entityType: '',
  FieldSet: FormFieldSet,
  updateMethod: 'PATCH',
};

export default withStyles((theme) => {
  return theme.form;
})(Form);
