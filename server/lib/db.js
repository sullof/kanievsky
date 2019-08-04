const path = require('path')
const level = require('level')
const dbDir = path.resolve(__dirname, '../../db')
const db = level(dbDir)
module.exports = db

async function setUp() {
  try {
    await db.get('setup')
  } catch(e) {
    const images = {
      paintings: [],
      drawings: [],
      sculptures: []
    }
    db.put('images', JSON.stringify(images))
    db.put('setup', '1')
  }
}

setUp()

