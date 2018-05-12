import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import TimeAgo from 'react-timeago';
import { Line } from 'react-chartjs-2';
import { Header, Grid } from 'semantic-ui-react';

class HistoricalChart extends Component {
  static roundNumber( num, places ) {
    return ( Math.round( num * 100 ) / 100 ).toFixed( places );
  }
  constructor( props ) {
    super( props );
    this.state = {
      data: {},
    };
    this.fetchHistoricalData = this.fetchHistoricalData.bind( this );
    this.setChartData = this.setChartData.bind( this );
  }


  componentDidMount() {
    this.fetchHistoricalData();
  }


  setChartData( pointsArray, timeStampArray ) {
    const data = {
      labels: timeStampArray,
      fillOpacity: 0.3,
      datasets: [
        {
          label: 'BTC price',
          fill: true,
          lineTension: 0.1,
          backgroundColor: 'rgba(65, 81, 128,0.2)',
          borderColor: 'rgba(65, 81, 128,1)',
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
          pointRadius: 2,
          pointHitRadius: 10,
          data: pointsArray,
        },
      ],
    };

    const options = {
      tooltips: {
        displayColors: false,
        // callbacks: {
        //   title: ( items, data ) => data.datasets[items[0].datasetIndex].data[items[0].index].hash,
        //   label: ( item, data ) => `฿ ${data.datasets[item.datasetIndex].data[item.index].value}`,
        // },
      },
      legend: {
        display: false,
      },
      scales: {
        yAxes: [{
          display: false,
        }],
        xAxes: [{
          display: false,
        }],
      },
    };
    this.setState( {
      data,
      options,
    } );
  }

  fetchHistoricalData() {
    console.log( 'FETCHING HISTORICAL DATA' );
    fetch( 'https://min-api.cryptocompare.com/data/histoday?fsym=BTC&tsym=USD&limit=29' )
      .then( response => response.json() )
      .then( ( historicalData ) => {
        const pointsArray = historicalData.Data.map( data => data.close );
        const timeStampArray = historicalData.Data.map( data => moment.unix( data.time ).format( 'MM/DD/YYYY' ) );
        this.setChartData( pointsArray, timeStampArray );
        return pointsArray;
      } ).then( ( pointsArray ) => {
        fetch( 'https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD' )
          .then( response => response.json() )
          .then( ( price ) => {
            console.log( moment().format() );
            this.setState( {
              currentPrice: price.USD,
              priceChange: HistoricalChart.roundNumber( price.USD - pointsArray[0], 2 ),
              percentChange: HistoricalChart.roundNumber( ( price.USD - pointsArray[0] ) / pointsArray[0] / 0.01, 2 ),
              timeOfPrice: moment(),
            } );
          } );
      } )
      .catch( ( error ) => {
        console.error( error );
      } );
  }

  render() {
    return (
      <div style={{ maxWidth: '50vw', margin: '0 auto' }}>
        <Header size="huge" style={{ color: '#7C7C7C' }}>30 Day Bitcoin Price Chart</Header>
        <Grid columns="equal" divided textAlign="center">
          <Grid.Row style={{ paddingBottom: '0' }}>
            <Grid.Column>
              <Header size="huge" style={{ color: '#7C7C7C' }}>USD${this.state.currentPrice}</Header>
            </Grid.Column>
            <Grid.Column>
              <Header size="huge" style={{ color: '#7C7C7C' }}>USD${this.state.priceChange}</Header>
            </Grid.Column>
            <Grid.Column>
              <Header size="huge" style={{ color: '#7C7C7C' }}>{this.state.percentChange}%</Header>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row style={{ paddingTop: '0', paddingBottom: '0' }}>
            <Grid.Column>
              <Header size="tiny" style={{ color: '#7C7C7C' }}>Updated <TimeAgo date={this.state.timeOfPrice} /></Header>
            </Grid.Column>
            <Grid.Column>
              <Header size="tiny" style={{ color: '#7C7C7C' }}>Change Since Last Month (USD)</Header>
            </Grid.Column>
            <Grid.Column>
              <Header size="tiny" style={{ color: '#7C7C7C' }}>Change Since Last Month (%)</Header>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Line data={this.state.data} options={this.state.options} />
      </div>
    );
  }
}

export default HistoricalChart;
