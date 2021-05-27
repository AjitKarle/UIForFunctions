import React, { Component } from 'react';

class NftBank extends Component {
    constructor(props) {
        super(props);
        this.state = {
            totalSupplyERC20: '',
        }
    }
    render() {
        return (
            <div>
          <h3>Buy Richedu Tokens</h3>
            <form onSubmit={(event) => {
              event.preventDefault();
              const val = this.val.value;
              this.props.buyRichedu(val);
            }}>
              <input className='p-3' placeholder='_amount' ref={ (input) =>{this.val = input }} />
            <input type='submit' className='btn btn-primary ' value='BUY RICHEDU'></input>
          </form>
          <hr />
           <h3>Total Supply of RICHEDU</h3>
        <form onSubmit={async (event) => {
                    event.preventDefault();
                    const totalSupplyERC20 = await this.props.totalSupplyERC20();
                    this.setState({ totalSupplyERC20 });
        }}>
            <input type='submit' className='btn btn-primary ' value='TOTAL SUPPLY(RICHEDU)'></input>
            <h4>{ this.state.totalSupplyERC20 }</h4>
        </form>
          <hr />
          <h3>Sell Richedu Tokens</h3>
            <form onSubmit={(event) => {
              event.preventDefault();
              const amount = this.amount.value;
              console.log("Inside sell richedu", this.props.erc721Contract.address);
              this.props.approve_erc20(this.props.erc721Contract.address, amount);
              this.props.sellRichedu(amount);
           }}>
              <input className='p-3' placeholder='_amount' ref={ (input) =>{this.amount = input }}/>
            <input type='submit' className='btn btn-primary ' value='SELL RICHEDU'></input>
          </form>
          </div>
        )
    }
}


export default NftBank;