'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Plagerized verbatim from Cocoa's NSNotificationCenter:
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * The NotificationCenter class provides a way to send notifications to objects in the same application.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * It takes Notification objects and broadcasts them to any objects in the same task that have registered
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * to receive the notification with the task’s default notification center.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Weak dictionary keys are used to allow notification senders to be eligible for garbage collection.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _Notification = require('./Notification');

var _Notification2 = _interopRequireDefault(_Notification);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NotificationCenter = function () {
  function NotificationCenter() {
    _classCallCheck(this, NotificationCenter);

    this._notificationSenders = {};
    this._registerNotificationSender(null);
  }

  _createClass(NotificationCenter, [{
    key: '_registerNotificationSender',
    value: function _registerNotificationSender(notificationSender) {
      var observers = {};
      observers[null] = [];
      this._notificationSenders[notificationSender] = observers;
    }

    /**
     * Creates a notification with a given name, sender, and information and posts it to the receiver.
     *
     * @param notificationName The name of the notification.
     *
     * @param notificationSender The object posting the notification.
     *
     * @param context Information about the the notification. May be null.
     */

  }, {
    key: 'postNotification',
    value: function postNotification(notificationName, notificationSender, context) {
      var _this = this;

      if (typeof notificationName !== 'string') {
        throw new Error('Expected notificationName to be of type String');
      }

      var notification = new _Notification2.default(notificationName, notificationSender, context);

      var invocations = null;

      invocations = this._notificationSenders[null][null];
      // Send notification to all observers who don't care what type it is or who it is from
      invocations.forEach(function (invocation) {
        _this._performInvocation(invocation, notification);
      });

      // Send notification to all observers who don't care who sent it
      invocations = this._notificationSenders[null][notificationName];
      if (invocations) {
        invocations.forEach(function (invocation) {
          _this._performInvocation(invocation, notification);
        });
      }

      // Send notification to observers interested only those dispatched by the given sender
      if (this._notificationSenders[notificationSender]) {
        invocations = this._notificationSenders[notificationSender][notificationName];
        if (invocations) {
          invocations.forEach(function (invocation) {
            _this._performInvocation(invocation, notification);
          });
        }
      }
    }
  }, {
    key: '_performInvocation',
    value: function _performInvocation(invocation, notification) {
      var receiver = invocation.receiver;
      var method = invocation.method;
      method.call(receiver, notification);
    }

    /**
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
     */

  }, {
    key: 'addObserver',
    value: function addObserver(notificationObserver, callback, notificationName, notificationSender) {
      notificationName = notificationName || null;
      notificationSender = notificationSender || null;
      if (!this._notificationSenders[notificationSender]) {
        this._registerNotificationSender(notificationSender);
      }

      var invocation = { observer: notificationObserver, method: callback };

      var senders = this._notificationSenders[notificationSender];
      if (!senders[notificationName]) {
        senders[notificationName] = [];
      }
      senders[notificationName].push(invocation);
    }

    /**
     * Removes matching entries from the receiver’s dispatch table.
     *
     * @param notificationObserver
     * Observer to remove from the dispatch table. Specify an observer to remove only entries for this observer.
     * Must not be null, or message will have no effect.
     *
     * @param notificationName
     * Name of the notification to remove from dispatch table.
     * Specify a notification name to remove only entries that specify this notification name.
     * When null, the receiver does not use notification names as criteria for removal.
     *
     * @param notificationSender
     * Sender to remove from the dispatch table.
     * Specify a notification sender to remove only entries that specify this sender.
     * When null, the receiver does not use notification senders as criteria for removal.
     */

  }, {
    key: 'removeObserver',
    value: function removeObserver(notificationObserver, notificationName, notificationSender) {
      var _this2 = this;

      notificationName = notificationName || null;
      notificationSender = notificationSender || null;
      if (!this._notificationSenders[notificationSender]) {
        throw new Error('No notifications have been registered for the given sender: ' + notificationSender);
      }

      // If the notificationSender is not specified, remove observations on all objects
      if (notificationSender === null) {
        Object.keys(this._notificationSenders).forEach(function (sender) {
          _this2._removeObserver(notificationObserver, notificationName, _this2._notificationSenders[sender]);
        });
      } else {
        this._removeObserver(notificationObserver, notificationName, this._notificationSenders[notificationSender]);
      }
    }
  }, {
    key: '_removeObserver',
    value: function _removeObserver(notificationObserver, notificationName, senders) {
      var _this3 = this;

      if (notificationName === null) {
        Object.keys(senders).forEach(function (name) {
          _this3.__removeObserver(notificationObserver, senders[name]);
        });
      } else if (typeof notificationName === 'string' && senders[notificationName]) {
        this.__removeObserver(notificationObserver, senders[notificationName]);
      }
    }
  }, {
    key: '__removeObserver',
    value: function __removeObserver(notificationObserver, invocations) {
      for (var i = invocations.length - 1; i >= 0; --i) {
        var invocation = invocations[i];
        if (invocation.observer === notificationObserver) {
          invocations.splice(i, 1);
        }
      }
    }
  }]);

  return NotificationCenter;
}();

exports.default = NotificationCenter;