const Auth = require('../lib/Auth')

module.exports = (req, res, next) => {
  const auth = new Auth(req.levelDb)
  const accessToken = req.get('Access-Token')
  if (auth.checkToken(accessToken)) {
    next()
  } else {
    res.status(401).json({
      message: 'Access not authorized.'
    })
  }
}
