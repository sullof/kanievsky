const path = require('path')
const fs = require('./fs')
const Jimp = require('jimp')

const uploadDir = path.resolve(__dirname, '../../tmp/uploads')
const largeDir = path.resolve(__dirname, '../../public/images/large')
const smallDir = path.resolve(__dirname, '../../public/images/small')

fs.ensureDir(uploadDir)
fs.ensureDir(largeDir)
fs.ensureDir(smallDir)

class Images {

  constructor(db) {
    this.db = db
  }

  async list() {
    let images
    try {
      images = JSON.parse(await this.db.get('images'))
    } catch (e) {
    }
    return images
  }

  async add(what, caption, pictureName) {

    const origin = path.join(uploadDir, pictureName)
    let dest = path.join(largeDir, pictureName)

    await fs.copyAsync(origin, dest)
    let image = await Jimp.read(origin)
    const width = image.bitmap.width
    const height = image.bitmap.height

    let x, y, min
    if (width < height) {
      min = width
      x = 0
      y = Math.round((height - width) / 2)
    } else {
      min = height
      x = Math.round((width - height) / 2)
      y = 0
    }

    await image.crop(x, y, min, min)
    await image.resize(180, 180)
    await image.writeAsync(path.join(smallDir, pictureName))

    const list = await this.list()
    if (!list[what]) {
      list[what] = []
    }
    const newImage = {
      src: `/images/large/${pictureName}`,
      thumbnail: `/images/small/${pictureName}`,
      thumbnailWidth: 180,
      thumbnailHeight: 180,
      caption
    }

    list[what].push(newImage)
    await this.db.put('images', JSON.stringify(list))

    return newImage
  }

  async caption(what, thumbnail, caption) {
    let images = await this.list()
    let original = images[what]
    for (let i = 0; i < original.length; i++) {
      if (original[i].thumbnail === thumbnail) {
        original[i].caption = caption
      }
    }
    await this.db.put('images', JSON.stringify(images))
    return images
  }

  async del(what, indexes) {
    indexes = indexes.map(e => parseInt(e))
    let images = await this.list()
    let original = images[what]
    let changes = []
    for (let i = 0; i < original.length; i++) {
      if (!indexes.includes(i)) {
        changes.push(original[i])
      } else {
        fs.unlink(path.join(largeDir, original[i].src.split('/')[3]))
        fs.unlink(path.join(smallDir, original[i].src.split('/')[3]))
      }
    }
    images[what] = changes
    await this.db.put('images', JSON.stringify(images))
    return images
  }

}

module.exports = Images

