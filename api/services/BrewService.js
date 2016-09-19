


module.exports = {


  init: function(cb) {

    // set up the main global brew service 
    sails.BrewService = new function() {
      var _statusRecordSelect = {
        id: 1
      };

      // the current status record
      var _statusRecord = {
        id: 1,
          brewing: false,
          currentTemp: 0,
          heatOn: false
      };


      function _init(cb) {
        sails.log('starting brewinator server');

        // initialize the one Brewinator db record & state
        Brewinator.findOrCreate(_statusRecordSelect, _statusRecord, function(error, record) {
          sails.log('loaded main brewinator state: ' + error);
          _statusRecord = record;
          cb();
        });
      }


      /**
       * simple runner that hits the db directly - trying to decide what to do with socket notifications triggered
       * from server actions
       * @private
       */
      /*
      // Not using this one since I would need to manually call publishUpdate after ever backend data change
      // that the client might be listening on
      function _runDirectDbAccess() {
        
        // cheesy little update temp function to test things out
        setInterval(function () {
          _statusRecord.currentTemp++;

          // this puts a record directly in the DB & notifies connected sockets by calling publishUpdate
          Brewinator.update(_statusRecordSelect, _statusRecord).exec(function afterwards(err, updated) {
            if (err) {
              // handle error here- e.g. `res.serverError(err);`
              return;
            }

            console.log('Updated temp to ' + updated[0].currentTemp);

            // let the subscribed sockets know that it has changed - will trigger the socket.on('brewinator') w/ verb updated
            Brewinator.publishUpdate(_statusRecord.id, updated[0]);
          });

        }, 2000);
      }
      */


      /**
       * runs the server & goes through the controller to update the db. By running the updates through the controller
       * it will automatically update any connected clients for status
       * @private
       */
      function _runControllerDbAccess() {

        // to use sails.io from the server side, see this:
        //https://github.com/balderdashy/sails.io.js#for-nodejs


        // set up the socket connection back to ourselves 
        var socketIOClient = require('socket.io-client');
        var sailsIOClient = require('sails.io.js');
        var io = sailsIOClient(socketIOClient);
        io.sails.url = 'http://localhost:1337';


        // todo: clean this stuff up & remove the read-only checks in the controller (or make them work so they
        // only allow internal requests. 


        // cheesy little update temp function to test things out
        setInterval(function() {
          _statusRecord.currentTemp++;

          io.socket.put('/brewinator/1', _statusRecord, function(resData, jwr) {
            console.log('put brew status: ' + jwr.statusCode);
          });

          io.socket.get('/brewinator', {id:1}, function(data, jwr) {
            if (jwr.statusCode == 200) {
              console.log('got temp to ' + data.currentTemp);
            }
          });

          // would normally want to disconnect our socket when done, but we're never really done with it
          //io.socket.disconnect();
        }, 2000);

      }

      // the public methods
      return {
        init: _init,
        run: _runControllerDbAccess
      };
    };
    
    sails.BrewService.init(cb);
  },
  
  run: function() {
    sails.BrewService.run();
  }
  
  
};
