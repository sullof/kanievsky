const Auth = require('../lib/Auth')

module.exports = (req, res, next) => {
  const auth = new Auth()
  const accessToken = req.get('Access-Token')
  if (accessToken && auth.checkToken(accessToken)) {
    next()
  } else {
    res.status(401).json({
      message: 'Access not authorized.'
    })
  }
}
