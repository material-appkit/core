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
   */
  static getCookie(key) {
    return Cookies.get(key);
  }


  /**
   *
   * @param key
   * @param value
   */
  static setCookie(key, value) {
    Cookies.set(key, value);
  }


  /**
   *
   * @param key
   */
  static removeCookie(key) {
    return Cookies.remove(key);
  }
}

export default StorageManager;
