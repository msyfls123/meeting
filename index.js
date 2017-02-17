var https = require('https'),
    fs = require('fs'),
    express = require('express'),
    websocket = require('ws')

var app = express()
app.set('view engine', 'pug')
app.use('/static', express.static('public'))
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
  ws.on('message', function(message) {
    console.log('received: %s', message)      
    ws.send('Server: ' +  message)
  })

  ws.send('hello')
})

server.listen(3000, function(res) {
  console.log('Listening...')
})
