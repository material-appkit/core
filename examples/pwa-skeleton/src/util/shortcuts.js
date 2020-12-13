import StorageManager from '@material-appkit/core/managers/StorageManager';

export function activeLocale() {
  return (
    StorageManager.localValue('locale') ||
    (window.navigator.userLanguage || window.navigator.language) ||
    'en-US'
  );
}

export function staticUrl(relativeUrl) {
  return `${process.env.PUBLIC_URL}/${relativeUrl}`;
}
