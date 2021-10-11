const {sha3, toBase64} = require('./utils')
const crypto = require('crypto')
const jsondb = require('./jsondb')

class Auth {

  constructor(db) {
    this.db = db
  }

  good(user) {
    return /^[a-z]{1}[0-9a-z_]{3,15}$/.test(user)
  }

  async exist(user) {
    let yes = false
    let users = jsondb.get('users')
    try {
      yes = !!users[user.toLowerCase()]
    } catch (err) {
    }
    return yes
  }

  async login(user, pwd) {
    if (this.good(user)) {
      let users = jsondb.get('users')
      if (users[user]) {
        if (sha3(pwd) === users[user].password) {
          return 0
        }
      } else {
        return 1
      }
    } else {
      return 2
    }
  }

  async signup(user, pwd) {
    if (this.good(user)) {
      let users = jsondb.get('users')
      users[user] = {
        password: sha3(pwd)
      }
      jsondb.set(users)
      return 0
    } else {
      return 2
    }
  }

  async getToken(user) {
    let tokens = jsondb.get('tokens') || {}
    let now = Date.now()
    let token
    if (tokens[user]) {
      token = tokens[user].split(':')
      let ts = parseInt(token[2])
      if (ts > now) {
        delete tokens[user]
        jsondb.set(tokens)
        token = null
      }
    }
    return token
  }

  async checkToken(token) {
    return (token === await this.getToken(token.split(':')[0]))
  }

  async newToken(user) {
    let tokens = jsondb.get('tokens') || {}
    user = user.toLowerCase()
    let token = [
      toBase64(user).replace(/=/g, '&'),
      crypto.randomBytes(8).toString('base64').substring(0, 4),
      (Date.now() + 1000 * 3600 * 24 * 10)
    ].join('$')
    token += '$' + sha3(token).substring(0,1)
    tokens[user] = token
    jsondb.set(tokens)
    return token
  }
}

module.exports = Auth

