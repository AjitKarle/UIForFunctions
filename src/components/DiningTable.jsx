import React, {Component} from 'react';

class DiningTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ownedNFTs: [],
            userNftBalance: '', 
            NftDetails: '',
        }
    }
    async componentDidMount() {
        //const ownedNFTs = await this.props.ownedNft();
        //this.setState({ ownedNFTs });
    }
    render() {
        return (
            <div>
             <hr />
                <div>
                    <h3>List User's owned NFT's</h3>
                    <div>
                        {this.state.ownedNFTs}
                    </div>
                </div>
                <hr/>
                
          <hr />
          <div>
          <h3>Approve(approve)</h3>
          <form onSubmit={(event) => {
          event.preventDefault()
              const address = this.address.value;
              const tokenId = this.tokenId.value;
              this.props.approve(address, tokenId);
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
          this.props.burn(tokenId)
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
          this.props.gift(receipient, tokenId);
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
          this.props.stopSale(tokenId)
        }}>
            <input type='text' className='p-3' placeholder='_tokenId' ref={(input) =>{this.tokenId = input}}></input>
            <input type='submit' className='btn btn-primary ' value='STOP'></input>
        </form>
        </div>
          <hr />
          <div>
          <h3> Check Balance(Number of owned NFTs)</h3>
          <form onSubmit={async (event) => {
              event.preventDefault()
              const address = this.address.value;
              var userNFTBalance = await this.props.checkNftBalance(address);
              userNFTBalance = userNFTBalance.toString();
              console.log("UserNftBalance is: ", userNFTBalance);
              this.setState({userNFTBalance});
            }}>
            <input type='text' className='p-3' placeholder='_address' ref={(input) => { this.address = input }}></input>
              <input type='submit' className='btn btn-primary ' value='CHECK BALANCE(NFT)'></input>
              <h4>{ this.state.userNftBalance}</h4>
        </form>
            </div>
              <div>
          <h3>Sell NFT(setPricePutOnSale)</h3>
            <form onSubmit={(event) => {
              event.preventDefault();
              const tokenId = this.tokenId.value;
              const userPays = this.userPays.value;
              this.props.sellNft(tokenId, userPays);
            }}>
              <input className='p-3' placeholder='_tokenId' ref={(input) => {this.tokenId = input}}/>
              <input className='p-3' placeholder='_userPays' ref={(input) => {this.userPays = input}}/>
            <input type='submit' className='btn btn-primary ' value='SELL'></input>
          </form>
        </div>
        <hr />
        <div>
          <h3>Show NFT Details</h3>
            <form onSubmit={(event) => {
              event.preventDefault();
              const tokenId = this.tokenId.value;
              const NftDetails = this.props.showNftDetails(tokenId);
              this.setState({NftDetails});
           }}>
            <input className='p-3' placeholder='_tokenId' ref={(input) => {this.tokenId = input}} />
            <input type='submit' className='btn btn-primary ' value='SHOW'></input>
            {this.state.NftDetails}
          </form>
          </div>
          <hr />
          </div>
        )
    }
}

export default DiningTable;