import { updatedDiff } from 'deep-object-diff';

import PropTypes from 'prop-types';
import React from 'react';

import { observer } from 'mobx-react';

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

class Form extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: {},
      originalObject: null,
      fieldInfoMap: null,
      loading: false,
      saving: false,
    };

    let detailUrl = null;
    if (props.originalObject) {
      detailUrl = reverse(this.props.apiDetailUrlPath, { pk: props.originalObject.id });
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

    let originalObject = this.props.originalObject;

    const optionsRequest = ServiceAgent.options(this.detailUrl || this.props.apiCreateUrlPath);
    const requests = [optionsRequest];

    if (!this.props.originalObject && this.detailUrl) {
      requests.push(ServiceAgent.get(this.detailUrl));
    }

    let responses = await(Promise.all(requests));

    const optionsResponse = responses[0].body;
    let fieldInfoMap = null;
    if (this.detailUrl) {
      fieldInfoMap = optionsResponse.actions.PUT;
      if (responses.length === 2) {
        originalObject = responses[1].body;
      }
    } else {
      fieldInfoMap = optionsResponse.actions.POST;
      originalObject = this.props.defaultValues;
    }

    if (!(fieldInfoMap && originalObject)) {
      throw new Error('Failed to initialize form');
    }

    this.setState({
      fieldInfoMap,
      originalObject,
      loading: false,
    });

    if (this.props.onLoad) {
      this.props.onLoad(originalObject, fieldInfoMap);
    }
  };

  save = async(form) => {
    this.setState({ errors: {}, saving: true });

    const formData = formToObject(form);

    let saveRequest = null;
    if (this.detailUrl) {
      const pendingChanges = updatedDiff(this.state.originalObject, formData);
      saveRequest = ServiceAgent.patch(this.detailUrl, pendingChanges);
    } else {
      saveRequest = ServiceAgent.post(this.props.apiCreateUrlPath, formData);
    }

    try {
      const response = await saveRequest;
      this.setState({ saving: false });
      if (this.props.onSave) {
        this.props.onSave(response.body);
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
        const textFieldProps = {
          className: classes.field,
          disabled: this.state.saving,
          key: fieldName,
          fullWidth: true,
          label: fieldInfo.label,
          margin: "dense",
          name: fieldName,
          defaultValue: this.state.originalObject[fieldName] || '',
          variant: "outlined",
        };

        if (fieldInfo.choices) {
          textFieldProps.select = true;
          textFieldProps.SelectProps = { native: true };
        } else {
          textFieldProps.type = FIELD_TYPE_MAP[fieldInfo.type];
        }

        fields.push(
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


  render() {
    if (this.state.loading || !this.state.originalObject) {
      const loadingIndicatorContainerStyle = {
        display: 'flex',
        justifyContent: 'center',
      };
      return (
        <div style={loadingIndicatorContainerStyle}><CircularProgress /></div>
      );
    }

    return (
      <form onSubmit={this.handleFormSubmit}>
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
  children: PropTypes.any,
  classes: PropTypes.object.isRequired,
  defaultValues: PropTypes.object,
  entityType: PropTypes.string,
  fields: PropTypes.any,
  fieldArrangement: PropTypes.array,
  representedObject: PropTypes.object,
  representedObjectId: PropTypes.number,
  onMount: PropTypes.func,
  onUnmount: PropTypes.func,
  onLoad: PropTypes.func,
  onSave: PropTypes.func,
  onError: PropTypes.func,
  loadingIndicator: PropTypes.node,
};

Form.defaultProps = {
  defaultValues: {},
  entityType: '',
};

export default withStyles((theme) => {
  return theme.form;
})(observer(Form));
