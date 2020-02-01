const ipfsClient = require('ipfs-http-client');
const HOST = 'ipfs.infura.io';
const PORT = 5001;
const PROTOCOL = 'https';

export const IPFS_BASE_URL = `${PROTOCOL}://${HOST}/ipfs/`;

const ipfs = ipfsClient({ host: HOST, port: PORT, protocol: PROTOCOL });
export default ipfs;
