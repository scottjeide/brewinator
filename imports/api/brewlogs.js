/**
 * brewsession.js
 *
 * API for managing brew logs
 */


import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import {DbCounter} from './counters.js';

export const BrewLogs = new Mongo.Collection('brewLogs');

if (Meteor.isServer) {

  const brewLogsCounterName = "brewLogCounter";

  // set up our counter for log ids
  DbCounter.init(brewLogsCounterName);

  Meteor.publish('currentLogs', ()=> {
    return BrewLogs.find();
  });


  export function addBrewLogEntry(sessionId, temperature) {
    BrewLogs.insert( {
      sessionId: sessionId,
      id: DbCounter.getNextId(brewLogsCounterName),
      time: new Date(),
      temp: temperature
    });
  }

}
