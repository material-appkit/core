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
import { arrayToObject } from '../util/array';
import { reverse } from '../util/urls';
import { fromRepresentation, toRepresentation } from './FormField';

//------------------------------------------------------------------------------
export const getFieldNames = (metadata, fieldArrangement) => {
  if (!(metadata || fieldArrangement)) {
    throw new Error('Unable to determine form field names. You must supply field arrangement or a map of field metadata');
  }

  if (fieldArrangement) {
    const fieldNames = [];
    fieldArrangement.forEach((fieldInfo) => {
      if (Array.isArray(fieldInfo)) {
        fieldNames.push(...getFieldNames(metadata, fieldInfo));
      } else {
        const fieldInfoType = typeof(fieldInfo);
        if (fieldInfoType === 'string') {
          fieldNames.push(fieldInfo);
        } else if (fieldInfoType === 'object') {
          fieldNames.push(fieldInfo.name)
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

export const getFieldInfoMap = (metadata) => {
  if (!metadata) {
    return null;
  }

  return arrayToObject(metadata, 'key');
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

    let representedObjectId = props.representedObjectId;
    if (!representedObjectId && props.persistedObject) {
      representedObjectId = props.persistedObject.id;
    }

    let detailUrl = null;
    if (props.apiDetailUrl) {
      detailUrl = props.apiDetailUrl;
    } else if (props.persistedObject && props.persistedObject.url) {
      detailUrl = props.persistedObject.url;
    } else if (this.props.apiDetailUrlPath && representedObjectId) {
      detailUrl = reverse(this.props.apiDetailUrlPath, {pk: representedObjectId});
    }
    this.detailUrl = detailUrl;

    this.requestUrl = this.detailUrl || this.props.apiCreateUrl;
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

  initialData(metadata, referenceObject) {
    const data = {};

    const fieldNames = getFieldNames(metadata, this.props.fieldArrangement);
    const fieldInfoMap = getFieldInfoMap(metadata);

    fieldNames.forEach((fieldName) => {
      const fieldInfo = fieldInfoMap[fieldName];
      data[fieldName] = fromRepresentation(referenceObject[fieldName], fieldInfo);
    });

    return cloneDeep(data);
  }


  coerceRequestData(data) {
    const coercedData = { ...data };

    const fieldInfoMap = getFieldInfoMap(this.state.metadata);
    if (fieldInfoMap) {
      Object.keys(data).forEach((fieldName) => {
        const fieldInfo = fieldInfoMap[fieldName];
        const value = data[fieldName];
        if (fieldInfo) {
          coercedData[fieldName] = toRepresentation(value, fieldInfo, this);
        }
      });
    }

    // Inject any additionally supplied context parameters
    Object.assign(coercedData, this.props.requestContext);

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

    const {
      defaultValues,
      optionsRequestParams,
      onLoad,
      persistedObject,
    } = this.props;

    let referenceObject = persistedObject;
    let metadata = null;
    const requests = [];

    // If the fields have not been explicitly provided, issue an OPTIONS request for
    // metadata about the represented object so the fields can be generated dynamically.
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

    if (onLoad) {
      onLoad(referenceObject, getFieldInfoMap(metadata));
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
      const persistedObject = response.body;

      this.setState({
        saving: false,
        referenceObject: persistedObject,
      });

      if (this.props.onSave) {
        this.props.onSave(persistedObject, response);
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
  };

  render() {
    if (this.state.loading || !this.state.referenceObject) {
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
          fieldArrangement={this.props.fieldArrangement}
          form={this}
          onFieldChange={this.handleFormFieldChange}
          metadata={this.state.metadata}
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
  requestContext: PropTypes.object,
  FieldSetComponent: PropTypes.func,
  fieldArrangement: PropTypes.array,
  fieldInfoProvider: PropTypes.func,
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
  entityType: '',
  FieldSetComponent: FormFieldSet,
  optionsRequestParams: {},
  requestContext: {},
  updateMethod: 'PATCH',
};

export default Form;
