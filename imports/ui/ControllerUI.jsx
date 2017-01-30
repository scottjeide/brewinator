import React, {Component, PropTypes} from 'react';
import {Button} from 'semantic-ui-react';
import {Meteor} from 'meteor/meteor';

export default class ControllerUI extends Component {

  constructor(props) {
    super(props);
  }

  handleOnOff() {

    if (!this.props.controller.running) {
      Meteor.call('controller.start');
    }
    else {
      Meteor.call('controller.start');
    }
  }

  render() {

    const active = this.props.controller.running;
    const onOffText = active ? 'Turn Off' : 'Turn On';

    return (
      <div>
        <Button toggle active={active} onClick={this.handleOnOff.bind(this)}>
          {onOffText}
        </Button>
        <span className="text">Temp: {this.props.controller.currentTemp}</span>
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
