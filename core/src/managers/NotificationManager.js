import NotificationCenter from '../notification/NotificationCenter';

export default class NotificationManager {
  static defaultCenter = new NotificationCenter();

  static postNotification(notificationName, notificationSender, context) {
    this.defaultCenter.postNotification(notificationName, notificationSender, context);
  }

  static addObserver(notificationObserver, callback, notificationName, notificationSender) {
    this.defaultCenter.addObserver(notificationObserver, callback, notificationName, notificationSender);
  }

  static removeObserver(notificationObserver, notificationName, notificationSender) {
    this.defaultCenter.removeObserver(notificationObserver, notificationName, notificationSender);
  }
}
