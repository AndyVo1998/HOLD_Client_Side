import { Button, Modal, Dropdown, Divider, Input } from 'semantic-ui-react';
import moment from 'moment';
import PropTypes from 'prop-types';
import 'react-datepicker/dist/react-datepicker.css';
import React, { Component } from 'react';
import DatePicker from 'react-datepicker';


class AddCoinModal extends Component {
  constructor( props ) {
    super( props );
    this.handlePriceInput = this.handlePriceInput.bind( this );
    this.handleAmountInput = this.handleAmountInput.bind( this );
    this.handleChange = this.handleDateInput.bind( this );
    this.handleCurrencyInput = this.handleCurrencyInput.bind( this );
    this.handleSubmit = this.handleSubmit.bind( this );
    this.postTransaction = this.postTransaction.bind( this );
    this.handleOpen = this.handleOpen.bind( this );
    this.handleClose = this.handleClose.bind( this );

    this.state = {
      symbol: this.props.symbol,
      userId: this.props.userId,
      modalOpen: false,
      startDate: moment(),
      buy: true,
      amount_error: true,
      price_error: true,
      coins: [],
    };
    this.fetchCoins();
    this.handleDateInput = this.handleDateInput.bind( this );
  }

  fetchCoins() {
    fetch( '/api/coins', {
      credentials: 'same-origin',
    } )
      .then( response => response.json() )
      .then( ( coins ) => {
        const parsedCoins = coins.map( coin =>
          ( { key: coin.Symbol, value: coin.Symbol, text: coin.FullName } ) );
        this.setState( { coins: parsedCoins } );
      } )
      .catch( ( error ) => {
        this.console.error( error );
      } );
  }

  handleOpen() {
    this.setState( {
      modalOpen: true,
    } );
  }

  handleClose() {
    this.setState( {
      modalOpen: false,
    } );
  }

  handlePriceInput( event ) {
    if ( !event.target.value.match( /^[+-]?\d+(\.\d+)?$/ ) && event.target.value.length >= 0 ) {
      this.setState( {
        price_error: true,
      } );
    } else {
      this.setState( {
        price: event.target.value,
        price_error: false,
      } );
    }
  }

  handleAmountInput( event ) {
    if ( !event.target.value.match( /^[+-]?\d+(\.\d+)?$/ ) && event.target.value.length >= 0 ) {
      this.setState( {
        amount_error: true,
      } );
    } else {
      this.setState( {
        amount_error: false,
        amount: event.target.value,
      } );
    }
  }

  handleBuyState( state ) {
    this.setState( {
      buy: state,
    } );
  }


  handleDateInput( date ) {
    this.setState( {
      startDate: date,
    } );
  }

  handleCurrencyInput( event, data ) {
    if ( data.value ) {
      this.setState( {
        symbol_error: false,
        symbol: data.value,
      } );
    } else {
      this.setState( {
        symbol_error: true,
      } );
    }
  }

  handleSubmit() {
    if ( !this.state.amount_error && !this.state.price_error && !this.state.symbol_error ) {
      const transaction =
      {
        users_id: this.state.userId,
        symbol: this.state.symbol,
        price: this.state.price,
        amount: this.state.amount,
        buy: this.state.buy,
        created_at: this.state.startDate,
      };
      this.postTransaction( transaction );
      this.handleClose();
    } else {
      console.log( 'BAD INPUT' );
    }
  }

  postTransaction( transaciton ) {
    fetch( '/api/transactions', {
      method: 'POST',
      body: JSON.stringify( transaciton ),
      headers: new Headers( {
        'Content-Type': 'application/json',
      } ),
      credentials: 'same-origin',
    } ).then( ( result ) => {
      console.log( result );
      this.props.fetchTransactions();
      this.setState( {
        amount_error: true,
        price_error: true,
      } );
    } );
  }

  render() {
    return (
      <div className="App">
        <br />
        <Modal open={this.state.modalOpen} dimmer="blurring" trigger={<Button secondary onClick={this.handleOpen}>Add Transaction</Button>}>
          <Modal.Content>
            <Modal.Description>

              <Button inverted color="green" active={this.state.buy} onClick={() => this.handleBuyState( true )}>Buy</Button>
              <Button inverted color="blue" active={this.state.sell} onClick={() => this.handleBuyState( false )}>Sell</Button>

              <Divider />
              <DatePicker
                class="ui small input"
                selected={this.state.startDate}
                onChange={this.handleDateInput}
                maxDate={moment().add( 0, 'day' )}
              />
              <Divider />
              <Dropdown defaultValue={this.state.symbol} placeholder="Select Currency" fluid search selection options={this.state.coins} error={this.state.symbol_error} onChange={this.handleCurrencyInput} />
              <Divider />
              <Input size="mini" error={this.state.price_error} placeholder={( this.state.buy ) ? 'Purchase price' : 'Sold price'} onChange={this.handlePriceInput} />
              <Divider />
              <Input size="mini" error={this.state.amount_error} placeholder={( this.state.buy ) ? 'Amount bought' : 'Amount sold'} onChange={this.handleAmountInput} />
              <Divider />

              <Button inverted color={this.state.buy ? 'green' : 'blue'}onClick={this.handleSubmit}>Add transaction</Button> <Button inverted onClick={this.handleClose}>Cancel</Button>
            </Modal.Description>
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}

export default AddCoinModal;

AddCoinModal.propTypes = {
  fetchTransactions: PropTypes.func,
  symbol: PropTypes.string,
  userId: PropTypes.number,
};

AddCoinModal.defaultProps = {
  fetchTransactions: () => {},
  symbol: 'BTC',
  userId: -1,
};
