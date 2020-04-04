import PropTypes from 'prop-types';
import React from 'react';

class ViewController extends React.PureComponent {
  componentDidMount() {
    const {
      match,
      mountPath,
      onMount,
      onAppear,
    } = this.props;

    if (match.isExact && onAppear) {
      onAppear(this, mountPath);
    }

    if (onMount) {
      onMount(this, mountPath);
    }
  }

  componentDidUpdate(prevProps) {
    const {
      location,
      match,
      mountPath,
      onUpdate,
      onAppear,
    } = this.props;

    if (match.isExact && (location.pathname !== prevProps.location.pathname)) {
      if (onAppear) {
        onAppear(this, mountPath);
      }
    }

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
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  mountPath: PropTypes.string,
  onMount: PropTypes.func,
  onUpdate: PropTypes.func,
  onAppear: PropTypes.func,
  onUnmount: PropTypes.func,
};

export default ViewController;
