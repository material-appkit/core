'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _NotificationCenter = require('../notification/NotificationCenter');

var _NotificationCenter2 = _interopRequireDefault(_NotificationCenter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NotificationManager = function () {
  function NotificationManager() {
    _classCallCheck(this, NotificationManager);
  }

  _createClass(NotificationManager, null, [{
    key: 'postNotification',
    value: function postNotification(notificationName, notificationSender, context) {
      this._defaultCenter.postNotification(notificationName, notificationSender, context);
    }
  }, {
    key: 'addObserver',
    value: function addObserver(notificationObserver, callback, notificationName, notificationSender) {
      this._defaultCenter.addObserver(notificationObserver, callback, notificationName, notificationSender);
    }
  }, {
    key: 'removeObserver',
    value: function removeObserver(notificationObserver, notificationName, notificationSender) {
      this._defaultCenter.removeObserver(notificationObserver, notificationName, notificationSender);
    }
  }]);

  return NotificationManager;
}();

NotificationManager._defaultCenter = new _NotificationCenter2.default();
exports.default = NotificationManager;