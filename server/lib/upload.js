const path = require('path')
const fs = require('./fs')
const Images = require('./Images')
const multer = require('multer')

const uploadDir = path.resolve(__dirname, '../../tmp/uploads')
fs.ensureDir(uploadDir)

function upload(req, res) {

  let pictureName
  const images = new Images(req.levelDb)

  multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, uploadDir)
      },
      filename: function (req, file, cb) {
        pictureName = Date.now() + '-' + file.originalname
        cb(null, pictureName)
      }
    })
  }).array('file')(req, res, async err => {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({
        success: false,
        message: 'Server side error'
      })
    } else if (err) {
      return res.status(500).json({
        success: false,
        message: 'Unknown error'
      })
    } else {

      const what = req.query.what
      const caption = req.query.caption

      const newImage = await images.add(what, caption, pictureName)

      return res.status(200).json({
        success: true,
        newImage,
        what
      })
    }
  })
}

module.exports = upload
