import React, { Component } from 'react';
import { Button, Table, Form } from 'react-bootstrap';
const IPFS = require('ipfs-api');
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

class IPFS extends Component {
  state = {
      ipfsHashImage:null,
      ipfsHashMetadata:null,
      buffer:'',
      buffer2:'',
      term: '',
      transactionHash:'',
      name:'',
    }; 
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
    return (<>
        <div className="centerbody">
          <Form onSubmit={this.props.submit(this.state.buffer, this.state.name, this.state.description, this.state.specialFeature)}>
            <view className="heading-2">Name of your coffee</view>
            <input
            value= {this.state.name}
            onChange = {this.setName} />
            <br />
            <view >Description of your coffee</view>
            <input
            value= {this.state.description}
            onChange = {this.setDescription} />
            <div>
              <view className="a2">Special feature of your coffee</view>
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
        </div>
        <hr/>
        <div className="table">
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
                <td>{this.state.ethAddress}</td>
              </tr>
              <tr>
                <td className="D">NFT metadata hash</td>
                <td>{this.state.ipfsHashMetadata}</td>
              </tr>
              <tr>
                <td className="E">You Can see your image</td>
                <td><a href={ `https://ipfs.infura.io/ipfs/${this.state.ipfsHashMetadata}` } >here</a></td>
                <td className="F">After Uploading</td>
              </tr>
            </tbody>
          </Table>
        </div>
      </>
);
  }
}

export default IPFS;