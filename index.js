var https = require('https'),
    fs = require('fs'),
    path = require('path'),
    express = require('express'),
    websocket = require('ws'),
    webpack = require('webpack'),
    webpackDevMiddleware = require('webpack-dev-middleware'),
    webpackHotMiddleware = require('webpack-hot-middleware'),
    config = require('./webpack.config.js')

var compiler = webpack(config),
    DEVELOP = process.env.NODE_ENV !== 'product',
    UPLOAD = path.join(__dirname, 'upload')

var app = express()
app.set('view engine', 'pug')

if (DEVELOP) {
  app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
    noInfo: true,
    stats: 'normal'
  }))
    app.use(webpackHotMiddleware(compiler))
} else {
    app.use('/static', express.static('public'))
}


app.get('/', function(req, res) {
  res.render('index')
})

var server = https.createServer({
  key: fs.readFileSync('/Users/kimi/ssl/domain.key'),
  cert: fs.readFileSync('/Users/kimi/ssl/signed.crt')
}, app)

var wss = new websocket.Server({
  server: server
})

wss.on('connection', function(ws) {
  ws.on('message', function(data, flags) {
    if (flags.binary) {
      console.log('received: %s', data)      
      ws.send('Server: ' +  data)
    } else {
      var binaryData = new Buffer(data),
          filename = 'temp.jpeg'
      saveData(data, filename)
    }
  })

  ws.send('hello')
})

server.listen(3000, function(res) {
  console.log('Listening...')
})

function saveData(data, filename) {
  fs.writeFile(path.join(UPLOAD, filename), data, {
    encoding: 'binary'
  }, function(err) {
    if (err) {
      console.log(err)
    } else {
      console.log('Saved')
    }
  })
}
