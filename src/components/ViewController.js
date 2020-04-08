import PropTypes from 'prop-types';
import React from 'react';

class ViewController extends React.PureComponent {
  componentDidMount() {
    const {
      mountPath,
      onMount,
    } = this.props;

    if (onMount) {
      onMount(this, mountPath);
    }
  }

  componentDidUpdate(prevProps) {
    const {
      mountPath,
      onUpdate,
    } = this.props;

    if (onUpdate) {
      onUpdate(this, mountPath);
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
  mountPath: PropTypes.string,
  onMount: PropTypes.func,
  onUpdate: PropTypes.func,
  onUnmount: PropTypes.func,
};

export default ViewController;
