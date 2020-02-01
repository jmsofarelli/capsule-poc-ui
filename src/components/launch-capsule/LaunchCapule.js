import './LaunchCapsule.css';
import React from 'react';
import { Route } from 'react-router-dom';
import web3 from '../../util/web3';
import uport from "../../config/uport";
import ipfs from '../../config/ipfs';
import bs58 from 'bs58';
import { formatJWT } from "../../util/format";
import { keccak256 } from "js-sha3";
import { registryAbi, registryAddrs } from '../../config/capsules-registry';
import { FaUpload } from 'react-icons/fa';
import { BallPulse } from 'react-pure-loaders';

class LaunchCapsule extends React.Component {

  componentDidMount = async () => {
    uport.onResponse('disclosureReq').then(this.handleLogin);
    uport.onResponse('verSigReq').then(this.handleSignature);
    const network = await web3.eth.net.getNetworkType();
    const registryAddr = registryAddrs[network];
    const state = { network, registryAddr };
    if (uport.did) {
      state.authorDid = uport.did;
      state.authorName = uport.state.name;
    }
    this.setState(state);
    this.capsulesRegistry = new web3.eth.Contract(registryAbi, registryAddr);
  }

  state = {
    authorDid: '',
    authorName: '',
    contentBuffer: undefined,
    contentTitle: '',
    contentType: '',
    contentSize: undefined,
    contentHash: '',
    contentRegistered: false,
    contentIpfsAddr: '',
    uploadingFile: false,
    preparingSignature: false,
    jwtToken: '',
    capsuleIpfsAddr: '',
    capsuleIpfsHashFunc: undefined,
    capsuleIpfsHashSize: undefined,
    capsuleIpfsDigest: '',
    network: '',
    registryAddr: '',
    txHash: '',
    txReceipt: ''
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

  logout = () => {
    uport.logout();
    this.setState({
      authorDid: null,
      authorName: null,
    })
  }

  updateTitle = (evt) => {
    this.setState({ 
      contentTitle: evt.target.value,
      jwtToken: '',
      capsuleIpfsAddr: '',
      capsuleIpfsHashFunc: undefined,
      capsuleIpfsHashSize: undefined,
      capsuleIpfsDigest: '',
      txHash: '',
      txReceipt: ''
    });
  }

  captureFile = (evt) => {
    evt.stopPropagation();
    evt.preventDefault();
    const file = evt.target.files[0];
    if (file) {
      const reader = new window.FileReader();
      reader.readAsArrayBuffer(file);
      reader.onloadend = () => this.hashFile(file, reader);
    } else {
      if (!this.state.contentBuffer) {
        this.setState({ 
          filename: '',
          contentBuffer: undefined, 
          contentType: '', 
          contentSize: '', 
          contentHash: '',
          contentIpfsAddr: '',
          jwtToken: '',
          capsuleIpfsAddr: '',
          capsuleIpfsHashFunc: undefined,
          capsuleIpfsHashSize: undefined,
          capsuleIpfsDigest: '',
          txHash: '',
          txReceipt: ''
        });
      }
    }
  };

  hashFile = async (file, reader) => {
    const filename = file.name;
    const contentBuffer = reader.result;
    const contentType = file.type;
    const contentSize = file.size;
    const contentHash = '0x' + keccak256(contentBuffer);
    if (contentHash !== this.state.contentHash) {
      this.setState({ 
        filename, 
        contentBuffer, 
        contentType, 
        contentSize, 
        contentHash, 
        contentIpfsAddr: '', 
        contentRegistered: false,
        jwtToken: '',
        capsuleIpfsAddr: '',
        capsuleIpfsHashFunc: undefined,
        capsuleIpfsHashSize: undefined,
        capsuleIpfsDigest: '',
        txHash: '',
        txReceipt: ''
      });
      this.checkContentRegistered();
    }
  };

  checkContentRegistered = () => {
    console.log('contentHash', this.state.contentHash);
    this.capsulesRegistry.methods.capsuleIDsByHash(this.state.contentHash).call().then(index => {
      console.log('index', index);
      if (parseInt(index) !== 0) {
          this.setState({ contentRegistered: true });
      }
    });
  }

  renderContentRegistered = () => {
    const { contentRegistered, network } = this.state;
    if (contentRegistered) {
      return (
        <div className='row'>
          <div className='label'></div>
          <div className='field'><span style={{ color: 'red' }}>There is already a Capsule registered with this content hash in the {network} network!</span></div>
        </div>
      );
    } else {
      return null;
    }
     
  }

  renderUploadFileButton = () => {
    if (this.state.uploadingFile) {
      return (<BallPulse loading color="black"/>);
    } else {
      return (<button disabled={!this.canUploadFile()} onClick={this.uploadFile}>Upload to IPFS</button>);
    }
  }

  canUploadFile = () => {
    return this.state.contentBuffer && ! this.state.contentIpfsAddr;
  }

  uploadFile = async (evt) => {
    evt.preventDefault();
    this.setState({ uploadingFile: true });
    await ipfs.add(this.state.contentBuffer, (err, ipfsRes) => {
      this.setState({ 
        contentIpfsAddr: ipfsRes[0].hash,
        uploadingFile: false
      });
    });
  }

  renderSignContentButton = () => {
    if (this.state.preparingSignature) {
      return (<BallPulse color="black" loading />);
    } else {
      return (<button disabled={!this.canSign()} onClick={this.signContent}>Sign Content</button>);
    }
  }

  canSign = () => {
    const { jwtToken, authorDid, authorName, contentTitle, contentHash } = this.state;
    return !jwtToken && authorDid && authorName && contentTitle && contentHash;
  }

  signContent = () => {
    
    this.setState({ preparingSignature: true });
    const sub = this.state.authorDid;
    const unsignedClaim = {
      "Authorship": {
        "Author": this.state.authorName,
        "ContentTitle": this.state.contentTitle,
        "ContenHash": this.state.contentHash,
      }
    }
    uport.requestVerificationSignature(unsignedClaim, { sub });
    
    /*
    this.setState({ jwtToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NkstUiJ9.eyJpYXQiOjE1Nzk0MzY5MzYsInN1YiI6ImRpZDpldGhyOjB4MDM4NGZhY2I3Njc3N2ExYzBhYTkyOTMzYmU1ZWUwMmIxNDQxMDYwNyIsImNsYWltIjp7IkF1dGhvcnNoaXAiOnsiQXV0aG9yIjoiSmVmZmVyc29uIFNvZmFyZWxsaSIsIkNvbnRlbkhhc2giOiIweDZjYjgyNmIwOTI5NTk3NzhmNGEyYTA1MDgwNmNiY2I5YTljNjMyOGRmZjFkODQ5NTc3ZDFiYzU3N2VhMzUyYTQifX0sImlzcyI6ImRpZDpldGhyOjB4MDM4NGZhY2I3Njc3N2ExYzBhYTkyOTMzYmU1ZWUwMmIxNDQxMDYwNyJ9.u2kHFu1090hzeJMfCkCE3ybQLuvqHENevJfy79mc054tugWn00PqJDLEnpOgwNjXrSPkRkGNCz5VuuKagOHjDAA' });
    */
  }

  handleSignature = async (res) => {
    const jwt = res.payload;
    this.setState({
      preparingSignature: false, 
      jwtToken: jwt 
    });
    uport.onResponse('verSigReq').then(this.handleSignature);
  };

  renderUploadCapsuleButton = () => {
    if (this.state.uploadingCapsule) {
      return (<BallPulse color="black" loading />);
    } else {
      return (<button disabled={!this.canUploadCapsule()} onClick={this.uploadCapsule}>Upload Capsule to IPFS</button>);
    }
  }

  canUploadCapsule = () => {
    const { capsuleIpfsAddr, authorName, authorDid, contentTitle, contentIpfsAddr, contentType, contentHash, contentSize, jwtToken } = this.state;
    return !capsuleIpfsAddr && authorName && authorDid && contentTitle && contentIpfsAddr && contentType && contentHash && contentSize && jwtToken;
  }

  uploadCapsule = async (evt) => {
    this.setState({ uploadingCapsule: true });
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
    const ipfsRes = await ipfs.add([ {
      content: capsuleBuffer,
      path: `/capsule/${contentHash}.json`
    }]);
    const uploadingCapsule = false;
    const capsuleIpfsAddr = ipfsRes[0].hash;
    const decodedHash = bs58.decode(capsuleIpfsAddr);
    const capsuleIpfsHashFunc = decodedHash[0];
    const capsuleIpfsHashSize = decodedHash[1];
    const capsuleIpfsDigest = "0x" + decodedHash.slice(2).toString('hex');
    this.setState({ uploadingCapsule, capsuleIpfsAddr, capsuleIpfsHashFunc, capsuleIpfsHashSize, capsuleIpfsDigest });
  }

  renderRegistryAddress = () => {
    const { network, registryAddr } = this.state;
    if (!registryAddr) {
      return <span style={{color: 'red'}}>There is no Capsules Registry in the {network} network</span>
    } else {
      const prefix = network !== 'main' ? `${network}.` : '';
      const url = `https://${prefix}etherscan.io/address/${registryAddr}`;
      return (<a rel="noopener noreferrer" target="_blank" href={url}>{registryAddr}</a>);
    }
  }

  canRegisterCapsule = () => {
    const { txHash, contentRegistered, contentHash, capsuleIpfsDigest, capsuleIpfsHashFunc, capsuleIpfsHashSize } = this.state;
    return !txHash && !contentRegistered && contentHash && capsuleIpfsDigest && capsuleIpfsHashFunc && capsuleIpfsHashSize; 
  }

  registerCapsule = async () => {
    await window.ethereum.enable();
    var accounts = await web3.eth.getAccounts();
    const { contentHash, capsuleIpfsDigest, capsuleIpfsHashFunc, capsuleIpfsHashSize } = this.state;
    const txRes = await this.capsulesRegistry.methods.registerCapsule(contentHash, capsuleIpfsDigest, capsuleIpfsHashFunc, capsuleIpfsHashSize).send({from: accounts[0]});
    const txHash = txRes.transactionHash;
    this.setState({ txHash });
    this.fetchTxReceipt(txHash);
  }

  fetchTxReceipt = (txHash) => {
    web3.eth.getTransactionReceipt(txHash, (err, txReceipt) => {
      console.log(err, txReceipt);
    });
  }
    
  render() {
    if (!uport.did) {
      return this.renderLogin();
    }
    return (
      <div className="body">
        <div>
          
          <div className='table'>
            <div className='section'><h2>Author</h2></div>
            <div className='row'>
              <div className='label'>Name</div>
              <div className='field'><span className="value">{this.state.authorName}</span></div>
            </div>
            <div className='row'>
              <div className='label'>DID</div>
              <div className='field'><span className="value">{this.state.authorDid}</span></div>
            </div>
            <div className='row'>
              <div className='label'></div>
              <div className='field'><button onClick={this.logout}>Logout</button></div>
            </div>
          </div>

          <div className='table'>
            <div className='section'><h2>Content</h2></div>
            <div className='row'>
              <div className='label'>Title</div>
              <div className='field'><input type="text" value={this.state.contentTitle} onChange={this.updateTitle} /></div>
            </div>
            <div className='row'>
              <div className='label'>File</div>
              <div className='field'>
                <input type="file" name="file" id="file" className="inputfile" onChange={this.captureFile}/>
                <label htmlFor="file">
                  <FaUpload />
                  <span style={{ display: 'inline-block', marginLeft: '20px', paddingBottom: "3px"}}>{ this.state.filename || 'Choose an image file'}</span>
                </label>
              </div>
            </div>
            <div className='row'>
              <div className='label'>Type</div>
              <div className='field'><span className="value">{this.state.contentType}</span></div>
            </div>
            <div className='row'>
              <div className='label'>Size</div>
              <div className='field'><span className="value">{this.state.contentSize}</span></div>
            </div>
            <div className='row'>
              <div className='label'>Hash (keccak256)</div>
              <div className='field'><span className="value">{this.state.contentHash}</span></div>
            </div>
            {this.renderContentRegistered()}
            <div className='row'>
              <div className='label'></div>
              <div className='field'>
                {this.renderUploadFileButton()}
              </div>
            </div>
            <div className='row'>
              <div className='label'>IPFS Address</div>
              <div className='field'><a rel="noopener noreferrer" target="_blank" href={`https://ipfs.infura.io/ipfs/${this.state.contentIpfsAddr}`}>{this.state.contentIpfsAddr}</a></div>
            </div>
          </div>
          
          <div className='table'>
            <div className='row'>
              <div className='label'><h2>Signature</h2></div>
              <div className='field'>
                {this.renderSignContentButton()}
              </div>
            </div>
            <div className='row'>
              <div className='label'>JWT Token</div>
              <div className='field'><span className="value">{formatJWT(this.state.jwtToken || "")}</span></div>
            </div>
          </div>
          
          <div className='table'>
            <div className='row'>
              <div className='label'><h2>Capsule</h2></div>
              <div className='field' style={{display: 'flex', justifyContent: 'center'}}>
                {this.renderUploadCapsuleButton()}
              </div>
            </div>
            <div className='row'>
              <div className='label'>IPFS Address</div>
              <div className='field'><a rel="noopener noreferrer" target="_blank" href={`https://ipfs.infura.io/ipfs/${this.state.capsuleIpfsAddr}`}>{this.state.capsuleIpfsAddr}</a></div>
            </div>
            <div className='row'>
              <div className='label'>IPFS Hash Function</div>
              <div className='field'><span className="value">{this.state.capsuleIpfsHashFunc}</span></div>
            </div>
            <div className='row'>
              <div className='label'>IPFS Hash Size</div>
              <div className='field'><span className="value">{this.state.capsuleIpfsHashSize}</span></div>
            </div>
            <div className='row'>
              <div className='label'>IPFS Digest</div>
              <div className='field'><span className="value">{this.state.capsuleIpfsDigest}</span></div>
            </div>
            <div className='row'>
              <div className='label'></div>
              <div className='field'>
                <Route render={({ history }) => (
                  <button disabled={!this.state.capsuleIpfsAddr} type='button' onClick={() => { history.push(`/render/${this.state.capsuleIpfsAddr}`) }}>Render Capsule</button>
                )}/>
              </div>
            </div>
          </div>
          
          <div className='table'>
            <div className='section'><h2>Registry</h2></div>
            <div className='row'>
              <div className='label'>Ethereum Network</div>
              <div className='field'><span className="value">{this.state.network}</span></div>
            </div>
            <div className='row'>
              <div className='label'>Registry Address</div>
              <div className='field'>{this.renderRegistryAddress()}</div>
            </div>
            {this.renderContentRegistered()}
            <div className='row'>
              <div className='label'></div>
              <div className='field'><button disabled={!this.canRegisterCapsule()} onClick={this.registerCapsule}>Register Capsule</button></div>
            </div>
            <div className='row'>
              <div className='label'>Ethreum Tx:</div>
              <div className='field'><span className="value">{this.state.txHash}</span></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LaunchCapsule;
