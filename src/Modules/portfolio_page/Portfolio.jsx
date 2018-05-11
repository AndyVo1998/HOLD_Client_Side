import React, { Component } from 'react';
import { List, Header, Grid, Divider } from 'semantic-ui-react';
import PieChart from '../piechart/PieChart.jsx';
import Portfolio_left from '../portfolio_left/Portfolio_left.jsx';
import PortfolioMain from '../portfolio_right/Portfolio_right.jsx';
import AddCoinModal from '../add_coin_modal/AddCoinModal.jsx';
import Chart from '../chart/Chart.jsx';

class Portfolio extends Component {
  constructor( props ) {
    super( props );
    this.fetchTransactions = this.fetchTransactions.bind( this );
    this.state = {
      currentUserName: this.props.userName,
      currentUserId: this.props.userId,
      labels: [],
      remainingData: [],
      currentValuesFromAllCoins: [],
      gainsFromAllCoins: [],
      transactions: [],
    };
    this.setSymbol = this.setSymbol.bind( this );
    this.handleLoading = this.handleLoading.bind( this );
  }
  componentDidMount() {
    this.fetchTransactions();
  }
  setSymbol( symbol ) {
    this.props.setSymbol( symbol );
  }
  handleLoading() {
    this.props.handleLoading();
  }
  fetchTransactions() {
    this.handleLoading();
    fetch( `/api/${this.state.currentUserId}/transactions`, {
      credentials: 'same-origin',
    } )
      .then( response => response.json() )
      .then( ( transactions ) => {
        this.handleLoading();
        const currentValuesFromAllCoins = [];
        const gainsFromAllCoins = [];
        const labels = [];
        const remainingData = [];
        transactions.forEach( ( indiv ) => {
          const number = Number( indiv.remaining );
          const numCurrentValueFromACoin = Number( indiv.currentValue );
          const numGainFromACoin = Number( indiv.gain );

          labels.push( indiv.symbol );
          remainingData.push( number );
          currentValuesFromAllCoins.push( numCurrentValueFromACoin );
          gainsFromAllCoins.push( numGainFromACoin );
        } );
        this.setState( {
          labels,
          remainingData,
          currentValuesFromAllCoins,
          gainsFromAllCoins,
          transactions,
        } );
      } );
  }


  render() {
    const transactions =
    this.state.transactions.map( transaction =>
      <PortfolioMain key={this.state.transactions.indexOf( transaction )} singleTransaction={transaction} userName={this.statecurrentUserName} userId={this.state.currentUserId} setSymbol={this.setSymbol} /> );
    return (


      <Grid.Row id="RowOnPortfolio">
        <Grid.Column width={5}>
          <Portfolio_left currentValuesFromAllCoins={this.state.currentValuesFromAllCoins} gainsFromAllCoins={this.state.gainsFromAllCoins} />
          <PieChart labels={this.state.labels} remaining={this.state.remainingData} />
          <Divider />
          <Chart />
          <Divider />
        </Grid.Column>
        <Grid.Column className="RightColumn" width={11}>
          <Header>
            <p className="WelcomeName">
        Hello, {this.state.currentUserName}!
            </p>
          </Header>
          <div className="transaction-list-portfolio">
            <List>
              {transactions}
            </List>
          </div>
          <AddCoinModal userId={this.state.currentUserId} fetchTransactions={this.fetchTransactions} />
        </Grid.Column>
      </Grid.Row>
    );
  }
}

export default Portfolio;
