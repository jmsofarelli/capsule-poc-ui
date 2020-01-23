import './LaunchCapsule.css';
import React from 'react';
import Web3 from 'web3';
import uport from "../../config/uport";
import ipfs from '../../config/ipfs';
import bs58 from 'bs58';
import { formatJWT } from "../../util/format";
import { keccak256 } from "js-sha3";
import { abi, address } from '../../config/capsules-registry';
import { NavLink } from 'react-router-dom';

class LaunchCapsule extends React.Component {

  componentDidMount = async () => {
    uport.onResponse('disclosureReq').then(this.handleLogin);
    uport.onResponse('verSigReq').then(this.handleSignature);
    const web3 = this.web3 = new Web3(Web3.givenProvider);
    const network = await web3.eth.net.getNetworkType();
    const registryAddr = address[network];
    this.setState({ network, registryAddr });
    this.capsulesRegistry = new web3.eth.Contract(abi, registryAddr);
  }

  state = {
    authorDid: null,
    authorName: null,
    contentBuffer: null,
    contentTitle: '',
    contentSize: null,
    contentHash: null,
    contentIpfsAddr: null,
    jwtToken: null,
    capsuleIpfsAddr: null,
    capsuleIpfsHashFunc: null,
    capsuleIpfsHashSize: null,
    capsuleIpfsDigest: null,
    network: null,
    registryAddr: null,
    txHash: null,
    txReceipt: null
  };

  handleLogin = (res) => {
    const { did, name } = res.payload;
    this.setState({ 
      authorDid: did, 
      authorName: name 
    });
  }

  renderLogin() {
    uport.requestDisclosure({
      requested: ['name']
    });
    return (
      <div className="App">
        <div style={{ margin: '50px', textAlign: 'center'}}>
          <h3>Please wait while we prepare your login with Uport App ...</h3>
        </div>
      </div>
    );
  }

  captureFile = (evt) => {
    evt.stopPropagation();
    evt.preventDefault();
    const file = evt.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => this.hashFile(file, reader);
  };

  updateTitle = (evt) => {
    this.setState({ contentTitle: evt.target.value });
  }

  hashFile = async (file, reader) => {
    const contentBuffer = reader.result;
    const contentType = file.type;
    const contentSize = file.size;
    const contentHash = '0x' + keccak256(contentBuffer);
    this.setState({ contentBuffer, contentType, contentSize, contentHash});
  };

  uploadFile = async (evt) => {
    evt.preventDefault();
    await ipfs.add(this.state.contentBuffer, (err, ipfsRes) => {
      this.setState({ contentIpfsAddr: ipfsRes[0].hash });
    });
  }

  signContent = () => {
    const sub = this.state.authorDid;
    const unsignedClaim = {
      "Authorship": {
        "Author": this.state.authorName,
        "ContentTitle": this.state.contentTitle,
        "ContenHash": this.state.contentHash,
      }
    }
    uport.requestVerificationSignature(unsignedClaim, sub);
  }

  handleSignature = async (res) => {
    const jwt = res.payload;
    this.setState({ jwtToken: jwt });
  };

  uploadCapsule = async (evt) => {
    const { 
      authorName, 
      authorDid, 
      contentTitle, 
      contentIpfsAddr, 
      contentType, 
      contentHash, 
      contentSize,
      jwtToken
    } = this.state;
    const capsuleObj = { authorName, authorDid, contentTitle, contentIpfsAddr, contentType, contentHash, contentSize, jwtToken };
    const capsuleBuffer = Buffer.from(JSON.stringify(capsuleObj), 'utf8');
    //const ipfsRes = await ipfs.add(capsuleBuffer);
    const ipfsRes = await ipfs.add([ {
      content: capsuleBuffer,
      path: `/capsule/${contentHash}.json`
    }]);
    const capsuleIpfsAddr = ipfsRes[0].hash;
    const decodedHash = bs58.decode(contentIpfsAddr);
    const capsuleIpfsHashFunc = decodedHash[0];
    const capsuleIpfsHashSize = decodedHash[1];
    const capsuleIpfsDigest = "0x" + decodedHash.slice(2).toString('hex');
    this.setState({ capsuleIpfsAddr, capsuleIpfsHashFunc, capsuleIpfsHashSize, capsuleIpfsDigest });
  }

  registerCapsule = async () => {
    await window.ethereum.enable();
    var accounts = await this.web3.eth.getAccounts();
    const { contentHash, capsuleIpfsDigest, capsuleIpfsHashFunc, capsuleIpfsHashSize } = this.state;
    const txRes = await this.capsulesRegistry.methods.registerCapsule(contentHash, capsuleIpfsDigest, capsuleIpfsHashFunc, capsuleIpfsHashSize).send({from: accounts[0]});
    console.log('txRes', txRes);
    const txHash = txRes.transactionHash;
    this.setState({ txHash });
  }
    
