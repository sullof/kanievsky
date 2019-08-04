const {sha3, toBase64} = require('./utils')
const crypto = require('crypto')

class Auth {

  constructor(db) {
    this.db = db
  }

  good(user) {
    return /^[a-z]{1}[0-9a-z_]{3,15}$/.test(user)
  }

  async exist(user) {
    let yes = false
    let key = 'user:' + user.toLowerCase()
    try {
      yes = await this.db.get(key) ? true : false
    } catch (err) {
    }
    return yes
  }

  async login(user, pwd) {
    if (this.good(user)) {
      let key = 'user:' + user
      pwd = sha3(pwd)
      try {
        if (pwd === await this.db.get(key)) {
          return 0
        }
      } catch (err) {
      }
      return 1
    } else {
      return 2
    }
  }

  async signup(user, pwd) {
    if (this.good(user)) {
      let key = 'user:' + user
      pwd = sha3(pwd)
      try {
        await this.db.put(key, pwd)
        return 0
      } catch (err) {
        return 1
      }
    } else {
      return 2
    }
  }

  async getToken(user) {
    let key = 'token:' + user
    let now = Date.now()
    let token
    try {
      token = (await this.db.get(key)).split(':')
      let ts = parseInt(token[2])
      if (ts > now) {
        await this.db.del(key)
        token = null
      }
    } catch (err) {
    }
    return token
  }

  async checkToken(token) {
    return (token === await this.getToken(token.split(':')[0]))
  }

  async newToken(user) {
    let key = 'token:' + user.toLowerCase()
    let token = [
      toBase64(user).replace(/=/g, '&'),
      crypto.randomBytes(8).toString('base64').substring(0, 4),
      (Date.now() + 1000 * 3600 * 24 * 10)
    ].join('$')
    token += '$' + sha3(token).substring(0,1)
    try {
      await this.db.put(key, token)
      return token
    } catch (err) {
      return false
    }
  }
}

module.exports = Auth

