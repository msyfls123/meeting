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
    reader.onload = () => {
      resolve(reader.result)
    }
    reader.readAsArrayBuffer(file)
  })
}

function getFileName() {
  return new Promise((resolve, reject) => {
    const fileName = input.value
    !fileName && reject('No file name!')
    resolve(fileName)
  })
}

// Event binding
ok.addEventListener('click', function(){
  ws.send(input.value)
})

send.addEventListener('click', async function(e){
  const file = files.files[0]
  try {
    let fileName = await getFileName()
    let fileExt = file.type.split('/')[1]
    ws.send(fileName + '.' + fileExt)
    getBinaryString(file).then(
        (res) => {
          console.log(res)
          ws.send(res)
        },
      (err) => {console.log(err)}
    )
  } catch(err) {
    alert(err)
  }
})


