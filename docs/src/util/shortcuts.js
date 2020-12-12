import StorageManager from '@material-appkit/core/managers/StorageManager';

export function activeLocale() {
  return (
    StorageManager.localValue('locale') ||
    (window.navigator.userLanguage || window.navigator.language) ||
    'en-US'
  );
}
