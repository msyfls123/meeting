var list = document.querySelector('#app'),
    input = document.querySelector('#user'),
    ok = document.querySelector('#btn')

var ws = new WebSocket('wss://'+ location.host)

ws.onmessage = function(msg) {
  console.log(msg)
  list.appendChild(item(msg.data))
}

function item(val) {
  var li = document.createElement('li')
  li.textContent = val
  return li
}

ok.addEventListener('click', function(){
  ws.send(input.value)
})
