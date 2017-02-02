'use strict';

import {Meteor} from 'meteor/meteor';

import {ControllerInstance} from '../api/controller.js'

class BrewController {

  constructor() {
    this.maxWattage = 4500;
    this.pidTimer = null;

    let PidController = require('node-pid-controller');
    this.pidController = new PidController({
      k_p: 0.25,
      k_i: 0.01,
      k_d: 0.01,
      // first try just letting it run dt: 1, // in seconds
      i_max: 10   // the max value returned for the adjustment value. Don't understand what/how this relates to anything
    });
  }


  run() {
    this._runSimulator();
  }

  stop() {
    if (this.pidTimer != null) {
      Meteor.clearInterval(this.pidTimer);
      ControllerInstance.setHeatOn(false);
    }

    this.pidTimer = null;
  }

  /**
   * Runs controller against a simulated brew pot
   *
   * @private
   */
  _runSimulator() {

    if (this.pidTimer != null) {
      console.log("brew already running");
      return;
    }

    this.pidController.setTarget(135);

    let brewPotSimulator = this.brewPotSimulator || new BrewSimulator();
    this.brewPotSimulator = brewPotSimulator;

    brewPotSimulator.setPower(this.maxWattage);


    this.pidTimer = Meteor.setInterval(() => {

      let currentTemp = brewPotSimulator.getTemp();
      let adjustment = this.pidController.update(currentTemp);
      console.log('pid adjustment value = ' + adjustment);
      if (adjustment > 0) {
        brewPotSimulator.setPower(this.maxWattage);
        ControllerInstance.setHeatOn(true);
      }
      else {
        brewPotSimulator.setPower(0);
        ControllerInstance.setHeatOn(false);
      }

      ControllerInstance.setTemp(Math.round(currentTemp));

    }, 1000);

  }

}

class BrewSimulator {

  constructor() {
    this.lastTimeMs = Date.now();
    this.currentWattage = 0;
    this.currentTemp = 130;
    this.ambientTemp = 40;
    this.totalGallons = 6;
  }


  getTemp() {

    let currentTimeMs = Date.now();
    let elapsedTimeMs = currentTimeMs - this.lastTimeMs;
    this.lastTimeMs = currentTimeMs;

    if (this.currentWattage > 0) {
      /*
       element is on, so we're raising the temp
       Formulas for heat rise/temp/wattage relationship

       Gallons * Temp Rise (F)
       ------------------------------------ * 1000 = Wattage
       372 * heat up time (hours)

       (Gallons * Temp) / (372 * hours) = (Wattage / 1000)
       (Gallons * Temp) = (Wattage / 1000) * (372 * hours)
       Temp = ((Wattage / 1000) * (372 * hours)) / Gallons
       */
      let elapsedHours = elapsedTimeMs / (60 * 60 * 1000);
      let tempIncrease = ((this.currentWattage / 1000) * (372 * elapsedHours)) / this.totalGallons;
      console.log('update temp, element on, tempIncrease = ' + tempIncrease);
      this.currentTemp += tempIncrease;
      console.log('update temp, element on, currentTemp = ' + this.currentTemp);
    }
    else {
      /*
       element is off so we're lowering the temp (total approximation here since the element will
       technically still be hot if it was just turned off, but oh well)

       for temp loss when the element is off - approximation using newtons law of cooling
       The k value is variable based on the volume of water, surface area,
       insulation, etc. But for simulation just using a value here that sort of seems to simulate heat loss
       in a brew pot. Could measure it from the brew setup if
       you want - I don't right now at least...

       T(t)= T_a + (T_o-T_a) e^{-kt}
       where
       T_a = ambient/room temp
       T_o = original temp
       k = constant dependent on the brew/pot (.054)
       t = time (in minutes)
       */
      let elapsedMinutes = elapsedTimeMs / (60 * 1000);
      this.currentTemp = this.ambientTemp + ((this.currentTemp - this.ambientTemp) * Math.exp((-0.054) * elapsedMinutes));
      console.log('update temp, element off, currentTemp = ' + this.currentTemp);
    }

    return this.currentTemp;
  }

  setPower(wattage) {
    this.currentWattage = wattage;
  }

}

export const brewController = new BrewController();

