import { storageOfType } from '../util/storage';

class StorageManager {
  static localValue(key) {
    const storage = storageOfType('localStorage');
    return storage ? storage.getItem(key) : null;
  }

  static setLocalValue(key, value) {
    const storage = storageOfType('localStorage');
    if (!storage) {
      return;
    }
    storage.setItem(key, value);
  }

  static removeLocalValue(key, value) {
    const storage = storageOfType('localStorage');
    if (!storage) {
      return;
    }
    storage.removeItem(key, value);
  }
}

export default StorageManager;
