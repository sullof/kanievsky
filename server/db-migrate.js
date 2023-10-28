const fs = require("./lib/fs");
const path = require("path");
const sharp = require("sharp");
const levelDb = require("./lib/db");
const jsondb = require("./lib/jsondb");

async function main() {
  let images = JSON.parse(await levelDb.get("images"));

  let id = 0;

  let sections = {
    paintings: [],
    drawings: [],
    prints: [],
  };

  for (let key in images) {
    for (let elem of images[key]) {
      if (sections[key] && path.extname(elem.src)) {
        let src = elem.src.split("/")[3];

        let imageDir = path.resolve(__dirname, "../public/images");
        await sharp(path.join(imageDir, "large", src))
          .resize({ width: 400 })
          .toFile(path.join(imageDir, "small", src));

        let item = {
          id: ++id,
          src,
          caption: elem.caption,
        };
        sections[key].push(item);
      }
    }
  }
  jsondb.set("lastId", id);
  jsondb.set("images", sections);

  let password = await levelDb.get("user:kael");

  let users = {
    kael: {
      role: "admin",
      password,
    },
  };

  jsondb.set("users", users);

  let info = {
    bio: await levelDb.get("content:bio"),
    news: await levelDb.get("content:news"),
    contacts: await levelDb.get("content:contacts"),
  };

  jsondb.set("info", info);
}

main();
