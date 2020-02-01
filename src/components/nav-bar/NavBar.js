import "./NavBar.css";
import React from 'react';
import { withRouter } from 'react-router';
import { Link } from "react-router-dom";
import web3 from '../../util/web3';
import { abi, address } from '../../config/image-licensing';
import { abi as capsulesAbi, address as capsulesAddress } from '../../config/capsules-registry';
import { formatHash, getIpfsHash } from '../../util/format';
import { IPFS_BASE_URL } from '../../config/ipfs';

class NavBar extends React.Component {

    render = () => {
        return (
            <div className="nav-bar">
                <div className="nav-item"><Link to="/">Home</Link></div>
                <div className="nav-item"><Link to="/launch">Launch</Link></div>
                <div className="nav-item"><Link to="/images">Images</Link></div>
                <div className="nav-item"><Link to="/licenses">Licensing</Link></div>
            </div>
        );
    }
}

export default withRouter(NavBar);