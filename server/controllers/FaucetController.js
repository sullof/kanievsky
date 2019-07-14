const TronWeb = require('tronweb')
const {faucetAmount, faucetDailyMax} = require('../config')

class FaucetController {

  constructor(db) {
    this.db = db
    this.tronWeb = new TronWeb({
      fullHost: 'https://api.shasta.trongrid.io',
      privateKey: process.env.PK
    })
  }

  getTimestampsOfTheDay() {
    return (new Date()).toISOString().substring(0, 10)
  }

  getDailyKey(address) {
    const today = this.getTimestampsOfTheDay()
    return `${today}:${TronWeb.address.fromHex(address)}`
  }

  async getDailyAmount(address) {
    let dailyAmount = 0
    try {
      dailyAmount = parseInt(await this.db.get(this.getDailyKey(address)))
    } catch (err) {
      //
    }
    return dailyAmount
  }

  async updateDailyQuota(address, amount) {
    try {
      await this.db.put(this.getDailyKey(address), amount)
    } catch (err) {
      //
    }
  }

  async send(address) {
    try {
      address = this.tronWeb.address.toHex(address)
    } catch (err) {
      return {
        status: 405,
        message: 'Invalid address provided.'
      }
    }
    let dailyAmount = await this.getDailyAmount(address)
    if (dailyAmount < faucetDailyMax) {
      try {
        let result = await this.tronWeb.trx.sendTransaction(address, TronWeb.toSun(faucetAmount))
        if (result.result === true) {
          dailyAmount += faucetAmount
          await this.updateDailyQuota(address, dailyAmount)
          return {
            status: 200,
            message: 'Your request was successfully submitted, please check your wallet.'
          }
        } else {
          throw new Error()
        }
      } catch (err) {
        return {
          status: 500,
          message: 'There was an error sending you the TRX. Please try later.'
        }
      }
    } else {
      return {
        status: 401,
        message: 'Faucet has been emptied for today, please try tomorrow in UTC time.'
      }
    }
  }

}


module.exports = FaucetController
