let pass,name
const key = 1234
const socket = io('http://localhost:3000')
const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')

do{
  pass = prompt('Enter key')
  if(pass==key){
    enterChatRoom()
  }else{
    pass=''
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
  if(message.length>0){
    appendMessage(`You: ${message}`)
    socket.emit('send-chat-message', message)

    if(window.localStorage.getItem(name)==null){
      window.localStorage.setItem(name,message)
    }else{
      window.localStorage.setItem(name,message)
    }

    messageInput.value = ''
  }else{
    alert("!")
  }
})

function appendMessage(message) {
  const messageElement = document.createElement('div')
  messageElement.innerText = message
  messageContainer.append(messageElement)
}

function enterChatRoom(){
  do{
    name = prompt('What is your name?')
  }while(!name)
  appendMessage('You joined')
  socket.emit('new-user', name)
}