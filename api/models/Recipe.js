/**
 * Recipe.js
 *
 * @description :: A Recipe is the brewing schedule. Controls the temperature/timing/pumps of the brew session
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    // the recipe name
    name: {
      type: 'string',
      required: true
    },

    // mash temp in farenheight
    mashTemp: {
      type: 'int',
      required: true
    },
    
    // mash duration in minutes
    mashDuration: {
      type: 'int',
      required: true
    },
    
    // the brewlogs that have been created for this recipe
    brewLogs: {
      collection: 'Brewlog',
      via: 'owner'
    }
  }
};

