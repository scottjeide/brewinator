/**
 * BrewlogEntry.js
 *
 * @description :: The data for a single brewing event collected during the brew session (data log, temp change, etc
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    
    // The brewlog these entries are associated with
    owner: {
      model: 'Brewlog'
    },

    // current mash temp in farenheight
    mashTemp: {
      type: 'int',
      required: true
    },
    
    // # of seconds offset from the beginning of the brew
    offsetSeconds: {
      type: 'int',
      required: true
    }
    
  }
};

