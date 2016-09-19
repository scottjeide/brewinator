/**
 * Brewinator.js
 *
 * @description :: The main brewinator model used to reflect status back to the client.
 * 
 *                 Not sure if there's a cleaner way to reflect back global state & actions to the client app, but 
 *                 wanted to be able to use gets/sockets/actions on an endpoint from the client and I guess 
 *                 this one way to handle it.
 *                 
 *                 There will only be one Brewinator model record available (record #1) which is created at app startup
 *                 if it doesn't already exist. The backend processes will update the fields as they change so the 
 *                 client can reflect the current status. Actions on the brewinator endpoint are used to control the 
 *                 brew system.
 *                 
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    brewing: {
      type: 'boolean',
      required: true,
      defaultsTo: false
    },

    currentTemp: {
      type: 'int',
      required: true,
      defaultsTo: 0
    },
    
    heatOn: {
      type: 'boolean',
      required: true,
      defaultsTo: false
    }
  }
  
};

