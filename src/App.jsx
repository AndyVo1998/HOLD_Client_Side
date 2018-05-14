import React, { Component } from 'react';
import { Grid, Loader, Dimmer } from 'semantic-ui-react';
import {
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import Register from './Modules/register/Register.jsx';
import Login from './Modules/login/Login.jsx';
import NavBar from './Modules/navbar/NavBar.jsx';
import WelcomePage from './Modules/welcome/WelcomePage.jsx';
import Portfolio from './Modules/portfolio_page/Portfolio.jsx';
import SingleCurrencyPage from './Modules/single_curency_page/SingleCurrencyPage.jsx';
import TransactionChartPage from './Modules/transaction_chart_page/TransactionChartPage.jsx';
import HistoricalChart from './Modules/historical_chart/HistoricalChart.jsx';


class App extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      isLoggedIn: null,
      userId: '',
      userName: '',
      loading: false,
      visible: false,
    };
    this.setLoggedin = this.setLoggedin.bind( this );
    this.setSymbol = this.setSymbol.bind( this );
    this.handleLoading = this.handleLoading.bind( this );
    this.toggleVisibility = this.toggleVisibility.bind( this );
  }


  componentWillMount() {
    const loginStat = localStorage.getItem( 'isLoggedIn' );
    const id = localStorage.getItem( 'userId' );
    const name = localStorage.getItem( 'userName' );

    this.setState( {
      isLoggedIn: loginStat,
      userId: id,
      userName: name,
    } );
  }

  setLoggedin( loggedIn, id, userName ) {
    this.setState( { isLoggedIn: loggedIn, userId: id, userName } );
    localStorage.setItem( 'isLoggedIn', loggedIn );
    localStorage.setItem( 'userId', id );
    localStorage.setItem( 'userName', userName );
  }

  setSymbol( symbol ) {
    this.setState( { symbol } );
  }
  handleLoading() {
    if ( this.state.loading === true ) {
      this.setState( { loading: false } );
    } else {
      this.setState( { loading: true } );
    }
  }

  toggleVisibility() {
    this.setState( { visible: !this.state.visible } );
  }


  render() {
    return (

      <div className="App">
        <Dimmer active={this.state.loading} page>
          <Loader size="massive" />
        </Dimmer>
        <NavBar
          isAuthorized={this.state.isLoggedIn}
          toggleVisibility={this.toggleVisibility}
          handleAuth={this.setLoggedin}
          userId={this.state.userId}
        />
        <div>
          <Grid stackable >
            <Switch>
              <Route
                exact
                path="/register"
                render={props => <Register {...props} handleAuth={this.setLoggedin} />}
              />
              <Route
                exact
                path="/login"
                render={props => <Login {...props} handleAuth={this.setLoggedin} />}
              />

              <Route
                path="/portfolio/:userId"
                exact
                render={props => (
                  ( this.state.isLoggedIn === true || this.state.isLoggedIn === 'true' ) ?
                  ( <Portfolio
                    {...props}
                    userName={this.state.userName}
                    userId={this.state.userId}
                    visible={this.state.visible}
                    setSymbol={this.setSymbol}
                    handleLoading={this.handleLoading}
                  /> ) :
                  ( <Redirect to="/" /> )
                  )}
              />
              <Route
                exact
                path="/:userId/transactions/:symbol"
                render={props => (
                ( this.state.isLoggedIn === true || this.state.isLoggedIn === 'true' ) ?
                ( <SingleCurrencyPage
                  {...props}
                  userName={this.state.userName}
                  userId={this.state.userId}
                  visible={this.state.visible}
                  symbol={this.state.symbol}
                  handleLoading={this.handleLoading}
                /> ) :
                ( <Redirect to="/login" /> )
                )}
              />
              <Route path="/transactions/btc/chart" exact component={TransactionChartPage} />
              <Route path="/" exact component={WelcomePage} />
            </Switch>
          </Grid>
        </div>
      </div>
    );
  }
}

export default App;
