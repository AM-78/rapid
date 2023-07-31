const PORT = process.env.PORT || 4000;

const uuid4 = require("uuid4")
const express = require("express")
const socket = require("socket.io")
const http = require("http")

const app = express()
const server = http.createServer(app)
const io = socket(server, {
    cors: {
        origin: "*"
    }
  })


app.get('/api', (req, res) => {
    res.json({
        message: 'Hello world',
    });
});
  
class ChessGame {

  constructor({gid, wid}) {
      this.gid = gid
      this.wid = wid
      this.turn = "white"

      // saving socket ids of b and w, later maybe use to handle disconnection or something
      this.w_sid = ""
      this.b_sid = ""
  }

  changeTurn() {

      if (this.turn === "white") {
          this.turn = "black"
      } else {
          this.turn = "white"
      }
  }
  
  validTurn(wid, bid) {
  
      if (this.turn === "white" && this.wid === wid) return true
      if (this.turn === "black" && this.bid === bid) return true
  
      return false
  
  }

}

let CurrentChessGames = {}

const chessio = io.of("/chess")

chessio.on("connection", (socket) => {

    console.log("Chess namespace: ", socket.id)

    // Create a new game, the one who creates it is white
    socket.on("create", async ({gid, wid}) => {

        if(uuid4.valid(gid)) {
            console.log(`Create: <${gid}>, <${wid}>`)
            let chessGame = new ChessGame({gid, wid})
            chessGame.w_sid = socket.id
            CurrentChessGames[gid] = chessGame
            socket.join(gid)
        } else {
            socket.emit("err", "There was some error. Please try again.")
        }


    })

    // Join an already created game
    socket.on("join", async ({gid, bid}) => {
        
        let chessGame = CurrentChessGames[gid]
        
        if(chessGame) {
            if(chessGame.bid) {
                console.log("Already 2")
                socket.emit("err", "Game already has 2 Players.")
            } else {
                console.log("2nd joining", bid)
                chessGame.bid = bid
                chessGame.b_sid = socket.id
                socket.join(gid)
                socket.to(gid).emit("2ndJoined", "")
            }
        } else {
            socket.emit("err", "Cannot find a match with provided game ID.")
        }

    })

    socket.on("makeMove", async ({gid, wid, bid, move}) => {
        
        let chessGame = CurrentChessGames[gid]
        
        if(chessGame) {
            if(!chessGame.validTurn(wid, bid)) {
                socket.emit("err", "Please wait for your turn.")
            } else {
                chessGame.changeTurn()
                console.log("Emmiting to the room", move)
                chessio.in(gid).emit("makeMove", move)
            }
        } else {
            socket.emit("err", "Cannot find a match with provided game ID.")
        }
    })

    socket.on("disconnect", () => {
        let discGame = Object.keys(CurrentChessGames).find(key => {
            CurrentChessGames[key].w_sid == socket.id ||
            CurrentChessGames[key].b_sid == socket.id
        })

        console.log("Disconnected: ", discGame)
    })

})


server.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});