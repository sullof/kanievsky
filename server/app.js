const express = require('express')
const fs = require('./lib/fs')
const path = require('path')
const cookieParser = require('cookie-parser')
const apiV1 = require('./routes/apiV1')
const Logger = require('./lib/Logger')
const bodyParser = require('body-parser')
const cors = require('cors')

const levelDb = require('./lib/db')

process.on('uncaughtException', function (error) {

  Logger.error(error.message)
  Logger.error(error.stack)

  // if(!error.isOperational)
  //   process.exit(1)
})

let indexText

function getIndex() {
  if (!indexText) {
    indexText = fs.readFileSync(path.resolve(__dirname, '../public/index.html'), 'utf-8')
  }
  return indexText
}

const app = express()

app.use((req, res, next) => {
  req.levelDb = levelDb
  next()
})

app.use(cors())
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))

app.use('/api/v1', apiV1)

app.use('/index.html', function (req, res) {
  res.redirect('/')
})

app.post('/upload', (req, res, next) => {
  let imageFile = req.files.file

  imageFile.mv(`${__dirname}/public/works/${req.body.filename}.jpg`, function(err) {
    if (err) {
      return res.status(500).send(err)
    }

    res.json({file: `public/works/${req.body.filename}.jpg`})
  })

})

app.use('/:anything', function (req, res, next) {
  let v = req.params.anything
  switch(v) {
    case 'favicon.io':
    case 'bundle.min.js':
    case 'manifest.json':
    case 'styles':
    case 'images':
      next()
      break
    default:
      res.send(getIndex())
  }
})

app.use(express.static(path.resolve(__dirname, '../public')))


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
      title: 'Error',
      message: err.message,
      error: err
    })
  })
}

// error handler
app.use(function (err, req, res, next) {

  console.debug(err)
  console.debug(err.status)
  console.debug(err.message)

  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.json({error: 'Error'})
})

process.on('SIGINT', () => {
  levelDb.close()
  console.info('Db connection closed.')
  process.exit()
})

module.exports = app

