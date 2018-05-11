import React, { Component } from 'react';
import PropTypes from 'prop-types';
import logo2 from '../navbar/logo2.png';

class PortfolioLeft extends Component {
  static currentValue( arr ) {
    let total = 0;
    arr.forEach( ( element ) => {
      total += element;
    } );
    return ( Math.round( total * 100 ) / 100 );
  }

  render() {
    const totalValue = PortfolioLeft.currentValue( this.props.currentValuesFromAllCoins );
    const totalGain = PortfolioLeft.currentValue( this.props.gainsFromAllCoins );
    if ( totalGain >= 0 ) {
      return (
        <div>
          <img className="ui centered small image"src={logo2} alt="cross logo" />
          <h6 className="WelcomeName">
             Hello {this.props.currentUserName}
          </h6>
          <h3 className="ui header">YOUR PORTFOLIO BALANCE IS</h3>
          <h1 className="ui header">${totalValue}</h1>
          <h4 className="green ui header"><i className="green caret up icon" />${totalGain}</h4>
          <div className="ui divider" />
        </div>
      );
    }
    return (
      <div>
        <img className="ui centered small image"src={logo2} alt="cross logo" />
        <h6 className="WelcomeName">
             Hello {this.props.currentUserName}
        </h6>
        <h3 className="ui header">YOUR PORTFOLIO BALANCE IS</h3>
        <h1 className="ui header">${totalValue}</h1>
        <h4 className="red ui header"><i className="red caret down icon" />${totalGain}</h4>
        <div className="ui divider" />
      </div>
    );
  }
}

export default PortfolioLeft;

PortfolioLeft.propTypes = {
  currentValuesFromAllCoins: PropTypes.number,
  currentUserName: PropTypes.string,
  gainsFromAllCoins: PropTypes.number,
};

PortfolioLeft.defaultProps = {
  currentValuesFromAllCoins: 0,
  currentUserName: '',
  gainsFromAllCoins: PropTypes.number,
};
