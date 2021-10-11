const path = require('path')
const fs = require('./fs')
const Images = require('./Images')

const uploadDir = path.resolve(__dirname, '../../tmp/uploads')
fs.ensureDir(uploadDir)

async function upload(req, res) {
  let filename
  let {data, mimetype, name} = ((req.files || {}).file || {})
  if (name) {
    filename = path.join(uploadDir, Date.now() + '-' + name.replace(/\.\w+$/, '') + '.' + mimetype.split('/')[1])
    await fs.writeFile(filename, data)
  }
  const images = new Images()
  const what = req.query.what
  const caption = req.query.caption
  const id = req.query.id

  const newImage = await images.add(what, caption, filename ? path.basename(filename) : '', id)

  return res.status(200).json({
    success: true,
    newImage,
    what
  })
}

module.exports = upload
