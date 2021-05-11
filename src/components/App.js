import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3';
import Cybercafe from '../abis/Cybercafe.json'
import CryptoCoffee from '../abis/CryptoCoffee.json';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { account: '', erc20Contract: null, erc721Contract: null, totalSupplyERC721: 0, totalSupplyERC20: 0};
  }
  async componentDidMount() {
    await this.loadWeb3();
    await this.loadBlockchainDataForERC721();
    await this.loadBlockchainDataForERC20();
  }

  async loadWeb3() {
    console.log("Inside loadWeb3 function!");
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
    console.log("Web3 is: ", window.web3);
  }

  async loadBlockchainDataForERC721() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    const networkId = await web3.eth.net.getId()
    const networkData = CryptoCoffee.networks[networkId]
    if(networkData) {
      const abi = CryptoCoffee.abi
      const address = networkData.address
      const erc721Contract = new web3.eth.Contract(abi, address)
      this.setState({ erc721Contract })
      const totalSupplyERC721 = await erc721Contract.methods.totalSupply().call()
      this.setState({ totalSupplyERC721 })
      // Load Tokens
      console.log("Total supply of ERC721 tokens is: ", totalSupplyERC721)
    } else {
      window.alert('Smart contract not deployed to detected network.')
    }
  }
  
  async loadBlockchainDataForERC20() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    const networkId = await web3.eth.net.getId()
    const networkData = Cybercafe.networks[networkId]
    if(networkData) {
      const abi = Cybercafe.abi
      const address = networkData.address
      const erc20Contract = new web3.eth.Contract(abi, address)
      this.setState({ erc20Contract })
      const totalSupplyERC20 = await erc20Contract.methods.totalSupply().call()
      this.setState({ totalSupplyERC20 })
      // Load Tokens
      console.log("Total supply of ERC20 tokens is: ", totalSupplyERC20)
    } else {
      window.alert('Smart contract not deployed to detected network.')
    }
  }
  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="https://github.com/Richeduu/cybercafe/"  
            target="_blank"
            rel="noopener noreferrer"
          >
            Project code is here
          </a>
          <p className="navbar-brand col-sm-3 col-md-3 mr-1" >
            <h4><span id="account">{this.state.account}</span></h4>
          </p>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <h1>Frontend Goes Here!</h1>
                <code>
                  Following functions are to be added:<br></br>
                  For ERC721: <br></br>
                  1. Mint NFT<br></br>
                  2. Gift NFT<br></br>
                  3. Buy NFT<br></br>
                  4. Sell NFT<br></br>
                  5. Burn NFT<br></br>
                  6. List all NFT's for sale<br></br>
                  7. List user owned NFT's<br></br>
                  8. Stop sale<br></br>
                  9. Show NFT details<br></br>
                  10. Buy richedu tokens<br></br>
                  11. Sell richedu tokens<br></br>
<br></br>
                  FOR ERC20:<br></br>
                  1. Show user's richedu balance<br></br>
                  2. Approve<br></br>
                  3. Transfer<br></br>
                  4. Total supply<br></br>
                </code>
              </div>
            </main>
          </div>
          <h3>Mint NFT(mintNFT)</h3>
        <form onSubmit={(event) => {
          event.preventDefault()
          const coffee = this.coffee.value
          const metadata = this.metadata.value
          this.mint(coffee, metadata)
        }}>
          <input type='text' className='p-3' placeholder='e.g. _Hash' ></input>
          <input type='text' className='p-3' placeholder='e.g. _Metadata'></input>
          <input type='text' className='p-3' placeholder='e.g. _MintingCost'></input>
          <input type='text' className='p-3' placeholder='e.g. _UserPays'></input>
          <input type='submit' className='btn btn-primary ' value='MINT'></input>
        </form>
        <hr />
        <div>
          <h3>Sell NFT(setPricePutOnSale)</h3>
           <form onSubmit = {this.setPrice}>
            <input className='p-3' placeholder='_tokenId'/>
            <input className='p-3' placeholder='_userPays' />
            <input type='submit' className='btn btn-primary ' value='SET'></input>
          </form>
        </div>
        <hr />
        <div>
          <h3>Buy NFT(buyAtSale)</h3>
          <form onSubmit = {this.buy}>
              <input className='p-3' placeholder='_tokenId' />
              <input className='p-3' placeholder='_userPays'/>
            <input type='submit' className='btn btn-primary ' value='BUY'></input>
        </form>
        </div>
          <hr />
          <div>
          <h3>Approve(approve)</h3>
          <form onSubmit={(event) => {
          event.preventDefault()
          const coffeeId = this.coffeeId.value
          this.burn(coffeeId)
            }}>
            <input type='text' className='p-3' placeholder='_address'></input>
            <input type='text' className='p-3' placeholder='_tokenId'></input>
            <input type='submit' className='btn btn-primary ' value='APPROVE'></input>
        </form>
        </div>
          <hr />
        <div>
          <h3>Burn NFT(burnNFT)</h3>
          <form onSubmit={(event) => {
          event.preventDefault()
          const coffeeId = this.coffeeId.value
          this.burn(coffeeId)
        }}>
            <input type='text' className='p-3' placeholder='_tokenId'></input>
            <input type='submit' className='btn btn-primary ' value='BURN'></input>
        </form>
        </div>
          <hr />
          <div>
          <h3>Gift NFT(giftNFT)</h3>
          <form onSubmit={(event) => {
          event.preventDefault()
          const coffeeId = this.coffeeId.value
          this.burn(coffeeId)
            }}>
            <input type='text' className='p-3' placeholder='_receiverAddress'></input>
            <input type='text' className='p-3' placeholder='_tokenId'></input>
            <input type='submit' className='btn btn-primary ' value='GIFT'></input>
        </form>
          </div>
          <hr/>
        <div>
          <h3>Stop Sale(stopSale)</h3>
          <form onSubmit={(event) => {
          event.preventDefault()
          const coffeeId = this.coffeeId.value
          this.burn(coffeeId)
        }}>
            <input type='text' className='p-3' placeholder='_tokenId'></input>
            <input type='submit' className='btn btn-primary ' value='STOP'></input>
        </form>
        </div>
          <hr />
        </div>
      </div>
    );
  }
}

export default App;
