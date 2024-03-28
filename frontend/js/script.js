

// login elements
const login = document.querySelector(".login")
const loginForm = login.querySelector(".login__form")
const loginInput = document.querySelector(".login__input")


const chat = document.querySelector(".chat")
const chatForm = chat.querySelector(".chat__form")
const chatInput = chat.querySelector(".chat__input")
const chatMessages = chat.querySelector(".chat__messages")

const user = {id:"", name:"", color:""}

let websocket

const createMessageSelfElement = (content) =>{
    const div = document.createElement("div")

    div.classList.add("message__self")
    div.innerHTML = content
    return div
}

const createMessageOtherElement = (content, sender, senderColor) =>{
    const div = document.createElement("div")
    const span = document.createElement("span")
    
    div.classList.add("message__other")

    
    span.classList.add("message__sender")
    span.style.color = senderColor

    div.appendChild(span)

    
    span.innerHTML = sender
    div.innerHTML += content
    return div
}

const scrollScreen =() =>{
    window.scrollBy({
        top: document.body.scrollHeight,
        behavior: "smooth"
    });
};


//"random colors"
const colors= [
    "cadetblue",
    "darkgoldenrod",
    "cornflowerblue",
    "darkkhaki",
    "hotpink",
    "gold"
]

const getRandomColor=() =>{
    const randomIndex = Math.floor(Math.random() * colors.length)
    return colors[randomIndex]
}


const processMessage= ({data}) => {
    const {userId , userName , userColor, content} = JSON.parse(data)
    const message = 
    userId == user.id 
    ? createMessageSelfElement(content)
    : createMessageOtherElement(content, userName, userColor)

    chatMessages.appendChild(message)
    scrollScreen()
}


const handleLogin = (event) =>{
    event.preventDefault()

    user.id = crypto.randomUUID()
    user.name= loginInput.value
    user.color = getRandomColor()
    
    login.style.display = "none"
    chat.style.display = "flex"

    websocket = new WebSocket("wss://chat-backend-ejc5.onrender.com")
    websocket.onmessage = processMessage
    
    
    
    

}

chatInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        // Aqui você pode chamar a função que envia a mensagem
        sendMessage(event);
    }
});


const sendMessage = (event) => {
    event.preventDefault()
    const message = {
        userId: user.id,
        userName: user.name,
        userColor: user.color,
        content: chatInput.value
    }
    
    websocket.send(JSON.stringify(message))
    chatInput.value = ""
}


loginForm.addEventListener("submit", handleLogin)
chatForm.addEventListener("submit", sendMessage)

