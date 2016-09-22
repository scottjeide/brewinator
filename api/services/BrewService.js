


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

        var maxWattage = 4500;

        var PidController = require('node-pid-controller');

        var pidController = new PidController({
          k_p: 0.25,
          k_i: 0.01,
          k_d: 0.01,
          // first try just letting it run dt: 1, // in seconds
          i_max: 10   // the max value returned for the adjustment value. Don't understand what/how this relates to anything
        });


        pidController.setTarget(149);


        var brewPotSimulator = new function() {
          
          var lastTimeMs = Date.now();
          var currentWattage = 0;
          var currentTemp = 130;
          var ambientTemp = 70;
          var totalGallons = 6;
          
          
          function _getTemp() {
            
            var currentTimeMs = Date.now();
            var elapsedTimeMs = currentTimeMs - lastTimeMs;
            lastTimeMs = currentTimeMs;

            if (currentWattage > 0) {
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
              var elapsedHours = elapsedTimeMs / (60*60*1000);
              var tempIncrease = ((currentWattage / 1000) * (372 * elapsedHours)) / totalGallons;
              sails.log('update temp, element on, tempIncrease = ' + tempIncrease);
              currentTemp += tempIncrease;
              sails.log('update temp, element on, currentTemp = ' + currentTemp);
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
              var elapsedMinutes = elapsedTimeMs / (60*1000);
              currentTemp = ambientTemp + ((currentTemp - ambientTemp) * Math.exp((-0.00101362) * elapsedMinutes));
              sails.log('update temp, element off, currentTemp = ' + currentTemp);
            }
            
            return currentTemp;
          }
          
          function _setPower(wattage) {
            currentWattage = wattage;
          }
          
          return {
            getTemp: _getTemp,
            setPower: _setPower
          }
        };
        
        brewPotSimulator.setPower(maxWattage);

        setInterval(function() {
          
          var currentTemp = brewPotSimulator.getTemp();
          var adjustment = pidController.update(currentTemp);
          sails.log('pid adjustment value = ' + adjustment);
          if (adjustment > 0) {
            brewPotSimulator.setPower(maxWattage);
          }
          else {
            brewPotSimulator.setPower(0);
          }

          // couple of things I've noticed with this. If you break in the debugger during this interval, it
          // takes a long time before it runs again. And with node, there's no guarantee that it'll
          // happen exactly in 1 second anyway. Likely just node, but maybe it doesn't happen if not going
          // back through the socket io client & going direct to db instead?

          _statusRecord.currentTemp = Math.round(currentTemp);

          io.socket.put('/brewinator/1', _statusRecord, function(resData, jwr) {
            //sails.log('put brew status: ' + jwr.statusCode);
          });

          
          /*
          io.socket.get('/brewinator', {id:1}, function(data, jwr) {
            if (jwr.statusCode == 200) {
              console.log('got temp to ' + data.currentTemp);
            }
          });
          */

          // would normally want to disconnect our socket when done, but we're never really done with it
          //io.socket.disconnect();
        }, 1000);

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
