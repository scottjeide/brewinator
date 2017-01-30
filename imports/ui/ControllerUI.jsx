import React, {Component, PropTypes} from 'react';
import {Meteor} from 'meteor/meteor';
import classnames from 'classnames';

export default class ControllerUI extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div>
        <span className="text">Temp: {this.props.controller.currentTemp}</span>
      </div>
    );

    /*
     return (
     <div>
     <span className="text">Brewing: {this.props.controller.brewing}</span>
     <span className="text">Temp: {this.props.controller.currentTemp}</span>
     <span className="text">On: {this.props.controller.heatOn}</span>
     </div>
     )
     */
  }
}


ControllerUI.propTypes = {
  controller: PropTypes.object.isRequired,

};
