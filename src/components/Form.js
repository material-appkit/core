import isEqual from 'lodash.isequal';
import cloneDeep from 'lodash.clonedeep';

import PropTypes from 'prop-types';
import React from 'react';

import CheckboxGroupWidget from './widgets/CheckboxGroup';
import FormFieldSet from './FormFieldSet';
import ItemListWidget from './widgets/ItemList';
import ModelSelectWidget from './widgets/ModelSelect';
import RadioGroupWidget from './widgets/RadioGroup';

import ServiceAgent from '../util/ServiceAgent';
import { arrayToObject, valueForKeyPath } from '../util/array';
import { reverse } from '../util/urls';
import { fromRepresentation, toRepresentation } from './FormField';

//------------------------------------------------------------------------------
export const getFieldNames = (metadata, fields) => {
  const availableFieldNames = valueForKeyPath(metadata, 'key');

  if (fields) {
    const fieldNames = [];
    fields.forEach((fieldInfo) => {
      if (Array.isArray(fieldInfo)) {
        fieldNames.push(...getFieldNames(metadata, fieldInfo));
      } else {
        const fieldInfoType = typeof(fieldInfo);
        if (fieldInfoType === 'string') {
          // Exclude anything to do with form layout
          if (fieldInfo !== '---') {
            if (availableFieldNames.indexOf(fieldInfo) !== -1) {
              fieldNames.push(fieldInfo);
            }
          }
        } else if (fieldInfoType === 'object') {
          if (availableFieldNames.indexOf(fieldInfo.name) !== -1) {
            fieldNames.push(fieldInfo.name);
          }
        }
      }
    });

    return fieldNames;
  }

  // In absence of a given field arrangement, let the form's metadata define
  // the set of field names as those fields which are not read-only
  return metadata
    .filter((fieldInfo) => !fieldInfo.read_only)
    .map((fieldInfo) => fieldInfo.key);
};

export const getFieldArrangement = (metadata, fieldArrangement) => {
  if (!(metadata || fieldArrangement)) {
    throw new Error('Unable to determine field arrangement. You must supply field arrangement or a map of field metadata');
  }

  const fieldNames = getFieldNames(metadata, fieldArrangement);

  if (!fieldArrangement) {
    return fieldNames;
  }

  return fieldArrangement.filter((fieldInfo) => {
    const fieldName = (typeof(fieldInfo) === 'object') ? fieldInfo.name : fieldInfo;
    return fieldNames.indexOf(fieldName) !== -1
  });
}


export const getFieldMetadataMap = (metadata) => {
  return metadata ? arrayToObject(metadata, 'key') : null;
};

//------------------------------------------------------------------------------
class Form extends React.PureComponent {
  static widgetClassMap = {
    'checkboxgroup': CheckboxGroupWidget,
    'itemlist': ItemListWidget,
    'modelselect': ModelSelectWidget,
    'radiogroup': RadioGroupWidget,
  };


  static registerWidgetClass(widgetType, WidgetClass) {
    this.widgetClassMap[widgetType] = WidgetClass;
  }


