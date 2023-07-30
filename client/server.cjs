const PORT = process.env.PORT || 8080
const express = require("express")
const cors = require("cors")
const path = require("path")
const app = express()

app.use(cors({
    origin: "*"
}))

app.use(express.static(__dirname))

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
})

app.get("/chess", function(req, res) {
    res.sendFile(path.join(__dirname, "chess.html"));
})


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}.....`)
})