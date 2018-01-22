/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
const { LimitedArray, getIndexBelowMax, LinkedList } = require('./hash-table-helpers');

// Refactor so that just the buckets are linked lists and not arrays
// key value pairs can stay as arrays
// You will still be using LimiitedArray class for the actual hash table
// You can use the linked-list file from Data Structures I
// by creating a new file, copy paste the code, and import it to new file.
// Make sure to add new classes in hash-table-helpers to 'module-exports'.

class HashTable {
  constructor(limit = 8) {
    this.limit = limit;
    this.storage = new LimitedArray(this.limit);
    // Do not modify anything inside of the constructor
  }

  resize() {
    this.limit *= 2;
    const oldStorage = this.storage;
    this.storage = new LimitedArray(this.limit);
    oldStorage.forEach((bucket, i) => {
      if (!bucket) return;
      this.storage[i] = bucket[i];
    });
  }

  capacityIsFull() {
    let fullCells = 0;
    this.storage.each((bucket) => {
      if (bucket !== undefined) fullCells++;
    });
    return fullCells / this.limit >= 0.75;
  }

  // Creates a new object() in the corresponding bucket with key/value pairs as properties
  // Fetch the bucket associated with the given key using the getIndexBelowMax function
  // If no bucket has been created for that index, instantiate a new bucket and add the key, value pair to that new bucket
  // If the key already exists in the bucket, the newer value should overwrite the older value associated with that key
  insert(key, value) {
    if (this.capacityIsFull()) this.resize();
    const index = getIndexBelowMax(key.toString(), this.limit);
    const bucket = this.storage.get(index) || new LinkedList();

    if (bucket.contains(key, value)) {
      bucket.key.value = value;
    } else {
      bucket.addToTail(key, value);
    }

    this.storage.set(index, bucket);
  }
  // Removes the key, value pair from the hash table
  // Fetch the bucket associated with the given key using the getIndexBelowMax function
  // Remove the key, value pair from the bucket
  remove(key) {
    const index = getIndexBelowMax(key.toString(), this.limit);
    const bucket = this.storage.get(index);

    if (bucket.head === bucket) {
      bucket.head = bucket.head.next;
      bucket.tail.next = bucket.head;
    }
    delete bucket.key;
    this.storage.set(index, bucket);
  }
  // Fetches the value associated with the given key from the hash table
  // Fetch the bucket associated with the given key using the getIndexBelowMax function
  // Find the key, value pair inside the bucket and return the value
  retrieve(key) {
    const index = getIndexBelowMax(key.toString(), this.limit);
    const bucket = this.storage.get(index);
    let retrieved;
    if (bucket) {
      retrieved = bucket.filter(item => item[0] === key)[0];
    }

    return retrieved ? retrieved[1] : undefined;
  }
}

module.exports = HashTable;
