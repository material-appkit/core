import NotificationCenter from '../util/NotificationCenter';

/**
 * @summary
 * High-level API for the default NotificationCenter
 */
export default class NotificationManager {
  static defaultCenter = new NotificationCenter();

  /**
   *
   * @param {String} notificationName
   * @param {Object} notificationSender
   * @param {Object} context
   */
  static postNotification(notificationName, notificationSender, context) {
    this.defaultCenter.postNotification(notificationName, notificationSender, context);
  }


  /**
   *
   * @param {Object} notificationObserver
   * @param {Function} callback
   * @param {String} notificationName
   * @param {Object} notificationSender
   */
  static addObserver(notificationObserver, callback, notificationName, notificationSender) {
    this.defaultCenter.addObserver(notificationObserver, callback, notificationName, notificationSender);
  }


  /**
   *
   * @param {Object} notificationObserver
   * @param {String} notificationName
   * @param {Object} notificationSender
   */
  static removeObserver(notificationObserver, notificationName, notificationSender) {
    this.defaultCenter.removeObserver(notificationObserver, notificationName, notificationSender);
  }
}


/**
 * Generic class that may be registered to perform the given callback in response to a notification
 */
export class NotificationObserver {
  constructor(callback, context) {
    this.callback = callback;
    this.context = context;
  }
}