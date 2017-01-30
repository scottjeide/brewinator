/**
 * controller.js
 *
 * Main controller API - current state and methods of the brew controller
 *
 *
 */

import {Meteor} from 'meteor/meteor';

export const ControllerState = new Mongo.Collection('controllerState');

if (Meteor.isServer) {

  class Controller {
    constructor() {
      this.dbCollection = ControllerState;
      this._load();
      if (!this.dbRecord) {
        console.log('creating default controller state');

        this.dbCollection.insert({
          running: false,
          currentTemp: 0,
          heatOn: false
        });

        this._load();
      }
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
        console.log('setting running to ' + running)
        this.dbRecord.running = running;
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
      let BrewController = require('../server/brewController.js');
      BrewController.brewController.run();
      ControllerInstance.setRunning(true);

    },

    'controller.stop'() {

    },

  });

}

