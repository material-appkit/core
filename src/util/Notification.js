/**
  * Sourced from Cocoa's NSNotification:
  *
 * Notification objects encapsulate information so that it can be broadcast to other objects by an NotificationCenter object.
 * An Notification object (referred to as a notification) contains a name, an object, and an optional dictionary.
 * The name is a tag identifying the notification. The object is any object that the poster of the notification wants to send
 * to observers of that notification (typically, it is the object that posted the notification).
 * The dictionary stores other related objects, if any. Notification objects are immutable objects.
 *
 * You can create a notification object with the class methods notificationWithName:object: or notificationWithName:object:userInfo:.
 * However, you don’t usually create your own notifications directly.
 * The NotificationCenter methods postNotificationName:object: and postNotificationName:object:userInfo: allow you to conveniently
 * post a notification without creating it first.
 */
export default class Notification {
  /**
   * Returns a notification object with a specified name, object, and user information.
   *
   * @constructor
   * @param {string} notificationName The name for the new notification. May not be nil.
   * @param {object} anObject The object for the new notification.
   * @param {object} context The user information dictionary for the new notification. May be nil.
   */
  constructor(notificationName, anObject, context) {
    this.name = notificationName;
    this.object = anObject;
    this.context = context;
  }
}