  static widgetClassForType(widgetType) {
    return widgetType ? this.widgetClassMap[widgetType] : null;
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

  componentDidUpdate() {
    if (this.props.onConfig) {
      this.props.onConfig({
        requestUrl: this.requestUrl,
      });
    }
  }


  get detailUrl() {
    const {
      apiDetailUrl,
      apiDetailUrlPath,
      persistedObject,
    } = this.props;

    let representedObjectId = this.props.representedObjectId;
    if (!representedObjectId && persistedObject) {
      representedObjectId = persistedObject.id;
    }

    let detailUrl = null;
    if (apiDetailUrl) {
      detailUrl = apiDetailUrl;
    } else if (persistedObject && persistedObject.url) {
      detailUrl = persistedObject.url;
    } else if (apiDetailUrlPath && representedObjectId) {
      detailUrl = reverse(apiDetailUrlPath, {pk: representedObjectId});
    }
    return detailUrl;
  }


  get requestUrl() {
    return this.detailUrl || this.props.apiCreateUrl;
  }


  initialData(metadata, referenceObject) {
    const initialData = {};

    const fieldNames = getFieldNames(metadata, this.props.fieldArrangement);
    const fieldMetadataMap = getFieldMetadataMap(metadata);

    fieldNames.forEach((fieldName) => {
      const fieldMetadata = fieldMetadataMap[fieldName];
      const value = referenceObject[fieldName];
      initialData[fieldName] = fromRepresentation(value, fieldMetadata, this);
    });

    return cloneDeep(initialData);
  }


  coerceRequestData(data) {
    const coercedData = { ...data };

    const fieldMetadataMap = getFieldMetadataMap(this.state.metadata);
    if (fieldMetadataMap) {
      Object.keys(data).forEach((fieldName) => {
        const fieldMetadata = fieldMetadataMap[fieldName];
        const value = data[fieldName];
        if (fieldMetadata) {
          coercedData[fieldName] = toRepresentation(value, fieldMetadata, this);
        }
      });
    }

    // Inject any additionally supplied context parameters
    Object.assign(coercedData, this.props.extraRequestParams);

    return coercedData;
  }


  setValues = (values) => {
    const updatedFormData = {...this.state.formData, ...values };
    this.setState({ formData: updatedFormData });
  };


  setValue = (fieldName, value) => {
    this.setValues({ [fieldName]: value });
  };


  load = async() => {
    this.setState({ loading: true });

    const {
      defaultValues,
      optionsRequestParams,
      onLoad,
      persistedObject,
    } = this.props;

    let referenceObject = persistedObject;
    const requests = [];

    // Issue an OPTIONS request for metadata about the represented object
    // so the fields can be generated dynamically.
    requests.push(ServiceAgent.options(this.requestUrl, {
      ...optionsRequestParams,
      action: this.detailUrl ? 'update' : 'create'
    }));

    if (!referenceObject) {
      if (this.detailUrl) {
        // If an original object was not explicitly provided, attempt to load one from the given detailUrl
        requests.push(ServiceAgent.get(this.detailUrl));
      } else {
        referenceObject = { ...defaultValues };
        Object.keys(referenceObject).forEach((key) => {
          const value = referenceObject[key];
          if (typeof(value) === 'function') {
            referenceObject[key] = value();
          }
        });
      }
    }

    const responses = await(Promise.all(requests));

    const metadata = responses[0].jsonData;
    if (responses.length > 1) {
      referenceObject = responses[1].jsonData;
    }

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

    if (onLoad) {
      onLoad(referenceObject, getFieldMetadataMap(metadata));
    }
  };


  save = async() => {
    const { updateMethod } = this.props;
    const { formData, metadata, referenceObject } = this.state;

    this.setState({ errors: {}, saving: true });

    let requestMethod = null;
    let requestData = null;

    if (this.detailUrl) {
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
      requestData = formData;
      requestMethod = 'POST';
    }

    if (!(requestMethod && this.requestUrl && requestData)) {
      throw new Error('Missing one or more required parameters for form request');
    }

    try {
      requestData = this.coerceRequestData(requestData);

      if (this.props.onWillSave) {
        this.props.onWillSave(requestData);
      }

      const response = await ServiceAgent.request(requestMethod, this.requestUrl, requestData);
      const updatedObject = response.jsonData;

      this.setState({
        saving: false,
        referenceObject: updatedObject,
      });

      if (this.props.onSave) {
        this.props.onSave(updatedObject, response);
      }

      return updatedObject;
    } catch (err) {
      this.setState({
        saving: false,
        errors: err.response ? err.response.jsonData : {},
      });

      if (this.props.onError) {
        this.props.onError(err);
      }
    }
  };


  handleFormSubmit = (e) => {
    e.preventDefault();

    // Due to event bubbling, a <form> is submitted within a dialog that
    // is rendered atop a view that also has a <form>, the underlying
    // form also gets submitted.
    // Stopping the form submission event propagation ensures that only
    // the explicitly submitted form gets processed.
    e.stopPropagation();


    this.save();
  };


  /**
   * Whenever a value in the form changes, if the form has been configured to
   * autosave after a given delay period, set up a timer to do so.
   * NOTE: This is only applicable when editing a persisted record.
   */
  handleFormChange = (e) => {
    // See comment above (in handleFormSubmit) for explanation for why
    // event propagation is stopped here.
    e.stopPropagation();

    if (this.detailUrl && this.props.autosaveDelay) {
      if (this.autoSaveTimer) {
        clearTimeout(this.autoSaveTimer);
      }
      this.autoSaveTimer = setTimeout(() => {
        if (!this.state.saving) {
          this.save();
        }
      }, this.props.autosaveDelay);
    }
  };


  /**
   * Callback fired when a form field's value changes.
   * For the moment its only effect is to clear the respective field error.
   */
  handleFormFieldChange = (value, fieldInfo) => {
    const updatedErrors = { ...this.state.errors };
    delete updatedErrors[fieldInfo.key];
    this.setState({ errors: updatedErrors });

    if (this.props.onFieldChange) {
      this.props.onFieldChange(value, fieldInfo);
    }
  };


  render() {
    const { loading, referenceObject, metadata } = this.state;
    if (loading || !referenceObject) {
      return null;
    }

    return (
      <form
        onSubmit={this.handleFormSubmit}
        onChange={this.handleFormChange}
        ref={this.formRef}
      >
        <this.props.FieldSetComponent
          errors={this.state.errors}
          fieldArrangement={getFieldArrangement(metadata, this.props.fieldArrangement)}
          form={this}
          onFieldChange={this.handleFormFieldChange}
          metadata={metadata}
          representedObject={referenceObject}
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
  extraRequestParams: PropTypes.object,
  FieldSetComponent: PropTypes.func,
  fieldArrangement: PropTypes.array,
  fieldInfoProvider: PropTypes.func,
  onFieldChange: PropTypes.func,
  onConfig: PropTypes.func,
  onError: PropTypes.func,
  onLoad: PropTypes.func,
  onMount: PropTypes.func,
  onSave: PropTypes.func,
  onWillSave: PropTypes.func,
  onUnmount: PropTypes.func,
  optionsRequestParams: PropTypes.object,
  persistedObject: PropTypes.object,
  representedObjectId: PropTypes.number,
  updateMethod: PropTypes.oneOf(['PUT', 'PATCH']),
};

Form.defaultProps = {
  autosaveDelay: null,
  defaultValues: {},
  extraRequestParams: {},
  entityType: '',
  FieldSetComponent: FormFieldSet,
  optionsRequestParams: {},
  updateMethod: 'PATCH',
};

export default Form;
