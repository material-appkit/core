'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mobx = require('mobx');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DataStore = function () {
  function DataStore(items) {
    _classCallCheck(this, DataStore);

    this.items = items;
    this.totalLength = items ? items.length : null;
  }

  /**
   * Return a boolean to indicate whether this store's records
   * are fully loaded.
   */


  _createClass(DataStore, [{
    key: 'prepend',
    value: function prepend(record) {
      this.items.unshift(record);
      this.totalLength = this.items.length;
    }
  }, {
    key: 'append',
    value: function append(record) {
      this.items.push(record);
      this.totalLength = this.items.length;
    }
  }, {
    key: 'replace',
    value: function replace(record) {
      for (var i = this.totalLength - 1; i >= 0; --i) {
        if (this.items[i].id === record.id) {
          this.items[i] = record;
        }
      }
    }
  }, {
    key: 'remove',
    value: function remove(record) {
      this.items.remove(record);
      this.totalLength = this.items.length;
    }
  }, {
    key: 'sort',
    value: function sort(sortFunc) {
      this.items = this.items.slice().sort(sortFunc);
    }
  }, {
    key: 'isLoaded',
    get: function get() {
      if (!this.items) {
        return false;
      }

      return this.items.length === this.totalLength;
    }
  }]);

  return DataStore;
}();

(0, _mobx.decorate)(DataStore, {
  items: _mobx.observable.shallow,
  totalLength: _mobx.observable,
  isLoaded: _mobx.computed
});

exports.default = DataStore;