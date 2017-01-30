import React, {Component, PropTypes} from 'react';
import {Meteor} from 'meteor/meteor';
import {createContainer} from 'meteor/react-meteor-data';

import {ControllerState} from '../api/controller.js';
import ControllerUI from './ControllerUI.jsx';

// App component - represents the whole app
class App extends Component {

  constructor(props) {
    super(props);
  }


  render() {

    // start out with some defaults if we can't reach the server
    let currentState = {
      currentTemp: -1
    };
    if (this.props.controller.length) {
      currentState = this.props.controller[0];
    }

    return (
      <div className="container">
        <header>

          <h1>My app</h1>
          <ControllerUI controller={currentState}/>
        </header>
      </div>
    );
  }
}


App.propTypes = {
  controller: PropTypes.array.isRequired,

};

export default createContainer(() => {
  Meteor.subscribe('controller');

  return {
    controller: ControllerState.find({}, {sort: {createdAt: -1}}).fetch(),
  };
}, App);
