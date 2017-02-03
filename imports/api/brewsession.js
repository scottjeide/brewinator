/**
 * brewsession.js
 *
 * API for managing brew sessions - thinking of using this for a way to organize
 * brewlogs and other data associated with a single brew session.
 */

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import {DbCounter} from './counters.js';

export const BrewSessions = new Mongo.Collection('brewSessions');

if (Meteor.isServer) {

  const brewSessionCounterName = "brewSessionCounter";

  // set up our counter for log ids
  DbCounter.init(brewSessionCounterName);

  Meteor.publish('brewSessions', ()=> {
    return BrewSessions.find({}, {sort: {id: -1}});
  });


  /**
   * Adds a new brew session to the DB and returns the unique brew session _id
   */
  export function addBrewSession() {
    return BrewSessions.insert( {
      id: DbCounter.getNextId(brewSessionCounterName),
      time: new Date()
    });
  }

}

