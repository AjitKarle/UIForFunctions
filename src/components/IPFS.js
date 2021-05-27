import React, { Component } from 'react';
const IPFS = require('ipfs-api');
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

class IpfsFileUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buffer: '',
            ipfsHash: ''
        }
         this.captureFile = this.captureFile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    }
    captureFile(event) {
        console.log("Capture file...");
        event.preventDefault();
        const file = event.target.files[0];
        const reader = new window.FileReader();
        reader.readAsArrayBuffer(file);
        reader.onloaded = () => {
            this.setState({ buffer: Buffer(reader.result) })
            console.log('buffer', this.state.buffer);
        }
    }
    onSubmit(event) {
    event.preventDefault()
    ipfs.files.add(this.state.buffer, (error, result) => {
      if(error) {
        console.error(error)
        return
      }
      this.simpleStorageInstance.set(result[0].hash, { from: this.state.account }).then((r) => {
        return this.setState({ ipfsHash: result[0].hash })
        console.log('ifpsHash', this.state.ipfsHash)
      })
    })
  }
    render() {
        return (
            <div>
                <h2>Upload Image</h2>
                <form onSubmit={this.onSubmit}>
                    <input type='file' onChange={this.catureFile}></input>
                    <input type='submit'></input>
                </form>
                <h2>Uploaded Image</h2>
                <img src={`https://ipfs.io/ipfs/${this.state.ipfsHash}`} alt=""/>
            </div>
        )
    }
} 

export default IpfsFileUpload;
