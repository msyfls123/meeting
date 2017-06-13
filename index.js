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
    UPLOAD = path.join(__dirname, 'upload'),
    SSL = path.join(__dirname, 'ssl')

var app = express()
app.set('view engine', 'pug')
app.use('/upload', express.static('upload'))

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
  let imgFiles = fs.readdirSync(UPLOAD)
  imgFiles = imgFiles.filter((f) => /(jpg|jpeg|gif|png)/.test(f))
  res.render('index', {imgFiles: imgFiles})
})

var server = https.createServer({
  key: fs.readFileSync(path.join(SSL, 'server.key')),
  cert: fs.readFileSync(path.join(SSL, 'server.crt'))
}, app)

var wss = new websocket.Server({
  server: server
})

wss.on('connection', function(ws) {
  ws.on('message', function(data, flags) {
    if (!flags.binary) {
      console.log('received: %s', data)      
      ws.fileName = data
      ws.send('Server: ' +  data)
    } else {
      var filename = ws.fileName || Date.now() + '.jpg'
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
