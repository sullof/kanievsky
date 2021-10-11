const path = require('path')
const fs = require('./fs')
const sharp = require('sharp')
const jsondb = require('../lib/jsondb')

const uploadDir = path.resolve(__dirname, '../../tmp/uploads')
const largeDir = path.resolve(__dirname, '../../public/images/large')
const smallDir = path.resolve(__dirname, '../../public/images/small')

fs.ensureDir(uploadDir)
fs.ensureDir(largeDir)
fs.ensureDir(smallDir)

class Images {

  async list() {
    let images
    try {
      images = await jsondb.get('images')
    } catch (e) {
    }
    return images
  }

  async add(what, caption, pictureName, id) {

    const list = await this.list()
    if (!list[what]) {
      list[what] = []
    }

    const origin = path.join(uploadDir, pictureName || '')
    let dest = path.join(largeDir, pictureName || '')
    if (pictureName) {
      await fs.copyAsync(origin, dest)
      await sharp(origin)
        .resize({width: 400})
        .toFile(path.join(smallDir, pictureName))
    }
    let newImage
    if (id) {
      for (let img of list[what]) {
        if (img.id === parseInt(id)) {
          if (pictureName) {
            img.src = pictureName
          }
          img.caption = caption
          newImage = img
          break
        }
      }
    }
    if (!newImage && pictureName) {
      let lastId = jsondb.get('lastId')
      newImage = {
        src: pictureName,
        caption,
        id: ++lastId
      }
      jsondb.set('lastId', lastId)
      list[what].splice(0, 0, newImage)
    }
    if (newImage) {
      await jsondb.set('images', list)
    }
    return newImage
  }

  async newSection(section) {
    section = section.toLowerCase()
    let list = await this.list()
    if (!list[section]) {
      list[section] = []
      jsondb.set('images', list)
      return true
    }
    return false
  }

  async del(id) {
    let list = await this.list()
    for (let key in list) {
      for (let i=0;i<list[key].length;i++) {
        let image = list[key][i]
        if (image.id === parseInt(id)) {
          fs.unlink(path.join(largeDir, image.src))
          fs.unlink(path.join(smallDir, image.src))
          list[key].splice(i, 1)
          await jsondb.set('images', list)
          return true
        }
      }
    }
    return false
  }

}

module.exports = Images

