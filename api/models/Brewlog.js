/**
 * Brewlog.js
 *
 * @description :: A brewlog is created at the beginning of each brew session to track the brew. 
 *                 Each brewlog will have many associated BrewlogEntries which correspond to an individual 
 *                 brewing action or data measurement
 *  
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    // the associated recipe
    owner: {
      model: 'Recipe'
    },

    // date of the brew
    date: {
      type: 'date',
      required: true
    },
    
    // the log entries for this brew session
    logEntries: {
      collection: 'BrewlogEntry',
      via: 'owner'
    }
  }
};

