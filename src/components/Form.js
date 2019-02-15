import { updatedDiff } from 'deep-object-diff';

import PropTypes from 'prop-types';
import React from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import withStyles from '@material-ui/core/styles/withStyles';

import { ServiceAgent } from '../util';
import { arrayToObject } from '../util/array';
import { decorateErrors } from '../util/component';
import { formToObject } from '../util/form';
import { reverse } from '../util/urls';

import ItemListField from './ItemListField';

class Form extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      errors: {},
      referenceObject: null,
      fieldInfoMap: null,
      loading: false,
      saving: false,
    };

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

    this.autoSaveTimer = null;

    this.formRef = React.createRef();

    this.fieldNames = [];
    this.fieldArrangementMap = {};
    if (props.fieldArrangement) {
      props.fieldArrangement.forEach((fieldInfo) => {
        if (typeof(fieldInfo) === 'string') {
          fieldInfo = { name: fieldInfo };
        }
        this.fieldNames.push(fieldInfo.name);
        this.fieldArrangementMap[fieldInfo.name] = fieldInfo;
      });
    }
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

  load = async() => {
    this.setState({ loading: true });

    let referenceObject = this.props.persistedObject;
    let fieldInfoMap = null;
    const requests = [];

    // If the fields have not been explicitly provided, issue an OPTIONS request for
    // metadata about the represented object so the fields can be generated dynamically.
    const optionsUrl = this.detailUrl || this.props.apiCreateUrl;
    requests.push(this.props.serviceAgent.options(optionsUrl));

    if (!referenceObject) {
      if (this.detailUrl) {
        // If an original object was not explicitly provided, attempt to load one from the given detailUrl
        requests.push(this.props.serviceAgent.get(this.detailUrl));
      } else {
        referenceObject = this.props.defaultValues;
      }
    }

    let responses = await(Promise.all(requests));

    responses.forEach((response) => {
      if (response.req.method === 'OPTIONS') {
        fieldInfoMap = arrayToObject(response.body, 'key');
      } else {
        referenceObject = response.body;
      }
    });


    if (!referenceObject) {
      throw new Error('Failed to initialize form');
    }

    this.setState({
      fieldInfoMap,
      referenceObject,
      loading: false,
    });

    if (this.props.onLoad) {
      this.props.onLoad(referenceObject, fieldInfoMap);
    }
  };

  save = async() => {
    const { serviceAgent, updateMethod } = this.props;

    this.setState({ errors: {}, saving: true });

    const form = this.formRef.current;
    const formData = formToObject(form);

    let saveRequest = null;
    const detailUrl = this.detailUrl;
    if (detailUrl) {
      if (updateMethod === 'PATCH') {
        const pendingChanges = updatedDiff(this.state.referenceObject, formData);
        saveRequest = serviceAgent.patch(detailUrl, pendingChanges);
      } else {
        saveRequest = serviceAgent.put(detailUrl, formData);
      }
    } else {
      saveRequest = serviceAgent.post(this.props.apiCreateUrl, formData);
    }

    try {
      const response = await saveRequest;
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

  get fields() {
    if (this.props.fields) {
      return this.props.fields;
    }

    const { classes } = this.props;
    const referenceObject = this.state.referenceObject;

    const fields = [];
    this.fieldNames.forEach((fieldName) => {
      const fieldInfo = this.state.fieldInfoMap[fieldName];
      if (!fieldInfo.read_only) {
        let field = null;
        const defaultValue = this.state.referenceObject[fieldName] || '';

        if (fieldInfo.hidden) {
          field = (
            <input type="hidden" name={fieldName} defaultValue={defaultValue} />
          );
        } else if (fieldInfo.type === 'itemlist') {
          const fieldArrangementInfo = this.fieldArrangementMap[fieldName];
          field = (
            <ItemListField
              defaultItems={referenceObject[fieldName]}
              listUrl={`${fieldInfo.related_endpoint.singular}/`}
              name={fieldName}
              ServiceAgent={this.props.serviceAgent}
              {...fieldArrangementInfo}
            />
          );
        } else {
          const textFieldProps = {
            className: classes.field,
            disabled: this.state.saving,
            key: fieldName,
            fullWidth: true,
            label: fieldInfo.ui.label,
            margin: "dense",
            name: fieldName,
            defaultValue,
            variant: "outlined",
          };

          if (fieldInfo.choices) {
            textFieldProps.select = true;
            textFieldProps.SelectProps = { native: true };
          } else {
            const inputType = fieldInfo.type;
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

          field = (
            <TextField {...textFieldProps }>
              {fieldInfo.choices &&
                <React.Fragment>
                  <option />
                  {fieldInfo.choices.map((choice) => (
                    <option key={choice.value} value={choice.value}>{choice.display_name}</option>
                  ))}
                </React.Fragment>
              }
            </TextField>
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
  get children() {
    return React.Children.map(this.props.children, (child) => {
      if (!child) {
        return child;
      }
      return React.cloneElement(child, { disabled: this.state.saving });
    });
  }

  handleFormSubmit = (e) => {
    e.preventDefault();

    this.save();
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
        <div style={loadingIndicatorContainerStyle}><CircularProgress /></div>
      );
    }

    return (
      <form
        onSubmit={this.handleFormSubmit}
        onChange={this.handleFormChange}
        ref={this.formRef}
      >
        <React.Fragment>
          {decorateErrors(this.fields, this.state.errors)}
          {this.children}
        </React.Fragment>
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
  classes: PropTypes.object.isRequired,
  defaultValues: PropTypes.object,
  entityType: PropTypes.string,
  fields: PropTypes.any,
  fieldArrangement: PropTypes.array,
  representedObjectId: PropTypes.number,
  onMount: PropTypes.func,
  onUnmount: PropTypes.func,
  onLoad: PropTypes.func,
  onSave: PropTypes.func,
  onError: PropTypes.func,
  persistedObject: PropTypes.object,
  loadingIndicator: PropTypes.node,
  serviceAgent: PropTypes.object,
  updateMethod: PropTypes.oneOf(['PUT', 'PATCH'])
};

Form.defaultProps = {
  autosaveDelay: null,
  defaultValues: {},
  autosave: false,
  entityType: '',
  serviceAgent: new ServiceAgent(),
  updateMethod: 'PATCH',
};

export default withStyles((theme) => {
  return theme.form;
})(Form);
