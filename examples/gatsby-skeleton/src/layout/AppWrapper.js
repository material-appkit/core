import PropTypes from 'prop-types';

import React from 'react';

import { SnackbarProvider } from 'notistack';

import { handleException } from 'util/shortcuts';

import Application from './Application';


class AppWrapper extends React.PureComponent {
  static getDerivedStateFromError(error) {
    console.log('derive state for error', error);
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidMount() {
    window.addEventListener('unhandledrejection', function(event) {
      // the event object has two special properties:
      // event.promise: [object Promise] - The promise that generated the error
      // event.reason [object Error]: The unhandled error object
      handleException(event.reason, event.promise);
    });
  }

  componentDidCatch(error, errorInfo) {
    handleException(error, errorInfo);
  }

  render() {
    return (
      <SnackbarProvider maxSnack={3}>
        <Application>
          {this.props.rootElement}
        </Application>
      </SnackbarProvider>
    );
  }
}

AppWrapper.propTypes = {
  rootElement: PropTypes.element.isRequired,
};

export default AppWrapper;
