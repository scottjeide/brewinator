/**
 * BrewinatorController
 *
 * @description :: Server-side logic for managing Brewinators
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  // the model will be updated by the server services so disable write access to it
  create: function(req, res) {
    return res.forbidden();
  },

  // TODO: Find out a way to make the update function only available for internal access
  /*
  update: function(req, res) {
    return res.forbidden();
  },
  */
  
  destroy: function(req, res) {
    return res.forbidden();
  },
  
  populate: function(req, res) {
    return res.forbidden();
  },
  
  
  add: function(req, res) {
    return res.forbidden();
  },
  
  remove: function(req, res) {
    return res.forbidden();
  },
  
  
  // The actions endpoints
  start: function(req, res) {
    sails.BrewService.run();
    res.ok();
  }
  
};

