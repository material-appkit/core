import { SlideUpTransition } from './transitions';

import { E_REQUEST_ABORTED } from 'variables';

export function abortRequest(requestContext) {
  if (requestContext && requestContext.abortController) {
    requestContext.abortController.abort();
  }
}

export function handleException(error, errorInfo) {
  if (error.name === E_REQUEST_ABORTED) {
    return;
  }

  console.log(error, errorInfo);
}


export const dialogProps = (fullScreen) => {
  const dialogProps = {};

  if (fullScreen) {
    dialogProps.TransitionComponent = SlideUpTransition;
    dialogProps.fullScreen = true;
  } else {
    dialogProps.fullWidth = true;
    dialogProps.maxWidth = 'sm';
  }

  return dialogProps;
};


export const pathnameForUrl = (url) => {
  let pathname = url;
  const hashIndex = pathname.lastIndexOf('#');
  if (hashIndex !== -1) {
    pathname = pathname.substring(0, hashIndex);
  }
  return pathname;
};
