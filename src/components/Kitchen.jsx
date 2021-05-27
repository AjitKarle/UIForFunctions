import React, {Component} from 'react';

class Kitchen extends Component {
    constructor(props) {
    super(props);
    }
    render() {
        return (
            <div>
                <h3>Mint NFT(mintNFT)</h3>
            <form onSubmit={(event) => {
                    event.preventDefault();
                    const hash = this.imageHash.value;
                    const metadata = this.metadataHash.value;
                    const mintingCost = this.mintingCost.value.toString();
                    const userPays = this.userPays.value.toString();
                    console.log("hash, metadata, mintingcost, userPays", hash, metadata, mintingCost, userPays);
                    console.log("Inside Kitchen and erc721Contract address is: ", this.props.erc721Contract.address);
                    this.props.approve_erc20(this.props.erc721Contract.address, mintingCost);
                    this.props.mint(hash, metadata, mintingCost,userPays); 
            }}>
          <input type='text' className='p-3' placeholder='e.g. _Hash' ref={(input) => { this.imageHash = input }}></input>
          <input type='text' className='p-3' placeholder='e.g. _Metadata' ref={(input) => { this.metadataHash = input }}></input>
          <input type='text' className='p-3' placeholder='e.g. _MintingCost' ref={(input) => { this.mintingCost = input }}></input>
          <input type='text' className='p-3' placeholder='e.g. _UserPays' ref={(input) => { this.userPays = input }}></input>
            <input type='submit' className='btn btn-primary ' value='MINT'></input>
        </form>
          <hr />
            </div>
        )
    }
}

export default Kitchen;