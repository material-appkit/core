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
}

decorate(DataStore, {
  items: observable,
  totalLength: observable,
  isLoaded: computed,
});

export default DataStore;
