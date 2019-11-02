const crypto = require('crypto')

function lockPassword(password) {
    let hash = crypto.createHash('md5')
    return hash.update(password).digest('hex')
}
module.exports = lockPassword