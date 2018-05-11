import React, { Component } from 'react';
import { Grid, Loader, Dimmer } from 'semantic-ui-react';
import {
  BrowserRouter as Router,
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


class App extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      isLoggedIn: null,
      userId: '',
      userName: '',
      loading: false,
    };
    this.setLoggedin = this.setLoggedin.bind( this );
    this.setSymbol = this.setSymbol.bind( this );
    this.handleLoading = this.handleLoading.bind( this );
  }

  setLoggedin( loggedIn, id, userName ) {
    this.setState( { isLoggedIn: loggedIn, userId: id, userName } );
    localStorage.setItem( 'isLoggedIn', loggedIn );
    localStorage.setItem( 'userId', id );

    localStorage.setItem( 'userName', userName );
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


  render() {
    return (

      <div className="App">
        <Dimmer active={this.state.loading} page>
          <Loader size="massive" />
        </Dimmer>
        <NavBar isAuthorized={this.state.isLoggedIn} handleAuth={this.setLoggedin} userId={this.state.userId} />
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
                  this.state.isLoggedIn ?
                  ( <Portfolio {...props} userName={this.state.userName} userId={this.state.userId} setSymbol={this.setSymbol} handleLoading={this.handleLoading} /> ) :
                  ( <Redirect to="/" /> )
                  )}
              />
              <Route
                exact
                path="/:userId/transactions/:symbol"
                render={props => (
                this.state.isLoggedIn ?
                ( <SingleCurrencyPage {...props} userName={this.state.userName} userId={this.state.userId} symbol={this.state.symbol} handleLoading={this.handleLoading} /> ) :
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
