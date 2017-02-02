import React, {Component, PropTypes} from 'react';
import {Button} from 'semantic-ui-react';
import {Icon} from 'semantic-ui-react';
import {Meteor} from 'meteor/meteor';

export default class ControllerUI extends Component {

  constructor(props) {
    super(props);
  }


  static handleTurnOff() {
    Meteor.call('controller.stop');
  }

  static handleTurnOn() {
    Meteor.call('controller.start');
  }

  render() {

    const running = this.props.controller.running;
    const onOffText = running ? 'Turn Off' : 'Turn On';
    const onOffHandler = ()=> {
      running ? ControllerUI.handleTurnOff() : ControllerUI.handleTurnOn();
    };

    const flameIcon = this.props.controller.heatOn ? (<Icon size="big" color="red" name="fire"/>) : (<Icon disabled size="big" name="fire"/>);

    return (
      <div>
        <Button toggle active={running} onClick={onOffHandler}>
          {onOffText}
        </Button>
        <span className="text">Temp: {this.props.controller.currentTemp}</span>
        {flameIcon}
      </div>
    );

    /*
     return (
     <div>
     <span className="text">Brewing: {this.props.controller.running}</span>
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
