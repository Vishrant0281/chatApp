var pass, name, uid
const socket = io('http://localhost:3000')
const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')


// enter key and name
do{
  pass = prompt('Enter key').trim()
  if(pass != ''){
    enterChatRoom()
    uid = getHash(pass) //convert key to hascode
  }else{
    pass = ''
  }
}while(!pass)

socket.on('chat-message', data => {
  appendMessage(`${data.name}: ${data.message}`)
})

socket.on('user-connected', name => {
  appendMessage(`${name} connected`)
})

socket.on('user-disconnected', name => {
  appendMessage(`${name} disconnected`)
})

messageForm.addEventListener('submit', e => {
  e.preventDefault()
  const message = messageInput.value.trim()
  if(message.length > 0){
    appendMessage(`You: ${message}`)
    socket.emit('send-chat-message', message)
    sendMessage(message)
    messageInput.value = ''
  }else {
    alert("!")
  }
})

function appendMessage(message) {
  const messageElement = document.createElement('div')
  messageElement.innerText = message
  messageContainer.append(messageElement)
}

function enterChatRoom() {
  do {
    name = prompt('What is your name?')
  } while(!name)
  appendMessage('You joined')
  socket.emit('new-user' , name)
}

// get time function
function dateTimeFunction() {
  var today = new Date();
  var date = today.getFullYear() + '-' + (today.getMonth()+1) + '-' + today.getDate()
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
  var dateTime = date + ' ' + time
  return dateTime;
}

function sendMessage(message){

  let dateTime = dateTimeFunction()
  const msg = {user:name, message: message.trim(), date: dateTime}
  
  // Storing data to lacal storage
  let arr = []
  var msg1 = localStorage.getItem(uid);
  if(msg1 == null) {
    arr[0] = msg
    window.localStorage.setItem(uid,JSON.stringify(arr));
  } else {
    msg1 = JSON.parse(msg1)
    for(let i = 0; i < msg1.length; i++) {
      arr.push(msg1[i])  
    }
    arr.push(msg)
    window.localStorage.setItem(uid,JSON.stringify(arr));
  }
}

function getHash(input){
  var hash = 0, len = input.length;
  for (var i = 0; i < len; i++) {
    hash  = ((hash << 5) - hash) + input.charCodeAt(i);
    hash |= 0; // to 32bit integer
  }
  return hash;
}


// on Load function
window.onload = function(){
  var reloading = localStorage.getItem(uid);
  if(reloading!=null){
    var reload = JSON.parse(reloading)
    let reloadLength = reload.length
    for(let i=0; i < reloadLength; i++){
      let msg2 = {user:reload[i].user, message:reload[i].message.trim()}
      //load user name and chat from LS
      if(name != msg2.user){
        appendMessage(`${msg2.user}: ${msg2.message}`)
      }else{
        appendMessage(`You : ${msg2.message}`)
      }
    }
  }
}

document.getElementById('leave-btn').addEventListener('click', () => {
  if (confirm('Are you sure you want to leave the chatroom?')==true) {
    window.location='./index.html'
    event.preventDefault()
  } else {
    event.preventDefault()
  }
});