import { computed, decorate, observable } from 'mobx';

class DataStore {
  constructor(items) {
    this.items = items;
    this.totalLength = items ? items.length : null;
  }

  /**
   * Return a boolean to indicate whether this store's records
   * are fully loaded.
   */
  get isLoaded() {
    if (!this.items) {
      return false;
    }

    return this.items.length === this.totalLength;
  }

  prepend(record) {
    this.items.unshift(record);
    this.totalLength = this.items.length;
  }

  append(record) {
    this.items.push(record);
    this.totalLength = this.items.length;
  }

  remove(record) {
    this.items.remove(record);
    this.totalLength = this.items.length;
  }

  sort(sortFunc) {
    this.items = this.items.slice().sort(sortFunc);
  }
}

decorate(DataStore, {
  items: observable.shallow,
  totalLength: observable,
  isLoaded: computed,
});

export default DataStore;
