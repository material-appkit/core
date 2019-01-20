import NotificationCenter from '../notification/NotificationCenter';

export default class NotificationManager {
  static _defaultCenter = new NotificationCenter();

  static postNotification(notificationName, notificationSender, context) {
    this._defaultCenter.postNotification(notificationName, notificationSender, context);
  }

  static addObserver(notificationObserver, callback, notificationName, notificationSender) {
    this._defaultCenter.addObserver(notificationObserver, callback, notificationName, notificationSender);
  }

  static removeObserver(notificationObserver, notificationName, notificationSender) {
    this._defaultCenter.removeObserver(notificationObserver, notificationName, notificationSender);
  }
}
