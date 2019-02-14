import PropTypes from 'prop-types';
import React from 'react';

class ViewController extends React.PureComponent {
  componentDidMount() {
    if (this.props.onMount) {
      this.props.onMount(this, this.props.mountPath);
    }
  }

  componentDidUpdate() {
    if (this.props.onUpdate) {
      this.props.onUpdate(this, this.props.mountPath);
    }
  }

  componentWillUnmount() {
    if (this.props.onUnmount) {
      this.props.onUnmount(this, this.props.mountPath);
    }
  }

  render() {
    return this.props.children;
  }
}

ViewController.propTypes = {
  children: PropTypes.any,
  onMount: PropTypes.func,
  onUpdate: PropTypes.func,
  onUnmount: PropTypes.func,
  mountPath: PropTypes.string,
};

export default ViewController;