  render() {
    if (!this.state.authorDid) {
      return this.renderLogin();
    }
    return (
      <div className="App">
        <div>
          <div className='cap-table'>
            <div className='cap-section'><h3>Author</h3></div>
            <div className='cap-row'>
              <div className='cap-label'>Name</div>
              <div className='cap-field'>{this.state.authorName}</div>
            </div>
            <div className='cap-row'>
              <div className='cap-label'>DID</div>
              <div className='cap-field'>{this.state.authorDid}</div>
            </div>
          </div>

          <div className='cap-table'>
            <div className='cap-section'><h3>Content</h3></div>
            <div className='cap-row'>
              <div className='cap-label'>Title</div>
              <div className='cap-field'><input type="text" value={this.state.contentTitle} onChange={this.updateTitle}/></div>
            </div>
            <div className='cap-row'>
              <div className='cap-label'>File</div>
              <div className='cap-field'><input type="file" onChange={this.captureFile} /></div>
            </div>
            <div className='cap-row'>
              <div className='cap-label'>Type</div>
              <div className='cap-field'>{this.state.contentType}</div>
            </div>
            <div className='cap-row'>
              <div className='cap-label'>Size</div>
              <div className='cap-field'>{this.state.contentSize}</div>
            </div>
            <div className='cap-row'>
              <div className='cap-label'>Hash (keccak256)</div>
              <div className='cap-field'>{this.state.contentHash}</div>
            </div>
            <div className='cap-action'>
              <button className="primary" onClick={this.uploadFile}>Upload to IPFS</button>
            </div>
          </div>

          <div className='cap-table'>
            <div className='cap-section'><h3>File Storage</h3></div>
            <div className='cap-row'>
              <div className='cap-label'>IPFS Address</div>
              <div className='cap-field'><a href={`https://ipfs.infura.io/ipfs/${this.state.contentIpfsAddr}`}>{this.state.contentIpfsAddr}</a></div>
            </div>
          </div>

          <div className='cap-table'>
            <div className='cap-section'><h3>Signature</h3></div>
            <div className='cap-action'>
              <button onClick={this.signContent}>Sign Content</button>
            </div>
            <div className='cap-row'>
              <div className='cap-label'>JWT Token</div>
              <div className='cap-field'>{formatJWT(this.state.jwtToken || "")}</div>
            </div>
          </div>

          <div className='cap-table'>
            <div className='cap-section'><h3>Capsule</h3></div>
            <div className='cap-action'>
            <button onClick={this.uploadCapsule}>Upload Capsule to IPFS</button>
            </div>
            <div className='cap-row'>
              <div className='cap-label'>IPFS Address</div>
              <div className='cap-field'><a href={`https://ipfs.infura.io/ipfs/${this.state.capsuleIpfsAddr}`}>{this.state.capsuleIpfsAddr}</a></div>
            </div>
            <div className='cap-row'>
              <div className='cap-label'>IPFS Hash Function</div>
              <div className='cap-field'>{this.state.capsuleIpfsHashFunc}</div>
            </div>
            <div className='cap-row'>
              <div className='cap-label'>IPFS Hash Size</div>
              <div className='cap-field'>{this.state.capsuleIpfsHashSize}</div>
            </div>
            <div className='cap-row'>
              <div className='cap-label'>IPFS Digest</div>
              <div className='cap-field'>{this.state.capsuleIpfsDigest}</div>
            </div>
            <div className='cap-row'>
              <div className='cap-label'>Render capsule</div>
              <div className='cap-field'><NavLink to={`/render/${this.state.capsuleIpfsAddr}`} exact>Render</NavLink></div>
            </div>
          </div>

          <div className='cap-table'>
            <div className='cap-section'><h3>Registry</h3></div>
            <div className='cap-row'>
              <div className='cap-label'>Ethereum Network:</div>
              <div className='cap-field'>{this.state.network}</div>
            </div>
            <div className='cap-row'>
              <div className='cap-label'>Registry Address:</div>
              <div className='cap-field'>{this.state.registryAddr}</div>
            </div>
            <div className='cap-action'>
            <button onClick={this.registerCapsule}>Register Capsule</button>
            </div>

            <div className='cap-row'>
              <div className='cap-label'>Ethreum Tx:</div>
              <div className='cap-field'>{this.state.txHash}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LaunchCapsule;
