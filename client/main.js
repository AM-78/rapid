import uuid4 from 'https://cdn.jsdelivr.net/gh/tracker1/node-uuid4/browser.mjs'
let gid = "default"
let wid = ""
let bid = ""

function clearLocalStorage() {
    localStorage.setItem("gid", "")
    localStorage.setItem("wid", "")
    localStorage.setItem("bid", "")
    localStorage.setItem("player", "")
}

function sendToChess() {
    console.log("Sending")
    // window.location.href += "chess"
    window.location.href += "chess.html"
}

function handleCreate(event) {

    event.preventDefault()  
    
    gid = uuid4()
    wid = uuid4()
    
    console.log("clicked")
    console.log(gid)
    
    localStorage.setItem("gid", gid)
    localStorage.setItem("wid", wid)
    localStorage.setItem("player", "w")
    
    const idDiv = document.getElementById("idDiv")
    idDiv.innerHTML = `Game ID: ${gid}`
}


function handleJoin(event) {
    
    event.preventDefault()
    
    const inputField = document.getElementById("joinId")
    gid = inputField.value.trim()
    bid = uuid4()
    
    localStorage.setItem("gid", gid)
    localStorage.setItem("bid", bid)
    localStorage.setItem("player", "b")

    sendToChess()
}


function handleCopy() {
    console.log("handleCopy")
    navigator.clipboard.writeText(gid)
    sendToChess()
}

console.log("main.js loaded...")
clearLocalStorage()

document.getElementById("createBtn").addEventListener("click", handleCreate)
document.getElementById("joinBtn").addEventListener("click", handleJoin)
document.getElementById("copyBtn").addEventListener("click", handleCopy)

