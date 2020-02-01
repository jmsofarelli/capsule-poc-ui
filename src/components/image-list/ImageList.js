import React from 'react';
import { withRouter } from 'react-router';
import web3 from '../../util/web3';
import { licensingAbi, licensingAddrs } from '../../config/image-licensing';
import { registryAbi, registryAddrs } from '../../config/capsules-registry';
import { formatHash, getIpfsHash } from '../../util/format';
import { IPFS_BASE_URL } from '../../config/ipfs';

class ImageList extends React.Component {

    state = {
        images: []
    }

    componentDidMount = async () => {
        const network = await web3.eth.net.getNetworkType();
        const licensingAddr = licensingAddrs[network];
        const registryAddr = registryAddrs[network];
        this.imageLicensing = new web3.eth.Contract(licensingAbi, licensingAddr);
        this.capsulesRegistry = new web3.eth.Contract(registryAbi, registryAddr);
        this.fetchImages();
    }

    fetchImages = async () => {
        var accounts = await web3.eth.getAccounts();
        const result = await this.imageLicensing.methods.getLicensableImages().call({ from: accounts[0] });
        const capsulePromises = [];
        const count = parseInt(result.count);
        for (let i = 0; i < count; i++) {
            const { hashFunction, hashSize, ipfsDigest } = result.images[i];
            const ipfsHash = getIpfsHash(hashFunction, hashSize, ipfsDigest);
            capsulePromises.push(fetch(`${IPFS_BASE_URL}${ipfsHash}`));
        }
        const capsules = await Promise.all(capsulePromises);
        const images = await Promise.all(capsules.map(
            async capuleResponse => capuleResponse.json()
        ));
        this.setState({ images })
    }

    licenseImage = async (contentHash) => {
        await window.ethereum.enable();
        var accounts = await web3.eth.getAccounts();
        console.log("licenseImage: ", contentHash);
        console.log("from account: ", accounts[0])
        const txRes = await this.imageLicensing.methods.requestLicense(contentHash).send({from: accounts[0], value: 100});
        const txHash = txRes.transactionHash;
        console.log("Transaction hash: ", txHash);
    } 
    
    renderImages = () => {
        const { images } = this.state;
        if (images.length > 0) {
            return images.map( image => {
                const { contentHash, contentTitle, authorName } = image;
                return (
                    <div key={contentHash} className="row">
                        <div className="col col-m">{ contentTitle }</div>
                        <div className="col col-b">{ formatHash(contentHash) }</div>
                        <div className="col col-b">{ authorName }</div>
                        <div className="col col-s align-right">
                            <button onClick={() => this.licenseImage(contentHash)}>License</button>
                        </div>
                    </div>
                );
            });
        }
    }

    render = () => {
        return (
            <div className="container">
                <div className="header">Images</div>
                <div className="row-header">
                    <div className="col col-m">Title</div>
                    <div className="col col-b">Hash</div>
                    <div className="col col-b">Author</div>
                    <div className="col col-s"></div>
                </div>
                {this.renderImages()}
            </div>
        );
    }
}

export default withRouter(ImageList);