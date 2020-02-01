import '../app/App.css';
import React from 'react';
import { withRouter } from 'react-router';
import didJWT from 'did-jwt';
import { formatJWT } from "../../util/format";
import { keccak256 } from "js-sha3";

class RenderCapsule extends React.Component {

    state = {
        capsuleIpfsAddr: null,
        authorName: null,
        authorNameStatus: null,
        authorDid: null,
        authorDidStatus: null,
        contentTitle: null,
        contentIpfsAddr: null,
        contentType: null,
        contentHash: null,
        contentHashCalculated: null,
        contentHashStatus: null,
        contentSize: null,
        jwtToken: null,
        jwtTokenStatus: null 
    }
    
    componentDidMount = async () => {
        const { ipfsAddr } = this.props.match.params;
        const response = await fetch(`https://ipfs.infura.io/ipfs/${ipfsAddr}`);
        const data = await response.json();
        const { 
            authorName, 
            authorDid, 
            contentTitle, 
            contentIpfsAddr, 
            contentType, 
            contentHash, 
            contentSize, 
            jwtToken  
        } = data;
        this.setState({
            capsuleIpfsAddr: ipfsAddr,
            authorName,
            authorDid,
            contentTitle,
            contentIpfsAddr,
            contentType,
            contentHash,
            contentSize,
            jwtToken
        });
        this.checkContentSignature();
    }

    calculateContentHash = async () => {
        const { contentIpfsAddr } = this.state;
        const response = await fetch(`https://ipfs.infura.io/ipfs/${contentIpfsAddr}`);
        const contentBuffer = await response.arrayBuffer();
        const contentHashCalculated = '0x' + keccak256(contentBuffer);
        this.setState({ contentHashCalculated });
    }

    checkContentSignature = async () => {
        this.calculateContentHash();
        const jwt = this.state.jwtToken;
        const verifiedJWT = await didJWT.verifyJWT(jwt);
        const { authorName, authorDid, contentHash, contentHashCalculated } = this.state;
        const sigAuthorName = verifiedJWT.payload.claim.Authorship.Author;
        const sigAuthorDid = verifiedJWT.signer.owner;
        const sigContentHash = verifiedJWT.payload.claim.Authorship.ContenHash;
        const contentHashStatus = (contentHash === contentHashCalculated) && (contentHash === sigContentHash);
        const authorNameStatus = authorName === sigAuthorName;
        const authorDidStatus = authorDid === sigAuthorDid;
        const jwtTokenStatus = authorNameStatus && authorDidStatus && contentHashStatus;
        this.setState({
            authorNameStatus,
            authorDidStatus,
            contentHashStatus,
            jwtTokenStatus
        })
    }

    renderStatus = (status) => {
        if (status == null) {
            return <span style={{color: "blue"}}>Not checked</span>;
        }
        if (status === true) {
            return <span style={{color: "green"}}>Verified</span>;
        } else {
            return <span style={{color: "red"}}>Invalid</span>;
        }
    }
    
    render =  () => {
        //const { ipfsAddr } = this.props.match.params;
        return (
            <div>
                <div className='table'>
                    <div className='section' style={{ textAlign: 'center'}}>
                        <h2>{this.state.contentTitle}</h2>
                    </div>
                </div>
                <div className='table'>
                    <div className='row'>
                        <div className='label'>Author name</div>
                        <div className='field'>{this.state.authorName} ({this.renderStatus(this.state.authorNameStatus)})</div>
                    </div>
                    <div className='row'>
                        <div className='label'>Author DID</div>
                        <div className='field'>{this.state.authorDid} ({this.renderStatus(this.state.authorDidStatus)})</div>
                    </div>
                    <div className='row'>
                        <div className='label'>Content Hash</div>
                        <div className='field'>{this.state.contentHash} ({this.renderStatus(this.state.contentHashStatus)})</div>
                    </div>
                    <div className='row'>
                        <div className='label'>Signature</div>
                        <div className='field'>{formatJWT(this.state.jwtToken || '')} ({this.renderStatus(this.state.jwtTokenStatus)})</div>
                    </div>
                </div>
                <div style={{ textAlign: 'center'}}>
                    <img alt="content" src={`https://ipfs.infura.io/ipfs/${this.state.contentIpfsAddr}`} />
                </div>
            </div>
        );
    }
}

export default withRouter(RenderCapsule);
