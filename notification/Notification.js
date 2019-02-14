"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
  * Plagerized verbatim from Cocoa's NSNotification:
  *
 * NSNotification objects encapsulate information so that it can be broadcast to other objects by an NSNotificationCenter object.
 * An NSNotification object (referred to as a notification) contains a name, an object, and an optional dictionary.
 * The name is a tag identifying the notification. The object is any object that the poster of the notification wants to send
 * to observers of that notification (typically, it is the object that posted the notification).
 * The dictionary stores other related objects, if any. NSNotification objects are immutable objects.
 *
 * You can create a notification object with the class methods notificationWithName:object: or notificationWithName:object:userInfo:.
 * However, you don’t usually create your own notifications directly.
 * The NSNotificationCenter methods postNotificationName:object: and postNotificationName:object:userInfo: allow you to conveniently
 * post a notification without creating it first.
 */
var Notification =
/**
 * Returns a notification object with a specified name, object, and user information.
 *
 * @param notificationName The name for the new notification. May not be nil.
 * @param anObject The object for the new notification.
 * @param userInfo The user information dictionary for the new notification. May be nil.
 */
function Notification(notificationName, anObject, context) {
  _classCallCheck(this, Notification);

  this.name = notificationName;
  this.object = anObject;
  this.context = context;
};

exports.default = Notification;