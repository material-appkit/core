import isEqual from 'lodash.isequal';

import PropTypes from 'prop-types';
import React from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import withStyles from '@material-ui/core/styles/withStyles';

import { ServiceAgent } from '../util';
import { arrayToObject } from '../util/array';
import { recursiveMap } from '../util/component';
import { formToObject } from '../util/form';
import { reverse } from '../util/urls';

import FormFieldSet from './FormFieldSet';

class Form extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      errors: {},
      referenceObject: null,
      formData: null,
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

  get fieldNames() {
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
    } else if (this.state.metadata) {
      return this.state.metadata
        .filter((fieldInfo) => !fieldInfo.read_only)
        .map((fieldInfo) => fieldInfo.key);
    } else {
      return [];
    }
  }

  get fieldArrangementMap() {
    const fieldArrangementMap = {};
    if (this.props.fieldArrangement) {
      this.props.fieldArrangement.forEach((fieldInfo) => {
        if (typeof(fieldInfo) === 'string') {
          fieldInfo = { name: fieldInfo };
        }
        fieldArrangementMap[fieldInfo.name] = fieldInfo;
      });
    } else if (this.state.metadata) {
      this.state.metadata.forEach((fieldInfo) => {
        if (!fieldInfo.read_only) {
          const fieldName = fieldInfo.key;
          fieldArrangementMap[fieldName] = { name: fieldName };
        }
      });
    }
    return fieldArrangementMap;
  }

  get fieldInfoMap() {
    if (!this.state.metadata) {
      return null;
    }

    return arrayToObject(this.state.metadata, 'key');
  }

  /**
   * Decorate any given children with a 'disabled' prop while saving
   */
  get children() {
    const disabled = this.state.saving;
    return recursiveMap(this.props.children, (child) => {
      return React.cloneElement(child, { disabled });
    });
  }

  initialData(metadata, referenceObject) {
    const data = {};
    metadata.forEach((fieldInfo) => {
      const fieldName = fieldInfo.key;
      if (!fieldInfo.read_only) {
        let value = referenceObject[fieldName];
        if (value === undefined || value === null) {
          switch (fieldInfo.type) {
            case 'itemlist':
              value = [];
              break;
            default:
              value = '';
              break;
          }
        }
        data[fieldName] = value;
      }
    });

    return data;
  }


  coerceRequestData(data) {
    const fieldInfoMap = this.fieldInfoMap;
    if (!fieldInfoMap) {
      return data;
    }

    const coercedData = {};
    Object.keys(data).forEach((fieldName) => {
      const fieldInfo = fieldInfoMap[fieldName];
      if (fieldInfo) {
        const value = data[fieldName];
        // For values representing dates, convert the empty string to null
        if (fieldInfo.type === 'date' && value === '') {
          coercedData[fieldName] = null;
        } else if (fieldInfo.type === 'itemlist') {
          coercedData[fieldName] = value.map((item) => item.url);
        } else {
          coercedData[fieldName] = value;
        }
      }
    });
    return coercedData;
  }

  setValues = (values) => {
    const newValues = Object.assign({}, this.state.formData, values);
    this.setState({ formData: newValues });
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
      this.props.onLoad(referenceObject, this.fieldInfoMap);
    }
  };

  save = async() => {
    const { updateMethod } = this.props;
    const { formData } = this.state;

    this.setState({ errors: {}, saving: true });

    let requestUrl = null;
    let requestMethod = null;
    let requestData = null;

    const detailUrl = this.detailUrl;
    if (detailUrl) {
      requestUrl = detailUrl;
      if (updateMethod === 'PATCH') {
        const changedData = {};
        Object.keys(formData).forEach((key) => {
          const value = formData[key];
          if (!isEqual(value, this.state.referenceObject[key])) {
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
      throw new Error('Missing one or more required paramers for form request');
    }


    try {
      requestData = this.coerceRequestData(requestData);
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

    if (e.target === this.formRef.current) {
      // For some reason when a <form> is submitted within a dialog that
      // is rendered atop a view that also has a <form>, the underlying
      // form also gets submitted.
      // This check ensures that only the intended save method is invoked.
      this.save();
    }
  };


  handleFormChange = (e) => {
    if (this.props.autosaveDelay !== null) {
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
          fieldArrangementMap={this.fieldArrangementMap}
          fieldInfoMap={this.fieldInfoMap}
          fieldNames={this.fieldNames}
          form={this}
          representedObject={this.state.referenceObject}
          saving={this.state.saving}
          {...this.props.FieldSetProps}
        />
        {this.children}
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
  FieldSetProps: PropTypes.object,
  fieldArrangement: PropTypes.array,
  representedObjectId: PropTypes.number,
  onMount: PropTypes.func,
  onUnmount: PropTypes.func,
  onLoad: PropTypes.func,
  onSave: PropTypes.func,
  onError: PropTypes.func,
  persistedObject: PropTypes.object,
  loadingIndicator: PropTypes.node,
  updateMethod: PropTypes.oneOf(['PUT', 'PATCH'])
};

Form.defaultProps = {
  autosave: false,
  autosaveDelay: null,
  defaultValues: {},
  entityType: '',
  FieldSet: FormFieldSet,
  FieldSetProps: {},
  updateMethod: 'PATCH',
};

export default withStyles((theme) => {
  return theme.form;
})(Form);
