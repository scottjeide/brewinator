/**
 * Created by sjeide on 4/29/16.
 */

$(document).ready(function() {

  var viewModel = function() {
    var me = this;

    me.logCount =  1;
    me.brewLogs = ko.observableArray();
    me.recipes = ko.observableArray();
    me.recipeCount = ko.computed(function() {
      return me.recipes().length;
    });
    me.currentTemp = ko.observable(0);
    
    
    io.socket.get('/recipe', {}, function(data, jwr) {
      if (jwr.statusCode == 200) {
        me.recipes(data);
      }
      else {
        
      }
      
    });

    io.socket.on('recipe', function(msg) {
      if (msg.verb == 'created') {
        me.recipes.push(msg.data);
      }
      
    });

    // todo: can I use the knockout mapping stuff to directly map the server side models to observable properties
    // rather than manually setting each observable property on each response?
    io.socket.get('/brewinator', {id:1}, function(data, jwr) {
      if (jwr.statusCode == 200) {
        me.currentTemp(data.currentTemp);
      }
    });
    
    io.socket.on('brewinator', function(msg) {
      if (msg.verb = 'updated') {
        me.currentTemp(msg.data.currentTemp);
      }
    });
    
    me.run = function() {
      io.socket.put('/brewinator/start', {}, function(data, jwr) {
        console.log('response: ' + jwr.statusCode);
      });
    }
    
  };
  


  ko.applyBindings(new viewModel());
  
});
