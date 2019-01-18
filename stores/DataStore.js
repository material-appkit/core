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

  indexOf(record) {
    for (let index = 0; index < this.items.length; ++index) {
      const item = this.items[index];
      if (item && item.id === record.id) {
        return index;
      }
    }

    return -1;
  }

  set(recordIndex, record) {
    if (recordIndex < 0 || recordIndex > this.items.length - 1) {
      throw new Error(`Index out of range: ${recordIndex}`);
    }
    this.items[recordIndex] = record;
  }
}

decorate(DataStore, {
  items: observable,
  totalLength: observable,
  isLoaded: computed,
});

export default DataStore;
