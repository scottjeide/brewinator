/**
 * Created by sjeide on 4/29/16.
 */

$(document).ready(function() {

  var viewModel = function() {
    var self = this;

    self.logCount =  1;
    self.brewLogs = ko.observableArray();
    self.recipes = ko.observableArray();
    self.recipeCount = ko.computed(function() {
      return self.recipes().length;
    });
    
    io.socket.get('/recipe', {}, function(data, jwr) {
      if (jwr.statusCode == 200) {
        self.recipes(data);
      }
      else {
        
      }
      
    });

    io.socket.on('recipe', function(msg) {
      if (msg.verb == 'created') {
        self.recipes.push(msg.data);
      }
      
    });

  };
  

  //http://stackoverflow.com/questions/27971706/example-of-socket-io-chat-sails-js
  ko.applyBindings(new viewModel());
  
  
  
  
});
