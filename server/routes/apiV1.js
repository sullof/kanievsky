const express = require('express')
const router = express.Router()
const Auth = require('../lib/Auth')
const Images = require('../lib/Images')

const multer = require('multer')
const upload = require('../lib/upload')

router.post('/login', async (req, res) => {
  const {user, pwd} = req.body

  try {
    const auth = new Auth(req.levelDb)
    const is = await auth.login(user, pwd)
    if (is === 0) {
      let accessToken = await auth.getToken(user)
      if (!accessToken) {
        accessToken = await auth.newToken(user)
      }
      res.json({
        success: true,
        accessToken
      })
    } else {
      res.json({
        success: false,
        errorCode: is
      })
    }
  } catch (e) {
    res.json({
      success: false,
      errorCode: -1
    })

  }
})

router.get('/images', async (req, res) => {

  try {
    const images = new Images(req.levelDb)
    const list = await images.list()
    res.json({
      success: true,
      images: list
    })
  } catch (e) {
    res.json({
      success: false,
      errorCode: -1
    })

  }
})

router.post('/upload', function(req, res) {

  upload(req, res)
})

router.get('/delete', async function(req, res) {

  const images = new Images(req.levelDb)
  const {what, indexes} = req.query
  res.json({
    success: true,
    images: await images.del(what, indexes)
  })
})

module.exports = router
