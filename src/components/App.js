import React, { Component } from 'react';
import { Button, Table, Form } from 'react-bootstrap';
//import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
import Web3 from 'web3';
import Cybercafe from '../abis/Cybercafe.json'
import CryptoCoffee from '../abis/CryptoCoffee.json';
import Kitchen from './Kitchen.jsx';
import DiningTable from './DiningTable.jsx';
import Marketplace from './Marketplace.jsx';
import Home from './Home.jsx';
// import IpfsFileUpload from './DummyIpfs.js';
import NftBank from './NftBank';
import ipfsmeta from './IpfsMetadata.json';

const IPFS = require('ipfs-api');
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      name: '',
      symbol: '',
      owner: '',
      account: '',
      erc20Contract: null,
      erc721Contract: null,
      ERC721ContractAddress: '',
      ERC20ContactAddress: '',
      totalSupplyERC721: '',
      totalSupplyERC20: '',
      userNftBalance: '',
      ownerOfToken: '',
      flag: false,
      tokenId: '',
      mintingCost: 3,
      name: '',
      description: '',
      specialFeature: '',
      ipfsHashImage: 'default',
      ipfsHashMetadata: 'default',
      buffer:'',
      transactionHash:'',
    };
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
      //const totalSupplyERC20 = await erc20Contract.methods.totalSupply().call()
      //this.setState({ totalSupplyERC20 })
        // Load Tokens
       //await erc20Contract.methods.transfer(this.state.account, 1000).send({
        //from: this.state.erc721Contract.address
      //});
      console.log("ERC20 Contract Address: ", address)
      console.log("ERC20 Contract Address given by abi: ", erc20Contract.address);
      //console.log("Total supply of ERC20 tokens is: ", totalSupplyERC20)
    } else {
      window.alert('Smart contract not deployed to detected network.')
    }
  }
  mint = (hash, metadata, mintingCost, userPays) => {
    console.log("userPays", userPays);
    this.state.erc721Contract.methods.mintNFT(hash, metadata, window.web3.utils.toWei(mintingCost, "ether"), window.web3.utils.toWei(userPays, "ether")).send({
      from: this.state.account
    }).once('receipt', (receipt) => {
      if (receipt !== undefined)
        window.alert('Success!')
      else
        window.alert('Failure!')
    })
  }
  totalSupplyERC20 = async () => {
    this.setState({loading: true})
    const totalSupply = await this.state.erc20Contract.methods.totalSupply().call();
    this.setState({loading: false})
    return totalSupply.toString();
  }
  showNftDetails = async (tokenId) => {
    this.setState({ loading: true });
    const NftDetails = await this.state.erc721Contract.methods.NFT_details(tokenId).call();
    console.log("NFT Details are: ", NftDetails);
    this.setState({ loading: false });
    return NftDetails.toString();
  }
  gift = (receipient, tokenId) => {
    this.setState({ loading: true });
    this.state.erc721Contract.methods.giftNFT(receipient, tokenId).send({
      from: this.state.account
    }).on('transactionHash', (hash) => {
      this.setState({loading: false})
      window.alert('Success')
    }).on('error', (e) => {
      this.setState({ loading: false })
      window.alert('Error')
    })
  }
  stopSale = (tokenId) => {
    this.setState({ loading: true });
    this.state.erc721Contract.methods.stopSale(tokenId).send({
      from: this.state.account
    }).on('transactionHash', (hash) => {
      this.setState({loading: false})
      window.alert('Success')
    }).on('error', (e) => {
      this.setState({ loading: false })
      window.alert('Error')
    })
  }
  buyRichedu = (val) => {
    console.log("Inside buyRichedu and value is: ", val);
    this.setState({ loading: true });
    this.state.erc721Contract.methods.buyRicheduToken().send({
      from: this.state.account,
      value: window.web3.utils.toWei(val.toString(), "ether")
    }).on('transactionHash', (hash) => {
      this.setState({loading: false})
      window.alert('Success')
    }).on('error', (e) => {
      window.alert('Error')
      this.setState({ loading: false })
    })
  }
  sellRichedu = (amount) => {
    this.setState({ loading: true });
    this.state.erc721Contract.methods.sellRicheduToken(window.web3.utils.toWei(amount.toString(), "ether")).send({
      from: this.state.account
    }).on('transactionHash', (hash) => {
      this.setState({loading: false})
      window.alert('Success')
    }).on('error', (e) => {
      this.setState({ loading: false })
      window.alert('Error')
    })
  }
  buy = (tokenId, userPays) => {
    this.setState({ loading: true });
    this.state.erc721Contract.methods.buyAtSale(tokenId, userPays).send({
      from: this.state.account
    }).on('transactionHash', (hash) => {
      this.setState({loading: false})
      window.alert('Success')
    }).on('error', (e) => {
      this.setState({ loading: false })
      window.alert('Error')
    })
  }
  sellNft = (tokenId, userPays) => {
    this.setState({ loading: true });
    this.state.erc721Contract.methods.setPricePutOnSale(tokenId, userPays).send({
      from: this.state.account
    }).on('transactionHash', (hash) => {
      this.setState({loading: false})
      window.alert('Success')
    }).on('error', (e) => {
      this.setState({ loading: false })
      window.alert('Error')
    })
  }
  burn = (tokenId) => {
    this.setState({ loading: true });
    this.state.erc721Contract.methods.burnNFT(tokenId).send({
      from: this.state.account
    }).on('transactionHash', (hash) => {
      this.setState({loading: false})
      window.alert('Success')
    }).on('error', (e) => {
      this.setState({ loading: false })
      window.alert('Error')
    })
  }
  ownedNft = async () => {
    this.setState({loading: true});
    const ownedNFTs = await this.state.erc721Contract.methods.owned_NFTs().call();
    this.setState({loading: false});
    return ownedNFTs;
  }
  listNFTsForSale = async () => {
    this.setState({loading: true});
    const onSaleNfts = await this.state.erc721Contract.methods.onSaleNFTs().call();
    this.setState({loading: false});
    return onSaleNfts;
  }
  checkNftBalance = async (address) => {
    this.setState({ loading: true });
    const nftBalance = await this.state.erc721Contract.methods.balanceOf(address).call();
    this.setState({loading: false});
    return nftBalance;
  }
  approve = (address, tokenId) => {
    this.setState({loading: true});
    this.state.erc721Contract.methods.approve(address, tokenId).send({
      from: this.state.account
    }).on('transactionHash', (hash) => {
      this.setState({
        loading: false
      })
      window.alert('Success!')
    }).on('error', (e) => {
      window.alert('Error')
      this.setState({ loading: false })
    })
  }
  getName = async () => {
    this.setState({ loading: true });
    const name = await this.state.erc721Contract.methods.name().call();
    this.setState({ loading: false });
    return name;
  }
  getSymbol = async () => {
    this.setState({ loading: true });
    const symbol = await this.state.erc721Contract.methods.symbol().call();
    this.setState({ loading: false });
    return symbol;
  }
  getOwner = async () => {
    this.setState({ loading: true });
    const owner = await this.state.erc721Contract.methods.owner().call();
    this.setState({ loading: false });
    return owner;
  }
  getERC721ContractAddress = async () => {
    this.setState({ loading: true });
    const address = await this.state.erc721Contract.methods.getContractAddress().call();
    this.setState({ loading: false });
    return address;
  }
  getERC20ContractAddress = async () => {
    this.setState({ loading: true });
    const address = this.state.erc20Contract.address;
    this.setState({ loading: false });
    return address;
  }
  ownerOf = async (tokenId) => {
    this.setState({ loading: true });
    const owner = await this.state.erc721Contract.methods.ownerOf(tokenId).call();
    this.setState({loading: false});
    return owner;
  }
  getTokenByIndex = async (index) => {
    this.setState({ loading: true });
    const token = await this.state.erc721Contract.methods.tokenByIndex(index).call();
    this.setState({loading: false});
    return token;
  }
  approve_erc20 = (spender,amount) => {   // Can be updated with async await syntax.
    console.log("spender is: ", spender);
    this.setState({ loading: true })
    this.state.erc20Contract.methods.approve(spender, window.web3.utils.toWei(amount.toString(), "ether")).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.setState({
        loading: false
      })
      window.alert('Success!')
    }).on('error', (e) => {
      window.alert('Error')
      this.setState({ loading: false })
    })
  }
    onSubmit = async () => {
          this.setState({loading: true})
          await ipfs.add(this.state.buffer, (err, ipfsHash) => {
            console.log(err,ipfsHash);
            this.setState({ ipfsHashImage:ipfsHash[0].hash });
            this.onSubmitForMetadata();
          });
        };
        onSubmitForMetadata = async ()=> {
          ipfsmeta.name = this.state.name;
          ipfsmeta.description = this.state.description;
          ipfsmeta.imageHash = this.state.ipfsHashImage;
          ipfsmeta.specialFeature = this.state.specialFeature;
          console.log(ipfsmeta);
          await ipfs.files.add(Buffer.from(JSON.stringify(ipfsmeta)), (err,ipfsHash) => {
            console.log(err,ipfsHash);
            this.setState({ ipfshashMetadata:ipfsHash[0].hash });
            this.mint(this.state.ipfsHashImage, this.state.ipfshashMetadata,this.state.mintingCost, this.state.mintingCost).send({
              from: this.state.account
            }, (error, transactionHash) => {
              console.log(transactionHash);
            });
          });
          this.setState({ loading: false });
        }
    captureFile =(event) => {
            event.stopPropagation()
            event.preventDefault()
            const file = event.target.files[0]
            let reader = new window.FileReader()
            reader.readAsArrayBuffer(file)
            reader.onloadend = () => this.convertToBuffer(reader)
          };

    convertToBuffer = async(reader) => {
            const buffer = await Buffer.from(reader.result);
            this.setState({buffer});
      };

        setName = async (event) => {
          event.preventDefault();
          this.setState({name:event.target.value});
        }
        setDescription = async (event) => {
          event.preventDefault();
          this.setState({description:event.target.value});
        }
        setSpecialFeature = async (event) => {
          event.preventDefault();
          this.setState({specialFeature:event.target.value});
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
                  1. Mint NFT(NOT Done)(Kitchen)<br></br>
                  2. Gift NFT(DDone)diningtable<br></br>
                  3. Buy NFT(DDone)market<br></br>
                  4. Sell NFT(DDone)dt<br></br>
                  5. Burn NFT(DDone)dt<br></br>
                  6. List all NFT's for sale(NOT DONE)market<br></br>
                  7. List user owned NFT's(NOT Done)dt<br></br>
                  8. Stop sale(DDone)dt<br></br>
                  9. Show NFT details(Not Done)dt<br></br>
                  10. Buy richedu tokens(FDONE)app<br></br>
                  11. Sell richedu tokens(NOT Done)app<br></br>
                  12. Balance of user(FDone)dt<br></br>
                  13. Approve(FDONE)dt <br></br>
                  14. Get Name(FDone) app<br></br>
                  15. Get Symbol(FDone)app <br></br>
                  16. Get Owner(FDone) app<br></br>
                  17. Owner Of TokenId(FDone) market<br></br>
                  18. Get Token by Index(DDone) market<br></br>
                  19. Get Users NFT balance(FDone) dt<br></br>
                  20. Get ERC721 Contract Address(FDone)app  <br></br>
                  21. Get ERC20 Contract Address() app<br></br>
                  FOR ERC20:<br></br>
                  1. Show user's richedu balance<br></br>
                  2. Approve_erc20()app<br></br>
                  3. Transfer<br></br>
                  4. Total supply<br></br>
                </code>
              </div>
            </main>
          </div>
        <hr />
        <Home getName={this.getName} getSymbol={this.getSymbol} getERC20ContractAddress={this.getERC20ContractAddress} getERC721ContractAddress={this.getERC721ContractAddress} getOwner={this.getOwner}></Home>
        <Kitchen mint = {this.mint} approve_erc20 = {this.approve_erc20} erc721Contract = {this.state.erc721Contract}/>
        <DiningTable approve={this.approve} burn={this.burn} gift={this.gift} stopSale={this.stopSale} checkNftBalance={this.checkNftBalance} sellNft={this.sellNft} showNftDetails={this.showNftDetails} ownedNft={this.ownedNft} />
        <Marketplace buy={this.buy} getTokenByIndex={this.getTokenByIndex} ownerOf={this.ownerOf} listNFTsForSale={this.listNFTsForSale}></Marketplace>
        <NftBank buyRichedu = {this.buyRichedu} totalSupplyERC20={this.totalSupplyERC20} sellRichedu = {this.sellRichedu} erc721Contract={this.state.erc721Contract} approve_erc20 = {this.approve_erc20}></NftBank>
          {/* <IpfsFileUpload submit={this.onSubmit}></IpfsFileUpload> */} 
          <div className="table">
            <div className="centerbody">
          <Form onSubmit={this.onSubmit}>
            <label className="heading-2">Name of your coffee</label>
            <input
            value= {this.state.name}
            onChange = {this.setName} />
            <br />
            <label >Description of your coffee</label>
            <input
            value= {this.state.description}
            onChange = {this.setDescription} />
            <div>
              <label className="a2">Special feature of your coffee</label>
              <input className="input-a2"
              value= {this.state.specialFeature}
              onChange = {this.setSpecialFeature} />
            </div>
            <div>
            <label>
                Select coffee image
            </label>
            <input type="file" onChange = {this.captureFile} />
            </div>
            <Button className="B1"
              bsStyle="primary"
              type="submit">
              UPLOAD
            </Button>
          </Form>
          <Table bordered responsive>
            <thead>
              <tr>
                <th className="A">Values</th>
              </tr>
            </thead>

            <tbody>
                <tr>
                <td className="B">NFT image hash</td>
                <td>{this.state.ipfsHashImage}</td>
              </tr>
              <tr>
                <td className="C">Ethereum Contract Address</td>
                <td>default</td>
              </tr>
              <tr>
                <td className="D">NFT metadata hash</td>
                <td>{this.state.ipfsHashMetadata}</td>
              </tr>
              <tr>
                <td className="E">You Can see your image</td>
                <td><a href={ `https://ipfs.infura.io/ipfs/${this.state.ipfsHashImage}` } >here</a></td>
                <td className="F">After Uploading</td>
              </tr>
            </tbody>
          </Table>
        </div>
        </div>
        </div>
        </div>
    );
  }
}

export default App;
