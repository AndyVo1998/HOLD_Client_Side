
import React, { Component } from 'react';
import logo from './logo.svg';
import Ticker from './Ticker.jsx';


class App extends Component {
  render() {
    return (
      <div className="App">
        <Ticker currency="BTC" />
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To a started, edit <code>src/App.js</code> and save to reload WHAT?  REALLY.
        </p>
      </div>
    );
  }
}

export default App;
