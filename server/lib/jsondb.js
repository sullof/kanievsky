const simpleJsonDb = require("simple-json-db");
const path = require("path");
const fs = require("fs-extra");

class jsondb {
  constructor() {
    const dbDir = path.resolve(__dirname, "../../data");
    fs.ensureDirSync(dbDir);
    this.db = new simpleJsonDb(path.resolve(dbDir, "db.json"));
  }

  get(key) {
    return this.db.get(key);
  }

  set(key, value) {
    return this.db.set(key, value);
  }
}

let instance;
if (!instance) {
  instance = new jsondb();
}
module.exports = instance;
