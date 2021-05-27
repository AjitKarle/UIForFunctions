import React, { Component } from 'react';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            symbol: '',
            ERC20ContractAddress: '',
            ERC721ContractAddress: '',
            owner: ''
        }
    }
    render() {
        return (
            <div>
                <div>
                    <h3>Get Name</h3>
                    <form onSubmit={async (event) => {
                    event.preventDefault();
                    const name = await this.props.getName();
                    this.setState({ name });
                    }}>
                    <input type='submit' className='btn btn-primary ' value='GET NAME'></input>
                    <h4>{ this.state.name }</h4>
                    </form>
                </div>
           <hr />
          <div>
          <h3>Get Symbol</h3>
            <form onSubmit={async (event) => {
              event.preventDefault();
                const symbol = await this.props.getSymbol();
                this.setState({ symbol });
            }}>
              <input type='submit' className='btn btn-primary ' value='GET SYMBOL'></input>
              <h4>{ this.state.symbol }</h4>
            </form>
            </div>
            <hr />
          <div>
          <h3>Get Contract Address(ERC721)</h3>
            <form onSubmit={async (event) => {
              event.preventDefault();
                const ERC721ContractAddress = await this.props.getERC721ContractAddress();
                this.setState({ ERC721ContractAddress });

             }}>
              <input type='submit' className='btn btn-primary ' value='GET CONTRACT ADDRESS'></input>
              <h4>{ this.state.ERC721ContractAddress }</h4>
            </form>
            </div>
            <hr />
          <div>
            <h3>Get Contract Address(ERC20)</h3>
                <form onSubmit={async (event) => {
                event.preventDefault();
                const ERC20ContractAddress = await this.props.getERC20ContractAddress();
                this.setState({ ERC20ContractAddress });
                }}>
              <input type='submit' className='btn btn-primary ' value='GET CONTRACT ADDRESS'></input>
              <h4>{ this.state.ERC20ContractAddress }</h4>
            </form>
            </div>
            <hr />
          <div>
          <h3>Get Owner</h3>
            <form onSubmit={async (event) => {
              event.preventDefault();
                const owner = await this.props.getOwner();
                this.setState({ owner });
             }}>
              <input type='submit' className='btn btn-primary ' value='GET OWNER'></input>
              <h4>{ this.state.owner}</h4>
            </form>
            </div>
          <hr />
        </div>
        )
    }
}

export default Home;