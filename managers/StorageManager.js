import Cookies from 'js-cookie';
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


  /**
   *
   * @param key
   * @param options
   */
  static getCookie(key, options) {
    return Cookies.get(key, options);
  }


  /**
   *
   * @param key
   * @param value
   * @param options
   */
  static setCookie(key, value, options) {
    Cookies.set(key, value, options);
  }


  /**
   *
   * @param key
   * @param options
   */
  static removeCookie(key, options) {
    return Cookies.remove(key, options);
  }
}

export default StorageManager;
