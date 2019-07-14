const express = require('express')
const router = express.Router()
// const url = require('url')

router.post('/get-shasta-trx', async (req, res) => {
  // try {
  //   if (url.parse(req.get('Referrer')).hostname === req.hostname) {
  //     const toAddress = req.body.address
  //     const faucetController = new FaucetController(req.levelDb)
  //     const result = await faucetController.send(toAddress)
  //     res.status(result.status).json(result)
  //   } else throw new Error()
  // } catch (err) {
  //   res.status(500).json({
  //     status: 500,
  //     message: 'There was an error sending you the TRX. Please try later.'
  //   })
  // }
})


module.exports = router
