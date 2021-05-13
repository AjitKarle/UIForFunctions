import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3';
import Cybercafe from '../abis/Cybercafe.json'
import CryptoCoffee from '../abis/CryptoCoffee.json';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { account: '', erc20Contract: null, erc721Contract: null, totalSupplyERC721: 0, totalSupplyERC20: 0, val: '', loading: false};
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
      const erc721ContractOwner = await erc721Contract.methods.owner().call()
      this.setState({ totalSupplyERC721 })
      // Load Tokens
      console.log("ERC721 Contract: ", erc721Contract)
      console.log("ERC721 Contract Owner: ", erc721ContractOwner)
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
      const address = await this.state.erc721Contract.methods.getERC20TokenAddress().call();
      const erc20Contract = new web3.eth.Contract(abi, address)
      this.setState({ erc20Contract })
      const totalSupplyERC20 = await erc20Contract.methods.totalSupply().call()
      this.setState({ totalSupplyERC20 })
        // Load Tokens
       //await erc20Contract.methods.transfer(this.state.account, 1000).send({
        //from: this.state.erc721Contract.address
      //});
      console.log("ERC20 Contract Address: ", address)
      console.log("ERC20 Contract Address given by abi: ", erc20Contract.address);
      console.log("Total supply of ERC20 tokens is: ", totalSupplyERC20)
    } else {
      window.alert('Smart contract not deployed to detected network.')
    }
  }
  mint = (hash, metadata, mintingCost, userPays) => {
    this.state.erc721Contract.methods.mintNFT(hash, metadata, mintingCost, userPays).send({
      from: this.state.account
    }).once('receipt', (receipt) => {
      if (receipt !== undefined)
          console.log("Success!")
    })
  }
  totalSupplyRichedu = async () => {
    const RICHEDU = await this.state.erc20Contract.methods.totalSupply().call();
    console.log("Total Supply Richedu: ", RICHEDU);
  }
  showNftDetails = async () => {
    const NftDetails = await this.state.erc721Contract.methods.NFT_details().call();
    console.log("NFT Details: ", NftDetails);
  }
  gift = async (receipient, tokenId) => {
    await this.state.erc721Contract.methods.giftNFT(receipient, tokenId).send({
      from: this.state.account
    }).once('receipt', (receipt) => {
      console.log("Receipt of gitNFT function is: ", receipt);
    });
  }
  stopSale = async (tokenId) => {
    await this.state.erc721Contract.methods.stopSale(tokenId).send({
      from: this.state.account
    }).once('receipt', (receipt) => {
      console.log("Receipt of stopSale function is: ", receipt);
    });
  }
  buyRichedu = async (event) => {
    event.preventDefault();
    var val = parseInt(this.state.val);
    console.log("Val is: ", val);
    await this.state.erc721Contract.methods.buyRicheduToken().send({
      from: this.state.account,
      value: val
    })
  }
  sellRichedu = async (amount) => {
    console.log(amount);
      await this.state.erc721Contract.methods.sellRicheduToken(amount).send({
      from: this.state.account
    }).once('receipt', (receipt) => {
      console.log("Receipt of sellRichedu function is: ", receipt);
    })
  }
  buy = async (tokenId, userPays) => {
    await this.state.erc721Contract.methods.buyAtSale(tokenId, userPays).send({
      from: this.state.account
    }).once('receipt', (receipt) => {
      console.log("Receipt of buy function is: ", receipt);
    })
  }
  sellNft = async (tokenId, userPays) => {
    await this.state.erc721Contract.methods.setPricePutOnSale(tokenId, userPays).send({
      from: this.state.account
    }).once('receipt', (receipt) => {
      console.log("Receipt of setPricePutOnSale function", receipt);
    })
  }
  burn = async (tokenId) => {
    await this.state.erc721Contract.methods.burnNFT(tokenId).send({
      from: this.state.account
    }).once("receipt", (receipt) => {
      console.log("Receipt of burnNFT function: ", receipt);
    })
  }
  ownedNft = async () => {
    const ownedNFTs = await this.state.erc721Contract.methods.owned_NFTs().call();
    console.log("User owned NFTs are: ", ownedNFTs);
  }
  listNFTsForSale = async () => {
    console.log("Not yet done");
  }
  checkNftBalance = async (address) => {
    const nftBalance = await this.state.erc721Contract.methods.balanceOf(address).call();
    console.log("Number of NFTs owned by user are: ", nftBalance);
  }
  approve = async (address, tokenId) => {
    await this.state.erc721Contract.methods.approve(address, tokenId).send({
      from: this.state.account
    })
    .once('riceipt', (receipt) => {
      console.log("Receipt for approve function is: ", receipt);
    })
  }
  getName = async () => {
    const name = await this.state.erc721Contract.methods.name().call();
    console.log("Name is: ", name);
  }
   getSymbol = async () => {
    const symbol = await this.state.erc721Contract.methods.symbol().call();
    console.log("Symbol is: ", symbol);
  }
  getOwner = async () => {
    const owner = await this.state.erc721Contract.methods.owner().call();
    console.log("Owner is: ", owner);
  }
  ownerOf = async (tokenId) => {
    const owner = await this.state.erc721Contract.methods.ownerOf(tokenId).call();
    console.log("Owner of tokenId", tokenId, "is: ", owner);
  }
  getTokenByIndex = async (index) => {
    const token = await this.state.erc721Contract.methods.tokenByIndex(index).call();
    console.log("Token at index ", index, "is: ", token);
  }
  approve = (spender,amount) => {
    // if (error) {
    //   console.error(error)
    //   return
    // }
    this.setState({ loading: true })
    this.state.erc20Contract.methods.approve(spender, amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.setState({
        loading: false
      })
      window.location.reload()
    }).on('error', (e) => {
      window.alert('Error')
      this.setState({ loading: false })
    })
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
          <h4>
          <p className="navbar-brand col-sm-3 col-md-3 mr-1" >
            <span id="account">{this.state.account}</span>
          </p></h4>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <h1>Frontend Goes Here!</h1>
                <code>
                  Following functions are to be added:<br></br>
                  For ERC721: <br></br>
                  1. Mint NFT(Done)<br></br>
                  2. Gift NFT(Done)<br></br>
                  3. Buy NFT(Done)<br></br>
                  4. Sell NFT(Done)<br></br>
                  5. Burn NFT(Done)<br></br>
                  6. List all NFT's for sale(NOT DONE)<br></br>
                  7. List user owned NFT's(Done)<br></br>
                  8. Stop sale(Done)<br></br>
                  9. Show NFT details(Done)<br></br>
                  10. Buy richedu tokens(NOT DONE)<br></br>
                  11. Sell richedu tokens(Done)<br></br>
                  12. Balance of user(Done)<br></br>
                  13. Approve(NOT DONE) <br></br>
                  14. Get Name(Done) <br></br>
                  15. Get Symbol(Done) <br></br>
                  16. Get Owner(Done) <br></br>
                  17. Owner Of TokenId(Done) <br></br>
                  18. Get Token by Index(Done) <br></br>

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
           <hr />
          <div>
          <h3>Get Name</h3>
            <form onSubmit={(event) => {
              event.preventDefault();
              this.getName();
           }}>
          <input type='submit' className='btn btn-primary ' value='GET NAME'></input>
          </form>
          </div>
           <hr />
          <div>
          <h3>Get Symbol</h3>
            <form onSubmit={(event) => {
              event.preventDefault();
              this.getSymbol();
           }}>
          <input type='submit' className='btn btn-primary ' value='GET SYMBOL'></input>
          </form>
          </div>
          <hr />
          <div>
          <h3>Get Owner</h3>
            <form onSubmit={(event) => {
              event.preventDefault();
              this.getOwner();
           }}>
          <input type='submit' className='btn btn-primary ' value='GET OWNER'></input>
          </form>
          </div>
          <hr />
          <div>
          <h3>Owner of TokenID</h3>
            <form onSubmit={(event) => {
              event.preventDefault();
              const tokenId = this.tokenId.value;
              this.ownerOf(tokenId);
            }}>
          <input className='p-3' placeholder='_tokenId' ref={ (input) =>{this.tokenId = input }}/>
          <input type='submit' className='btn btn-primary ' value='GET OWNER OF TOKEN'></input>
          </form>
          </div>
          <hr />
          <div>
          <h3>Get Token by Index</h3>
            <form onSubmit={(event) => {
              event.preventDefault();
              const index = this.index.value;
              this.getTokenByIndex(index);
            }}>
          <input className='p-3' placeholder='_index' ref={ (input) =>{this.index = input }}/>
          <input type='submit' className='btn btn-primary ' value='GET TOKEN BY INDEX'></input>
          </form>
          </div>
          <hr />
          <div>
          <h3>Buy Richedu Tokens</h3>
            <form onSubmit={this.buyRichedu}>
              <input
              className='p-3'
              placeholder='_amount'
                value={this.state.val}
                onChange={event=>this.setState({val: event.target.value})}
              />
            <input type='submit' className='btn btn-primary ' value='BUY RICHEDU'></input>
          </form>
          </div>
          <hr />
           <div>
          <h3>List NFT'S for Sale</h3>
            <form onSubmit={(event) => {
              event.preventDefault();
              this.listNFTsForSale();
           }}>
            <input type='submit' className='btn btn-primary ' value='LIST'></input>
          </form>
          </div>
          <hr />
           <h3>Total Supply of RICHEDU</h3>
        <form onSubmit={(event) => {
            event.preventDefault()
            this.totalSupplyRichedu()
        }}>
            <input type='submit' className='btn btn-primary ' value='TOTAL SUPPLY(RICHEDU)'></input>
        </form>
          <hr />
           <div>
          <h3>List User's owned NFT's</h3>
            <form onSubmit={(event) => {
              event.preventDefault()
              this.ownedNft()
           }}>
            <input type='submit' className='btn btn-primary ' value='LIST OWNED NFTs'></input>
          </form>
          </div>
          <hr />
          <div>
            <div className="card mb-3 mx-auto bg-dark col-md-6" style={{ maxWidth: '720px' }}>
                  <br></br>
                  <h2 className="text-white text-monospace bg-dark" style={{ padding: '75px;' }}><b>Approve spender</b></h2>
                  <form onSubmit={(event) => {
                    event.preventDefault()
                    const spender = this.spender.value
                    const amount = this.amount.value
                    this.approve(spender, amount)
                  }} >
                    <div className="form-group">
                      <br></br>
                      <input
                        id="spender"
                        type="text"
                        ref={(input) => { this.spender = input }}
                        className="form-control text-monospace"
                        placeholder="Spender contract address (ERC721)"
                        required />
                      <input
                        id="amount"
                        type="text"
                        ref={(input) => { this.amount = input }}
                        className="form-control text-monospace"
                        placeholder="Amount allowed to spend"
                        required />
                    </div>
                    <p className="text-white text-monospace bg-dark">{this.props.account}</p>
                    <button type="submit" className="btn-primary btn-block" style={{ backgroundColor: 'dimgray' }}><b>Approve</b></button>
                  </form>
            </div>
            <hr />
          <h3>Sell Richedu Tokens</h3>
            <form onSubmit={(event) => {
              event.preventDefault();
              const amount = this.amount.value;
              this.sellRichedu(amount);
           }}>
              <input className='p-3' placeholder='_amount' ref={ (input) =>{this.amount = input }}/>
            <input type='submit' className='btn btn-primary ' value='SELL RICHEDU'></input>
          </form>
          </div>
          <hr />
          <h3>Mint NFT(mintNFT)</h3>
        <form onSubmit={(event) => {
          event.preventDefault()
          const hash = this.coffeeHash.value
          const metadata = this.metadata.value
          var mintingCost = this.mintingCost.value.toString()
          var userPays = this.userPays.value.toString()
          this.mint(hash, metadata, mintingCost, userPays)
        }}>
          <input type='text' className='p-3' placeholder='e.g. _Hash' ref={(input) => { this.coffeeHash = input }}></input>
          <input type='text' className='p-3' placeholder='e.g. _Metadata' ref={(input) => { this.metadata = input }}></input>
          <input type='text' className='p-3' placeholder='e.g. _MintingCost' ref={(input) => { this.mintingCost = input }}></input>
          <input type='text' className='p-3' placeholder='e.g. _UserPays' ref={(input) => { this.userPays = input }}></input>
          <input type='submit' className='btn btn-primary ' value='MINT'></input>
        </form>
          <hr />
        <div>
          <h3>Show NFT Details</h3>
            <form onSubmit={(event) => {
              event.preventDefault();
              const tokenId = this.tokenId.value;
              this.showNftDetails(tokenId);
           }}>
            <input className='p-3' placeholder='_tokenId' ref={(input) => {this.tokenId = input}} />
            <input type='submit' className='btn btn-primary ' value='SHOW'></input>
          </form>
          </div>
          <hr />
        <div>
          <h3>Sell NFT(setPricePutOnSale)</h3>
            <form onSubmit={(event) => {
              event.preventDefault();
              const tokenId = this.tokenId.value;
              const userPays = this.userPays.value;
              this.sellNft(tokenId, userPays);
            }}>
              <input className='p-3' placeholder='_tokenId' ref={(input) => {this.tokenId = input}}/>
              <input className='p-3' placeholder='_userPays' ref={(input) => {this.userPays = input}}/>
            <input type='submit' className='btn btn-primary ' value='SELL'></input>
          </form>
        </div>
        <hr />
        <div>
          <h3>Buy NFT(buyAtSale)</h3>
            <form onSubmit={(event) => {
              event.preventDefault();
              const tokenId = this.tokenId.value;
              const userPays = this.userPays.value;
              this.buy(tokenId, userPays);
            }}>
              <input className='p-3' placeholder='_tokenId' ref={ (input) => {this.tokenId = input}}/>
              <input className='p-3' placeholder='_userPays' ref={(input) =>{this.userPays = input}}/>
            <input type='submit' className='btn btn-primary ' value='BUY'></input>
        </form>
        </div>
          <hr />
          <div>
          <h3>Approve(approve)</h3>
          <form onSubmit={(event) => {
          event.preventDefault()
              const address = this.address.value;
              const tokenId = this.tokenId.value;
              this.approve(address, tokenId);
            }}>
            <input type='text' className='p-3' placeholder='_address' ref={(input) => {this.address = input}}></input>
            <input type='text' className='p-3' placeholder='_tokenId' ref={(input) => {this.tokenId = input}}></input>
            <input type='submit' className='btn btn-primary ' value='APPROVE'></input>
        </form>
        </div>
          <hr />
        <div>
          <h3>Burn NFT(burnNFT)</h3>
          <form onSubmit={(event) => {
          event.preventDefault()
          const tokenId = this.tokenId.value
          this.burn(tokenId)
        }}>
            <input type='text' className='p-3' placeholder='_tokenId' ref={(input) => {this.tokenId = input}}></input>
            <input type='submit' className='btn btn-primary ' value='BURN'></input>
        </form>
          </div>
          <hr />
          <div>
          <h3>Gift NFT(giftNFT)</h3>
          <form onSubmit={(event) => {
          event.preventDefault()
          const receipient = this.receipient.value;
          const tokenId = this.tokenId.value;
              this.gift(receipient, tokenId);
            }}>
              <input type='text' className='p-3' placeholder='_receiverAddress' ref={(input) => { this.receipient = input }}></input>
            <input type='text' className='p-3' placeholder='_tokenId' ref={(input) => {this.tokenId = input }}></input>
            <input type='submit' className='btn btn-primary ' value='GIFT'></input>
        </form>
          </div>
          <hr/>
        <div>
          <h3>Stop Sale(stopSale)</h3>
          <form onSubmit={(event) => {
          event.preventDefault()
          const tokenId = this.tokenId.value
          this.stopSale(tokenId)
        }}>
            <input type='text' className='p-3' placeholder='_tokenId' ref={(input) =>{this.tokenId = input}}></input>
            <input type='submit' className='btn btn-primary ' value='STOP'></input>
        </form>
        </div>
          <hr />
          <div>
          <h3> Check Balance(Number of owned NFTs)</h3>
          <form onSubmit={(event) => {
              event.preventDefault()
              const address = this.address.value;
          this.checkNftBalance(address)
            }}>
            <input type='text' className='p-3' placeholder='_address' ref={(input) => { this.address = input }}></input>
            <input type='submit' className='btn btn-primary ' value='CHECK BALANCE(NFT)'></input>
        </form>
        </div>
          <hr />
        </div>
      </div>
    );
  }
}

export default App;
