import { storageOfType } from '../util/storage';

/**
 *
 */
class StorageManager {
  /**
   *
   * @param {String} key
   * @returns {string|number|Date}
   *
   * @static
   */
  static localValue(key) {
    const storage = storageOfType('localStorage');
    return storage ? storage.getItem(key) : null;
  }


  /**
   *
   * @param {String} key
   * @param {string|number|Date} value
   *
   * @static
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
   * @param {String} key
   *
   * @static
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
