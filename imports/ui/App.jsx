import React, {Component, PropTypes} from 'react';
import {Meteor} from 'meteor/meteor';
import {createContainer} from 'meteor/react-meteor-data';

import {ControllerState} from '../api/controller.js';
import {BrewLogs} from '../api/brewlogs.js';
import ControllerUI from './ControllerUI.jsx';
import BrewLog from './BrewLog.jsx';

// App component - represents the whole app
class App extends Component {

  constructor(props) {
    super(props);
  }


  render() {

    // start out with some defaults if we can't reach the server
    let currentState = {
      currentTemp: -1,
      running: false
    };
    if (this.props.controller.length) {
      currentState = this.props.controller[0];
    }

    return (
      <div className="container">
        <header>

          <h1>Brewinator</h1>
          <ControllerUI controller={currentState}/>
        </header>
        <BrewLog logs={this.props.logs}/>
      </div>
    );
  }
}


App.propTypes = {

};

export default createContainer(() => {
  Meteor.subscribe('controller');
  Meteor.subscribe('currentLogs');

  return {
    controller: ControllerState.find({}, {sort: {createdAt: -1}}).fetch(),
    logs: BrewLogs.find({}, {sort: {id: 1}}).fetch()
  };
}, App);
