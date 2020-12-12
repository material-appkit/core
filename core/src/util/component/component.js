import React from 'react';

export function recursiveMap(children, transform, maxDepth, depth) {
  return React.Children.map(children, (child) => {
    // If the given child is not a React component, simply return it
    if (
      (!React.isValidElement(child)) ||
      (maxDepth && depth >= maxDepth)
    ) {
      return child;
    }

    if (child.props.children) {
      child = React.cloneElement(child, {
        children: recursiveMap(
          child.props.children,
          transform,
          maxDepth,
          (depth || 0) + 1
        ),
      });
    }

    return transform(child);
  });
}

export function decorateErrors(rootComponent, errorMap) {
  if (typeof(errorMap) !== 'object') {
    throw new Error('Expected param "errorMap" to be an object');
  }

  if (!Object.keys(errorMap).length) {
    return rootComponent;
  }

  return recursiveMap(rootComponent, (child) => {
      // If this component doesn't have a name prop, it can't possibly be
      // decorated with an error message.
      if (child.props.name) {
        const errorMessages = errorMap[child.props.name];
        if (errorMessages) {
          const errorProps = {
            error: true,
            helperText: errorMessages,
          };

          return React.cloneElement(child, errorProps);
        }
      }

      return child;
    }, null);
}
