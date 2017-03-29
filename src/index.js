require('./index.styl')

// Selector
var list = document.querySelector('#app'),
    input = document.querySelector('#user'),
    ok = document.querySelector('#btn'),
    send = document.querySelector('#send'),
    files = document.querySelector('#file')

// Web Socket
var ws = new WebSocket('wss://'+ location.host)

ws.onmessage = function(msg) {
  console.log(msg)
  list.appendChild(item(msg.data))
}

// Functions
function item(val) {
  var li = document.createElement('li')
  li.textContent = val
  return li
}

function getBinaryString(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      resolve(e.target.result)
    }
    reader.readAsBinaryString(file)
  })
}

// Event binding
ok.addEventListener('click', function(){
  ws.send(input.value)
})

send.addEventListener('click', async function(e){
  const file = files.files[0]
  await getBinaryString(file).then(
      (res) => {
        console.log(res)
        ws.send(res)
      },
    (err) => {console.log(err)}
  )
})


