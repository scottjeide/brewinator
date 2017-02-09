import React, {Component, PropTypes} from 'react';
import {Button} from 'semantic-ui-react';
import {Icon} from 'semantic-ui-react';
import {Meteor} from 'meteor/meteor';

export default class ControllerUI extends Component {

  static handleTurnOff() {
    Meteor.call('controller.stop');
  }

  static handleTurnOn() {
    Meteor.call('controller.start');
  }

  render() {

    const controller = this.props.controller;
    const running = controller.running;
    const onOffText = running ? 'Turn Off' : 'Turn On';
    const onOffHandler = ()=> {
      running ? ControllerUI.handleTurnOff() : ControllerUI.handleTurnOn();
    };

    const flameIcon = controller.heatOn ? (<Icon size="big" color="red" name="fire"/>) : (<Icon disabled size="big" name="fire"/>);

    return (
      <div>
        <Button toggle active={running} onClick={onOffHandler}>
          {onOffText}
        </Button>
        <span className="text">Temp: {controller.currentTemp}</span>
        {flameIcon}
      </div>
    );
  }
}


ControllerUI.propTypes = {
  controller: PropTypes.object.isRequired,

};
