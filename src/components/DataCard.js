/**
*
* DataCard
*
*/

import PropTypes from 'prop-types';
import React from 'react';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import withStyles from '@material-ui/core/styles/withStyles';
import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';

import { recursiveMap } from '../util/component';

import Form from './Form';

class DataCard extends React.PureComponent {
  formRef = React.createRef();

  state = {
    mode: 'view',
  };

  toggleMode = async() => {
    const currentMode = this.state.mode;
    const newMode = currentMode === 'view' ? 'edit' : 'view';

    let shouldToggleView = true;

    if (currentMode === 'edit' && newMode === 'view') {
      // When toggling from edit to view mode, in the event that this
      // card is managing a form for its edit view, instruct the the form
      // to save before toggling back.
      if (this.formRef.current) {
        const record = await this.formRef.current.save();
        if (!record) {
          shouldToggleView = false;
        }
      }
    }

    if (shouldToggleView) {
      this.setState({ mode: newMode });
    }
  };

  get activeView() {
    const { mode } = this.state;

    const children = React.Children.toArray(this.props.children);
    const childCount = children.length;
    if (childCount < 1 || 2 < childCount) {
      throw new Error("A DataCard may only have ONE or TWO children");
    }

    if (childCount === 2) {
      return (mode === 'view') ? children[0] : children[1];
    }

    if (mode === 'edit' && this.props.formConfig) {
      return (
        <Form innerRef={this.formRef} {...this.props.formConfig} />
      );
    }
    // If there is a single child, allow it to manage its own presentation
    // via a given 'mode' prop.
    return recursiveMap(children[0], (child) => {
        return React.cloneElement(child, { mode });
    }, 2);
  }

  render() {
    const { classes, variant } = this.props;

    const cardClasses = {};
    const cardHeaderClasses = {
      action: classes.cardHeaderAction,
      title: classes.cardHeaderTitle,
    };
    const cardContentClasses = {};

    if (variant === 'card') {
      cardHeaderClasses.root = classes.cardHeaderRoot;
    }
    if (variant === 'plain') {
      cardClasses.root = classes.plainCardRoot;
      cardHeaderClasses.root = classes.plainCardHeaderRoot;
      cardContentClasses.root = classes.plainCardContentRoot;
    }

    return (
      <Card classes={cardClasses}>
        <CardHeader
          action={(
            <IconButton
              classes={{ root: classes.modeToggleButton }}
              color="primary"
              onClick={() => { this.toggleMode(); }}
            >
              {this.state.mode === 'view' ? (
                <EditIcon fontSize="small" />
              ): (
                <CheckIcon fontSize="small" />
              )}
            </IconButton>
          )}
          classes={cardHeaderClasses}
          title={this.props.title}
        />
        <CardContent classes={cardContentClasses}>
          {this.activeView}
        </CardContent>
      </Card>
    );
  }
}

DataCard.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]),
  classes: PropTypes.object.isRequired,
  formConfig: PropTypes.object,
  title: PropTypes.string,
  variant: PropTypes.oneOf(['card', 'plain'])
};

DataCard.defaultProps = {
  variant: 'card',
};

export default withStyles({
  modeToggleButton: {
    padding: 4,
  },

  cardHeaderAction: {
    marginTop: 0,
  },
  cardHeaderRoot: {
    backgroundColor: '#fafafa',
    padding: '2px 16px',
  },
  cardHeaderTitle: {
    fontSize: '1.1rem',
    fontWeight: 500,
  },

  plainCardRoot: {
    backgroundColor: 'inherit',
    boxShadow: 'none',
  },
  plainCardHeaderRoot: {
    padding: '2px 8px 2px 0px',
  },
  plainCardContentRoot: {
    padding: '0 !important',
  }
})(DataCard);
