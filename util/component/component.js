import React from 'react';

export function recursiveMap(children, transform) {
  return React.Children.map(children, (child) => {
    // If the given child is not a React component, simply return it
    if (!React.isValidElement(child)) {
      return child;
    }

    if (child.props.children) {
      child = React.cloneElement(child, {
        children: recursiveMap(child.props.children, transform),
      });
    }

    return transform(child);
  });
}

export function decorateErrors(rootComponent, errorMap) {
  if (errorMap === null) {
    return rootComponent;
  }

  const applyErrorProps = (child) => {
    // If this component doesn't have a name prop, it can't possibly be
    // decorated with an error message.
    if (child.props.name) {
      const errorMessages = errorMap[child.props.name];
      if (errorMessages) {
        const errorProps = { error: true };
        if (child.props.select === false) {
          errorProps.helperText = errorMessages;
        }
        return React.cloneElement(child, errorProps);
      }
    }

    return child;
  };

  return recursiveMap(rootComponent, applyErrorProps);
}
