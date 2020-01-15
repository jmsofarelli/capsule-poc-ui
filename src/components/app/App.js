import './App.css';
import React from 'react';
import  { Connect } from 'uport-connect';
import didJWT from 'did-jwt';
import Web3 from 'web3';
import ipfs from '../../config/ipfs';

class App extends React.Component {

  constructor() {
    super();
    const uport = this.uport = new Connect('Capsule App');
    uport.onResponse('disclosureReq').then(this.handleLogin);
    uport.onResponse('verSigReq').then(this.handleSignature);
    this.web3 = new Web3(Web3.givenProvider);
  }

  state = {
    loginRequested: false,
    did: null,
    name: null,
    fileName: null,
    fileSize: null,
    fileHash: null,
    ipfsHash: null,
    buffer:'',
    signedClaim: null,
    ethAddress:'',
    transactionHash:'',
    txReceipt: ''
  };

  handleLogin = (res) => {
    const { did, name } = res.payload;
    this.setState({ did, name });
  }

  renderLogin() {
    this.uport.requestDisclosure({
      requested: ['name']
    });
    return (
      <div className="App-header">
        <h1>Welcome to Capsule Project</h1>
        <h2>Please wait while we prepare your login with uPort App</h2>
      </div>
    );
  }

  captureFile = (evt) => {
    evt.stopPropagation();
    evt.preventDefault();
    const file = evt.target.files[0];
    let reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => this.convertToBuffer(file, reader);
  };

  convertToBuffer = (file, reader) => {
    const fileName = file.name;
    const fileSize = file.size;
    const buffer = Buffer.from(reader.result);
    const fileHash = this.web3.utils.sha3(buffer.toString());
    this.setState({buffer, fileName, fileSize, fileHash});
  };

  uploadFile = async (evt) => {
    evt.preventDefault();
    await ipfs.add(this.state.buffer, (err, ipfsHash) => {
      console.log('err: ', err);
      console.log('ipfsHash: ', ipfsHash);
      this.setState({ ipfsHash:ipfsHash[0].hash });
    }); 
  }

  signContent = () => {
    const sub = this.state.did;
    const unsignedClaim = {
      "Authorship": {
        "Author": this.state.name,
        "ContenHash": this.state.fileHash,
      }
    }
    this.uport.requestVerificationSignature(unsignedClaim, sub);
  }

  handleSignature = async (res) => {
    const jwt = res.payload;
    const decodedJWT = didJWT.decodeJWT(jwt);
    const verifiedJWT = await didJWT.verifyJWT(jwt);
    console.log('decodedJWT', decodedJWT);
    console.log('verifiedJWT', verifiedJWT);
  };
    
  render() {
    if (!this.state.did) {
      return this.renderLogin();
    }
    return (
      <div className="App">
        <header className="App-header">
            <h1>Capsule Project - Content Signing</h1>
        </header>
        <hr/>
        <div>
          <p>Name: {this.state.name}</p>
          <p>DID: {this.state.did}</p>
        </div>
        <div>
          <h3>Choose file to send to IPFS</h3>
          <form onSubmit={this.onSubmit}>
            <input type="file" onChange={this.captureFile} />
            <button className="primary" onClick={this.uploadFile}>Send it</button>
          </form>
          <p>File name: {this.state.fileName}</p>
          <p>File size: {this.state.fileSize}</p>
          <p>File hash: {this.state.fileHash}</p>
          <hr/>
          <button onClick={this.signContent}>Sign Content</button>
          <hr/>
          <button onClick={this.onClick}>Get Transaction Receipt</button>
          <hr/>
          <table>
            <thead>
              <tr>
                <th>Tx Receipt Category</th>
                <th></th>
                <th>Values</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>IPFS Hash stored on Ethereum</td>
                <td> : </td>
                <td>{this.state.ipfsHash}</td>
              </tr>
              <tr>
                <td>Ethereum Contract Address</td>
                <td> : </td>
                <td>{this.state.ethAddress}</td>
              </tr>
              <tr>
                <td>Tx # </td>
                <td> : </td>
                <td>{this.state.transactionHash}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default App;
