import React, {Component} from 'react';

class MarketPlace extends Component {
    constructor(props) {
        super(props);
        this.state = {
            NFTsForSale: [],
            ownerOfToken: '', 
            tokenId: '',
        }
    }
    async componentDidMount() {
        //const NFTsForSale = await this.props.listNFTsForSale();
        //this.setState({ NFTsForSale });
    }
    render() {
        return (
            <div>
                <div>
                    <h3>NFTs For Sale</h3>
                    <div>
                        {this.state.NFTsForSale}
                    </div>
                </div>
                <div>
            <h3>Buy NFT(buyAtSale)</h3>
                <form onSubmit={(event) => {
                event.preventDefault();
                const tokenId = this.tokenId.value;
                const userPays = this.userPays.value;
                this.props.buy(tokenId, userPays);
                }}>
              <input className='p-3' placeholder='_tokenId' ref={ (input) => {this.tokenId = input}}/>
              <input className='p-3' placeholder='_userPays' ref={(input) =>{this.userPays = input}}/>
            <input type='submit' className='btn btn-primary ' value='BUY'></input>
        </form>
        </div>
        <hr />
            <div>
          <h3>Owner of TokenID</h3>
            <form onSubmit={(event) => {
              event.preventDefault();
              const tokenId = this.tokenId.value;
              const ownerOfToken = this.props.ownerOf(tokenId);
              this.setState({ownerOfToken});
            }}>
          <input className='p-3' placeholder='_tokenId' ref={ (input) =>{this.tokenId = input }}/>
              <input type='submit' className='btn btn-primary ' value='GET OWNER OF TOKEN'></input>
              <h4>{ this.state.ownerOfToken }</h4>
          </form>
          </div>
          <hr />
          <div>
          <h3>Get Token by Index</h3>
            <form onSubmit={(event) => {
              event.preventDefault();
              const index = this.index.value;
              const tokenId = this.props.getTokenByIndex(index);
              this.setState({tokenId});
            }}>
          <input className='p-3' placeholder='_index' ref={ (input) =>{this.index = input }}/>
              <input type='submit' className='btn btn-primary ' value='GET TOKEN BY INDEX'></input>
              <h4>{ this.state.tokenId}</h4>
          </form>
          </div>
            <hr />
            </div>
        )
    }
}
export default MarketPlace;