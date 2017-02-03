
import React, {Component, PropTypes} from 'react';
import {Line} from 'react-chartjs-2';


export default class BrewLog extends Component {

  constructor(props) {
    super(props);
  }


  render() {

    let labels = [];
    let dataPoints = [];
    for (let log of this.props.logs) {
      labels.push(log.time);
      dataPoints.push(log.temp);
    }

    const chartData = {
      labels : labels,
      datasets : [{
        fill: false,
        label: "Temperature",
        borderColor : "#ACC26D",
        pointBackgroundColor : "#fff",
        pointBorderColor : "#9DB86D",
        data : dataPoints
      }]
    };

    const chartOptions = {
      events: ["click", "touchstart", "touchmove", "touchend"],
    };

    return (
      <Line data={chartData} options={chartOptions} height={250}/>
    );

  }
}


BrewLog.propTypes = {
  logs: PropTypes.array.isRequired,
};
