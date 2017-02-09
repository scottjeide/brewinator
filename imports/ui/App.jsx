import React, {Component, PropTypes} from 'react';
import {Meteor} from 'meteor/meteor';
import {createContainer} from 'meteor/react-meteor-data';

import {Controller} from '../api/controller.js';
import {BrewLogs} from '../api/brewlogs.js';
import ControllerUI from './ControllerUI.jsx';
import BrewLog from './BrewLog.jsx';

// App component - represents the whole app
class App extends Component {

  constructor(props) {
    super(props);
  }


  render() {
    return (
      <div className="container">
        <header>

          <h1>Brewinator</h1>
          <ControllerUI controller={this.props.controller}/>
        </header>
        <BrewLog logs={this.props.logs}/>
      </div>
    );
  }
}


App.propTypes = {

};

export default createContainer(() => {

  let controller = new Controller();

  // subscribe to the current set of brewlogs
  Tracker.autorun(function() {
    Meteor.subscribe('brewLogs', controller.brewSessionId);
  });

  return {
    controller: controller,
    logs: BrewLogs.find({}, {sort: {id: 1}}).fetch()
  };
}, App);
