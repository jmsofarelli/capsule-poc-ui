export function formatJWT(jwt) {
    const { length } = jwt
    return jwt.slice(0, 20) + ' ... ' + jwt.slice(length - 20, length);
}