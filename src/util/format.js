import bs58 from 'bs58';

export function formatJWT(jwt) {
    const { length } = jwt;
    if (length === 0) return '';
    return `${jwt.slice(0, 60)} ... ${jwt.slice(length - 10, length)}`;
}

export function formatHash(hash) {
    const { length } = hash;
    return `${hash.slice(0, 15)} ... ${hash.slice(length - 5, length)}`;
}

// Return base58 encoded ipfs hash from bytes32 hex string,
// E.g. "0x017dfd85d4f6cb4dcd715a88101f7b1f06cd1e009b2327a0809d01eb9c91f231"
// --> "QmNSUYVKDSvPUnRLKmuxk9diJ6yS96r1TrAXzjTiBcCLAL"
export function getIpfsHash(hashFunction, hashSize, ipfsDigest) {
    const hashHex = parseInt(hashFunction).toString(16) + parseInt(hashSize).toString(16) + ipfsDigest.slice(2)
    const hashBytes = Buffer.from(hashHex, 'hex');
    const hashStr = bs58.encode(hashBytes)
    return hashStr
}  