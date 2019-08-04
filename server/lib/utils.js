const {Keccak} = require('sha3')

module.exports = {

  sha3: val => {
    const hash = new Keccak(256)
    hash.update(val)
    return hash.digest('hex')
  },

  toHex: (utf8String) => {
    let buf = Buffer.from(utf8String)
    return buf.toString('hex')
  },

  toBase64: (utf8String) => {
    let buf = Buffer.from(utf8String)
    return buf.toString('base64')
  },

  fromHex: (hexString) => {
    let buf = Buffer.from(hexString, 'hex')
    return buf.toString('utf8')
  },

  fromBase64: (hexString) => {
    let buf = Buffer.from(hexString, 'base64')
    return buf.toString('utf8')
  }

}
