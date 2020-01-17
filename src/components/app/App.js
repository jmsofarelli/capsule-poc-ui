import './App.css';
import React from 'react';
import  { Connect } from 'uport-connect';
import didJWT from 'did-jwt';
import Web3 from 'web3';
import ipfs from '../../config/ipfs';
import bs58 from 'bs58';
import capsulesRegistry from '../../config/capsules-registry';

class App extends React.Component {

  constructor() {
    super();
    const uport = this.uport = new Connect('Capsule App');
    uport.onResponse('disclosureReq').then(this.handleLogin);
    uport.onResponse('verSigReq').then(this.handleSignature);
    this.web3 = new Web3(Web3.givenProvider);
  }

  state = {
    did: null,
    name: null,
    buffer: null,
    title: '',
    fileSize: null,
    fileHash: null,
    ipfsHash: null,
    jwt: null,
    capIpfsHash: null,
    capIpfsHashFunc: null,
    capIpfsHashSize: null,
    capIpfsDigest: null,
    ethAddress: null,
    transactionHash: null,
    txReceipt: null
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

  updateTitle = (evt) => {
    this.setState({ title: evt.target.value });
  }

  convertToBuffer = (file, reader) => {
    const fileType = file.type;
    const fileSize = file.size;
    const buffer = Buffer.from(reader.result);
    const fileHash = this.web3.utils.sha3(buffer.toString());
    this.setState({buffer, fileType, fileSize, fileHash});
  };

  uploadFile = async (evt) => {
    evt.preventDefault();
    await ipfs.add(this.state.buffer, (err, ipfsHash) => {
      debugger;
      console.log('err: ', err);
      console.log('ipfsHash: ', ipfsHash);
      console.log('bs58 -  decode ', bs58.decode(ipfsHash[0].hash));
      this.setState({ ipfsHash: ipfsHash[0].hash });
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
    this.setState({ jwt });
    const decodedJWT = didJWT.decodeJWT(jwt);
    const verifiedJWT = await didJWT.verifyJWT(jwt);
    console.log('decodedJWT', decodedJWT);
    console.log('verifiedJWT', verifiedJWT);
  };

  uploadCapsule = async (evt) => {
    const capsuleObj = {
      author_name: this.state.name,
      author_did: this.state.did,
      content_title: this.state.title,
      content_ipfs: this.state.ipfsHash,
      content_type: this.state.fileType,
      file_hash: this.state.fileHash,
      file_size: this.state.fileSize,
      jwt: this.state.jwt
    };
    console.log("Capsule: ", capsuleObj);
    const capsuleStr = JSON.stringify(capsuleObj);
    const capsuleBuffer = Buffer.from(capsuleStr, 'utf8');
    const results = await ipfs.add(capsuleBuffer);
    const capIpfsHash = results[0].hash;
    const decodedHash = bs58.decode(capIpfsHash);
    const capIpfsHashFunc = decodedHash[0];
    const capIpfsHashSize = decodedHash[1];
    const capIpfsDigest = "0x" + decodedHash.slice(2).toString('hex');
    this.setState({ capIpfsHash, capIpfsHashFunc, capIpfsHashSize, capIpfsDigest });
  }

  registerCapsule = async () => {
    const { fileHash, capIpfsDigest, capIpfsHashFunc, capIpfsHashSize } = this.state
    capsulesRegistry.registerCapsule(fileHash, capIpfsDigest, capIpfsHashFunc ,capIpfsHashSize );
  }
    
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
        <hr/>
        <div>
          <form onSubmit={this.onSubmit}>
            Title: <input type="text" value={this.state.title} onChange={this.updateTitle}/><br/>
            <input type="file" onChange={this.captureFile} /><br/>
            File type: {this.state.fileType}<br/>
            File size: {this.state.fileSize}<br/>
            File hash: {this.state.fileHash}<br/>
            <button className="primary" onClick={this.uploadFile}>Upload</button><br/>
            IPFS hash: {this.state.ipfsHash}<br/>
            File link: <a href={`https://ipfs.infura.io/ipfs/${this.state.ipfsHash}`}>{`https://ipfs.infura.io/ipfs/${this.state.ipfsHash}`}</a>
          </form>
          <hr/>
          <button onClick={this.signContent}>Sign Content</button><br/>
          JWT Token: {this.state.jwt}<br/>
          <button onClick={this.uploadCapsule}>Upload Capsule</button><br/>
          Capsule IPFS hash: {this.state.capIpfsHash}<br/>
          Capsule IPFS hash function: {this.state.capIpfsHashFunc}<br/>
          Capsule IPFS hash size: {this.state.capIpfsHashSize}<br/>
          Capsule IPFS digest: {this.state.capIpfsDigest}<br/>
          Capsule link: <a href={`https://ipfs.infura.io/ipfs/${this.state.capIpfsHash}`}>{`https://ipfs.infura.io/ipfs/${this.state.capIpfsHash}`}</a>
          <hr/>
          <button onClick={this.onClick}>Register Capsule</button>
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
