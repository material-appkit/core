import HomeIcon from '@material-ui/icons/Home';

import { SlideUpTransition } from './transitions';

import { E_REQUEST_ABORTED } from 'variables';

import paths from 'paths';

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


export function applicationNavLinkArrangement(context) {
  const navLinkArrangement = [
    { title: 'Home', Icon: HomeIcon, path: paths.index },
  ];

  return navLinkArrangement;
}
