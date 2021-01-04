import { storageOfType } from '../util/storage';

/**
 *
 */
class StorageManager {
  /**
   *
   * @param {string} key
   * @returns {string|number|Date}
   */
  static localValue(key) {
    const storage = storageOfType('localStorage');
    return storage ? storage.getItem(key) : null;
  }


  /**
   *
   * @param {string} key
   * @param {string|number|Date} value
   */
  static setLocalValue(key, value) {
    const storage = storageOfType('localStorage');
    if (!storage) {
      return;
    }
    storage.setItem(key, value);
  }


  /**
   *
   * @param {string} key
   */
  static removeLocalValue(key) {
    const storage = storageOfType('localStorage');
    if (!storage) {
      return;
    }
    storage.removeItem(key);
  }
}

export default StorageManager;
