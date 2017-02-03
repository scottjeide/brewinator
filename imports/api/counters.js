/**
 * Just some helpers for counters for autoinc fields in the DB
 */
'use strict';

import { Mongo } from 'meteor/mongo';

if (Meteor.isServer) {

  class DatabaseCounter {
    constructor() {
      this.counterDb = new Mongo.Collection('counters');
    }

    /**
     * Call this at least once before using to make sure the initial counter value is created
     * @param name unique name for the counter
     */
    init(name) {
      // set up our counter for log ids

      if (!this.counterDb.findOne({query: {_id: name }})) {
        console.log("setting initial brewlog counter for " + name);
        this.counterDb.insert({
          _id: "name",
          seq: 0
        })
      }

    }

    /**
     * Gets the next id to use for the given counter
     * @param name
     */
    getNextId(name) {
      let counterRecord = this.counterDb.findAndModify(
        {
          query: { _id: name },
          update: { $inc: { seq: 1 } },
          new: true
        }
      );

      return counterRecord.seq;
    }
  }

  export const DbCounter = new DatabaseCounter();
}
