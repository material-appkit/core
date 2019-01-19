import PropTypes from 'prop-types';
import React from 'react';

class ViewController extends React.PureComponent {
  componentDidMount() {
    this.props.onMount(this, this.props.mountPath);
  }

  componentWillUnmount() {
    this.props.onUnmount(this, this.props.mountPath);
  }

  render() {
    return this.props.children;
  }
}

ViewController.propTypes = {
  children: PropTypes.any,
  onMount: PropTypes.func.isRequired,
  onUnmount: PropTypes.func.isRequired,
  mountPath: PropTypes.string,
};

export default ViewController;
