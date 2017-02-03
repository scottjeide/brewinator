/**
 * brewsession.js
 *
 * API for managing brew sessions - thinking of using this for a way to organize
 * brewlogs and other data associated with a single brew session.
 */

import {Meteor} from 'meteor/meteor';

export const BrewSessions = new Mongo.Collection('brewSessions');

if (Meteor.isServer) {


}

