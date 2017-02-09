/**
 * controller.js
 *
 * Main controller API - current state and methods of the brew controller
 *
 *
 */

import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {addBrewSession} from '../api/brewsession.js';

const ControllerState = new Mongo.Collection('controllerState');

if (Meteor.isServer) {
  let BrewController = require('../server/brewController.js');

  class Controller {
    constructor() {
      this.dbCollection = ControllerState;
      this._load();
      if (!this.dbRecord) {
        console.log('creating default controller state');

        this.dbCollection.insert({
          running: false,
          currentTemp: 0,
          heatOn: false,
          brewSessionId: 0
        });
      }
      else {
        this.dbRecord.currentTemp = 0;
        this.dbRecord.running = false;
        this.dbRecord.heatOn = false;
        this.dbRecord.brewSessionId = 0;
        this._save();
      }

      this._load();
    }

    /**
     * Returns a cursor of the controller state for publishing
     */
    getPublish() {
      console.log('getPublish called');
      return this.dbCollection.find({
        _id: this.dbRecord._id
      });
    }

    getCollection() {
      return this.dbCollection;
    }

    setTemp(temp) {

      if (this.dbRecord.currentTemp != temp) {
        console.log('setting temp to ' + temp);
        this.dbRecord.currentTemp = temp;
        this._save();
      }
    }

    getTemp() {
      return this.dbRecord.currentTemp;
    }

    setRunning(running) {
      if (this.dbRecord.running != running) {
        console.log('setting running to ' + running);
        this.dbRecord.running = running;
        this._save();
      }
    }

    setHeatOn(heatOn) {
      if (this.dbRecord.heatOn != heatOn) {
        console.log('setting heaton to ' + heatOn);
        this.dbRecord.heatOn = heatOn;
        this._save();
      }
    }

    setBrewSession(brewSessionId) {
      if (this.dbRecord.brewSessionId != brewSessionId) {
        console.log('setting brewSessionId to ' + brewSessionId);
        this.dbRecord.brewSessionId = brewSessionId;
        this._save();
      }
    }

    _load() {
      console.log('loading controller state');
      this.dbRecord = this.dbCollection.findOne();
    }

    _save() {
      console.log('updating controller state');
      this.dbCollection.update(this.dbRecord._id, this.dbRecord);

      this._load();
    }
  }

  export const ControllerInstance = new Controller();


  Meteor.publish('controller', function controller() {
    return ControllerInstance.getPublish();
  });

  Meteor.methods({
    'controller.start'() {
      let brewSessionId = addBrewSession();
      ControllerInstance.setBrewSession(brewSessionId);
      BrewController.brewController.run(brewSessionId);
      ControllerInstance.setRunning(true);
    },

    'controller.stop'() {
      BrewController.brewController.stop();
      ControllerInstance.setRunning(false);
    },

  });

}
else {
  // the client side of the controller
  export class Controller {
    constructor() {
      Meteor.subscribe('controller');

      this.currentTemp = 0;
      this.running = false;
      this.heatOn = false;
      this.brewSessionId = 0;

      this._controllerSelector = ControllerState.find({}, {sort: {createdAt: -1}}).fetch();

      // and get notified of changes to the collection so we can update our object state
      Tracker.autorun(() => {
        if (this._controllerSelector.length) {
          let controller = this._controllerSelector[0];
          this.currentTemp = controller.currentTemp;
          this.running = controller.running;
          this.heatOn = controller.heatOn;
          this.brewSessionId = controller.brewSessionId;
        }
      });
    }


  }

}
