import { E_REQUEST_ABORTED } from 'variables';

export function handleException(error, errorInfo) {
  if (error.name === E_REQUEST_ABORTED) {
    return;
  }

  console.log(error, errorInfo);
}


export const pathnameForUrl = (url) => {
  let pathname = url;
  const hashIndex = pathname.lastIndexOf('#');
  if (hashIndex !== -1) {
    pathname = pathname.substring(0, hashIndex);
  }
  return pathname;
};


export const fileContent = (nodes, filename) => {
  for (const node of nodes) {
    if (node.base === filename) {
      return node.internal.content;
    }
  }

  return null;
};
