const express = require("express");
const router = express.Router();
const Auth = require("../lib/Auth");
const Images = require("../lib/Images");
const upload = require("../lib/upload");
const jsondb = require("../lib/jsondb");
const authMiddleware = require("./authMiddleware");

router.post("/login", async (req, res) => {
  const { user, pwd } = req.body;

  try {
    const auth = new Auth();
    const is = await auth.login(user, pwd);
    if (is === 0) {
      let accessToken = await auth.getToken(user);
      if (!accessToken) {
        accessToken = await auth.newToken(user);
      }
      res.json({
        success: true,
        accessToken,
      });
    } else {
      res.json({
        success: false,
        errorCode: is,
      });
    }
  } catch (e) {
    res.json({
      success: false,
      errorCode: -1,
    });
  }
});

router.get("/images", async (req, res) => {
  try {
    const images = new Images();
    const list = await images.list();
    res.json({
      success: true,
      images: list,
    });
  } catch (e) {
    res.json({
      success: false,
      errorCode: -1,
    });
  }
});

router.get("/content", async (req, res) => {
  let content = {};
  const info = jsondb.get("info");
  for (let what of req.query.what) {
    content[what] = info[what] || "--";
  }
  res.json({
    success: true,
    content,
  });
});

router.post("/save", authMiddleware, async (req, res) => {
  const { what, content } = req.body;
  const info = jsondb.get("info");
  info[what] = content;
  jsondb.set("info", info);
  res.json({
    success: true,
  });
});

router.post("/upload", authMiddleware, async function (req, res) {
  return upload(req, res);
});

router.delete("/delete", authMiddleware, async function (req, res) {
  const images = new Images();
  const { id } = req.query;
  res.json({
    success: await images.del(id),
  });
});

router.post("/new-section", authMiddleware, async function (req, res) {
  const images = new Images();
  res.json({
    success: await images.newSection(req.body.section),
  });
});

module.exports = router;
