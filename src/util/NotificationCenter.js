import Notification from './Notification';

/**
 * It takes Notification objects and broadcasts them to any objects in the same task that have registered
 * to receive the notification with the task’s default notification center.
 *
 * Weak dictionary keys are used to allow notification senders to be eligible for garbage collection.
 *
 * Attribution: https://developer.apple.com/documentation/foundation/nsnotificationcenter
 *
 * @summary
 * A notification dispatch mechanism that enables the broadcast of information to registered observers.
 */
export default class NotificationCenter {
  _notificationSenders = {};

  /**
   * @constructor
   */
  constructor() {
    this._registerNotificationSender(null);
  }

  /**
   * @param notificationSender
   * @private
   */
  _registerNotificationSender(notificationSender) {
    const observers = {};
    observers[null] = [];
    this._notificationSenders[notificationSender] = observers;
  }

  /**
   * Creates a notification with a given name, sender, and information and posts it to the receiver.
   *
   * @param {string} notificationName
   * The name of the notification.
   *
   * @param {object} notificationSender
   * The object posting the notification.
   *
   * @param {object} context
   * Information about the the notification. May be null.
   *
   */
  postNotification(notificationName, notificationSender, context) {
    if (typeof(notificationName) !== 'string') {
      throw new Error('Expected notificationName to be of type String');
    }

    const notification = new Notification(notificationName, notificationSender, context);

    let invocations = null;

    invocations = this._notificationSenders[null][null];
    // Send notification to all observers who don't care what type it is or who it is from
    invocations.forEach((invocation) => {
      this._performInvocation(invocation, notification);
    });

    // Send notification to all observers who don't care who sent it
    invocations = this._notificationSenders[null][notificationName];
    if (invocations) {
      invocations.forEach((invocation) => {
        this._performInvocation(invocation, notification);
      });
    }

    // Send notification to observers interested only those dispatched by a given sender
    if (notificationSender && this._notificationSenders[notificationSender]) {
      invocations = this._notificationSenders[notificationSender][notificationName];
      if (invocations) {
        invocations.forEach((invocation) => {
          this._performInvocation(invocation, notification);
        });
      }
    }
  }


  /**
   *
   * @param invocation
   * @param notification
   * @private
   */
  _performInvocation(invocation, notification) {
    const receiver = invocation.receiver;
    const method = invocation.method;
    method.call(receiver, notification);
  }

  /**
   *
   * Adds an entry to the receiver’s dispatch table with an observer,
   * a notification selector and optional criteria: notification name and sender.
   *
   * @param notificationObserver
   * Object registering as an observer. Must not be null.
   *
   * @param callback
   * Method that the receiver invokes on notificationObserver to notify it of the notification posting.
   * The method the selector specifies must have one and only one argument.
   *
   * @param notificationName
   * The name of the notification for which to register the observer;
   * that is, only notifications with this name are delivered to the observer.
   * When null, the notification center doesn’t use a notification’s name to decide whether to deliver it to the observer.
   *
   * @param notificationSender
   * The object whose notifications the observer wants to receive;
   * that is, only notifications sent by this sender are delivered to the observer.
   * When null, the notification center doesn’t use a notification’s sender to decide whether to deliver it to the observer.
   *
   */
  addObserver(notificationObserver, callback, notificationName, notificationSender) {
    notificationName = notificationName || null;
    notificationSender = notificationSender || null;
    if (!this._notificationSenders[notificationSender]) {
      this._registerNotificationSender(notificationSender);
    }

    const invocation = { observer: notificationObserver, method: callback };

    const senders = this._notificationSenders[notificationSender];
    if (!senders[notificationName]) {
      senders[notificationName] = [];
    }
    senders[notificationName].push(invocation);
  }

  /**
   * Removes matching entries from the receiver’s dispatch table.
   *
   * @param {object} notificationObserver
   * Observer to remove from the dispatch table. Specify an observer to remove only entries for this observer.
   * Must not be null, or message will have no effect.
   *
   * @param {string} notificationName
   * Name of the notification to remove from dispatch table.
   * Specify a notification name to remove only entries that specify this notification name.
   * When null, the receiver does not use notification names as criteria for removal.
   *
   * @param {object} notificationSender
   * Sender to remove from the dispatch table.
   * Specify a notification sender to remove only entries that specify this sender.
   * When null, the receiver does not use notification senders as criteria for removal.
   *
   */
  removeObserver(notificationObserver, notificationName, notificationSender) {
    notificationName = notificationName || null;
    notificationSender = notificationSender || null;
    if (!this._notificationSenders[notificationSender]) {
      throw new Error(`No notifications have been registered for the given sender: ${notificationSender}`);
    }

    // If the notificationSender is not specified, remove observations on all objects
    if (notificationSender === null) {
      Object.keys(this._notificationSenders).forEach((sender) => {
        this._removeObserver(notificationObserver, notificationName, this._notificationSenders[sender]);
      });
    } else {
      this._removeObserver(notificationObserver, notificationName, this._notificationSenders[notificationSender]);
    }
  }


  /**
   *
   * @param notificationObserver
   * @param notificationName
   * @param senders
   * @private
   */
  _removeObserver(notificationObserver, notificationName, senders) {
    if (notificationName === null) {
      Object.keys(senders).forEach((name) => {
        this.__removeObserver(notificationObserver, senders[name]);
      })
    } else if (typeof(notificationName) === 'string' && senders[notificationName]) {
      this.__removeObserver(notificationObserver, senders[notificationName]);
    }
  }


  /**
   *
   * @param notificationObserver
   * @param invocations
   * @private
   */
  __removeObserver(notificationObserver, invocations) {
    for (let i = invocations.length - 1; i >= 0; --i) {
      const invocation = invocations[i];
      if (invocation.observer === notificationObserver) {
        invocations.splice(i, 1);
      }
    }
  }
}

