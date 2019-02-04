import { updatedDiff } from 'deep-object-diff';

import PropTypes from 'prop-types';
import React from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import withStyles from '@material-ui/core/styles/withStyles';

import { ServiceAgent } from '../util';
import { decorateErrors } from '../util/component';
import { reverse } from '../util/urls';

import { formToObject } from '../util/form';

const FIELD_TYPE_MAP = {
  'integer': 'number',
  'float': 'number',
  'decimal': 'number',
  'date': 'date',
  'email': 'email',
  'field': 'text',
  'string': 'text',
};

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
    if (props.persistedObject) {
      detailUrl = reverse(this.props.apiDetailUrlPath, { pk: props.persistedObject.id });
    } else if (props.representedObjectId) {
      detailUrl = reverse(this.props.apiDetailUrlPath, { pk: props.representedObjectId });
    }
    this.detailUrl = detailUrl;

    this.autoSaveTimer = null;
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
      return this.props.fieldArrangement;
    }

    if (this.state.fieldInfoMap) {
      return Object.keys(this.state.fieldInfoMap);
    }

    return null;
  }

  load = async() => {
    this.setState({ loading: true });

    let referenceObject = this.props.persistedObject;
    let fieldInfoMap = null;
    const requests = [];

    // If the fields have not been explicitly provided, issue an OPTIONS request for
    // metadata about the represented object so the fields can be generated dynamically.
    const optionsUrl = this.detailUrl || this.props.apiCreateUrlPath;
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
        const optionsResponse = response.body;
        if (this.detailUrl) {
          fieldInfoMap = optionsResponse.actions.PUT;
        } else {
          fieldInfoMap = optionsResponse.actions.POST;
        }
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

  save = async(form) => {
    this.setState({ errors: {}, saving: true });

    const formData = formToObject(form);

    let saveRequest = null;
    if (this.detailUrl) {
      const pendingChanges = updatedDiff(this.state.referenceObject, formData);
      saveRequest = this.props.serviceAgent.patch(this.detailUrl, pendingChanges);
    } else {
      saveRequest = this.props.serviceAgent.post(this.props.apiCreateUrlPath, formData);
    }

    try {
      const response = await saveRequest;
      const persistedObject = response.body;

      this.setState({
        saving: false,
        referenceObject: persistedObject
      });
      if (this.props.onSave) {
        this.props.onSave(persistedObject);
      }
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
        } else {
          const textFieldProps = {
            className: classes.field,
            disabled: this.state.saving,
            key: fieldName,
            fullWidth: true,
            label: fieldInfo.label,
            margin: "dense",
            name: fieldName,
            defaultValue,
            variant: "outlined",
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

    this.save(e.target);
  };


  handleFormChange = (e) => {
    if (this.props.autosaveDelay !== null) {
      const formElement = e.currentTarget;

      if (this.autoSaveTimer) {
        clearTimeout(this.autoSaveTimer);
      }
      this.autoSaveTimer = setTimeout(() => {
        this.save(formElement);
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
  apiCreateUrlPath: PropTypes.string,
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
};

Form.defaultProps = {
  autosaveDelay: null,
  defaultValues: {},
  autosave: false,
  entityType: '',
  serviceAgent: new ServiceAgent(),
};

export default withStyles((theme) => {
  return theme.form;
})(Form);
