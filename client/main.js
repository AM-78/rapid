import uuid4 from 'https://cdn.jsdelivr.net/gh/tracker1/node-uuid4/browser.mjs'
let gid = "default"
let wid = ""
let bid = ""

function sendToChess() {
    console.log("Sending")
    window.location.href += "chess"
}

async function handleCreate(event) {

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


async function handleJoin(event) {
    
    event.preventDefault()
    
    const inputField = document.getElementById("joinId")
    gid = inputField.value
    bid = uuid4()
    
    localStorage.setItem("gid", gid)
    localStorage.setItem("bid", bid)
    localStorage.setItem("player", "b")

    sendToChess()
}


async function handleCopy() {
    console.log("handleCopy")
    navigator.clipboard.writeText(gid)
    sendToChess()
}

document.getElementById("createBtn").addEventListener("click", handleCreate)
document.getElementById("joinBtn").addEventListener("click", handleJoin)
document.getElementById("copyBtn").addEventListener("click", handleCopy)


console.log("Loaded!!!")