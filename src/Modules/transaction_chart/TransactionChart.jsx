import React, { Component } from 'react';
import { Bubble } from 'react-chartjs-2';
import PropTypes from 'prop-types';

class TransactionChart extends Component {
  static getColor( color ) {
    let chartColor = 'rgba(65, 81, 128';
    const colorMap = {
      yellow: () => 'rgba(255, 255, 0',
      blue: () => 'rgba(65, 81, 128',
    };
    const fn = colorMap[color];
    if ( fn ) {
      chartColor = fn();
    }
    return chartColor;
  }

  static reloadData( data, color ) {
    console.log( color );
    return {
      labels: ['January'],
      datasets: [
        {
          scaleOverride: true,
          fill: false,
          lineTension: 0.1,
          backgroundColor: `${color},0.4)`,
          borderColor: `${color} ,1)`,
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data,
        },
      ],
    };
  }


  constructor( props ) {
    super( props );
    this.scaleValue = this.scaleValue.bind( this );
    this.webSocket = new WebSocket( 'wss://ws.blockchain.info/inv' );
    this.state = {
      rawValues: [0, 500],
      options: {
        usePlugin: false,
        tooltips: {
          displayColors: false,
          callbacks: {
            title: ( items, data ) =>
              data.datasets[items[0].datasetIndex].data[items[0].index].hash,
            label: ( item, data ) =>
              `฿ ${data.datasets[item.datasetIndex].data[item.index].value}`,
          },
        },
        legend: {
          display: false,
        },
        scales: {
          yAxes: [{
            display: false,
            ticks: {
              max: 1,
              min: 0,
              stepSize: 0.01,
            },
          }],
          xAxes: [{
            display: false,
            ticks: {
              max: 1,
              min: 0,
              stepSize: 0.01,
            },
          }],
        },
      },
      data: TransactionChart.reloadData( [], TransactionChart.getColor( this.props.color ) ),
    };
    this.toggleVisibility = this.toggleVisibility.bind( this );
  }
  componentDidMount() {
    this.init();
  }

  componentWillUnmount() {
    this.webSocket.close();
  }

  scaleValue( rawValuesArray ) {
    const xMin = Math.min.apply( null, rawValuesArray );
    const xMax = Math.max.apply( null, rawValuesArray );
    const x = rawValuesArray[rawValuesArray.length - 1];
    return ( 1 + ( ( x - xMin ) * ( this.props.maxSize - 1 ) ) ) / ( xMax - xMin );
  }

  init() {
    this.webSocket.onopen = () => {
      this.webSocket.send( JSON.stringify( { op: 'unconfirmed_sub' } ) );
    };


    this.webSocket.onerror = ( event ) => {
      console.log( event.data );
    };
    this.webSocket.onmessage = ( event ) => {
      this.toggleVisibility();
      let data = this.state.data.datasets[0].data.slice( 0 );
      let rawValues = this.state.rawValues.slice( 0 );
      const message = JSON.parse( event.data );
      const { hash } = message.x;
      const utxOutputs = message.x.out;
      let value = 0;
      utxOutputs.forEach( ( output ) => {
        value += output.value;
      } );
      // convert to whole BTC
      value *= 0.00000001;
      rawValues.push( value );
      const standardValue = this.scaleValue( rawValues );
      // { x: 1, y: 10, size: 30 }
      const x = Math.random();
      const y = Math.random();
      const transaction = {
        x, y, r: standardValue, value, hash,
      };

      data.push( transaction );
      if ( rawValues.length > 400 ) {
        data = [];
        rawValues = [0, 500];
      }

      // normalize data
      this.setState( {
        data: TransactionChart.reloadData( data, TransactionChart.getColor( this.props.color ) ),
        rawValues,
      } );
    };
  }

  toggleVisibility() {
    this.setState( {
      visible: !this.state.visible,
    } );
  }

  render() {
    return (
      <div>
        <Bubble
          data={this.state.data}
          options={this.state.options}
          getElementAtEvent={( ( dataset ) => {
            const { hash } = this.state.data.datasets[0].data[dataset[0]._index];
            if ( this.props.canRedirect ) {
            window.location = `https://blockchain.info/tx/${hash}`;
            }
          } )}
        />
      </div>
    );
  }
}

export default TransactionChart;

TransactionChart.propTypes = {
  canRedirect: PropTypes.bool,
  color: PropTypes.string,
  maxSize: PropTypes.number,
};

TransactionChart.defaultProps = {
  canRedirect: false,
  color: 'blue',
  maxSize: 50,
};
