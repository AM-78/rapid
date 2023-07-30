import rwURL from "./src/rw.svg"
import nwURL from "./src/nw.svg"
import bwURL from "./src/bw.svg"
import qwURL from "./src/qw.svg"
import kwURL from "./src/kw.svg"
import pwURL from "./src/pw.svg"

import rbURL from "./src/rb.svg"
import nbURL from "./src/nb.svg"
import bbURL from "./src/bb.svg"
import qbURL from "./src/qb.svg"
import kbURL from "./src/kb.svg"
import pbURL from "./src/pb.svg"

let URLSMap = {
    "rw": rwURL,
    "nw": nwURL,
    "bw": bwURL,
    "qw": qwURL,
    "kw": kwURL,
    "pw": pwURL,
    "rb": rbURL,
    "nb": nbURL,
    "bb": bbURL,
    "qb": qbURL,
    "kb": kbURL,
    "pb": pbURL,
}


// _____________________Some Global Variables_________________________

let boardState = [
                        ["rw", "nw", "bw", "qw", "kw", "bw", "nw", "rw",],
                        ["pw", "pw", "pw", "pw", "pw", "pw", "pw", "pw",],
                        [""  , ""  , ""  , ""  , ""  , ""  , ""  , ""  ,],
                        [""  , ""  , ""  , ""  , ""  , ""  , ""  , ""  ,],
                        [""  , ""  , ""  , ""  , ""  , ""  , ""  , ""  ,],
                        [""  , ""  , ""  , ""  , ""  , ""  , ""  , ""  ,],
                        ["pb", "pb", "pb", "pb", "pb", "pb", "pb", "pb",],
                        ["rb", "nb", "bb", "qb", "kb", "bb", "nb", "rb",],
                    ]


// let dummyBoardState = [
//                         ["rw", "nw", "bw", "qw", "kw", "bw", "nw", "rw",],
//                         ["pw", "pw", "pw", "pw", "pw", "pw", "pw", "pw",],
//                         [""  , ""  , ""  , ""  , ""  , ""  , ""  , ""  ,],
//                         [""  , ""  , ""  , ""  , ""  , ""  , ""  , ""  ,],
//                         [""  , ""  , ""  , ""  , ""  , ""  , ""  , ""  ,],
//                         [""  , ""  , ""  , ""  , ""  , ""  , ""  , ""  ,],
//                         ["pb", "pb", "pb", "pb", "pb", "pb", "pb", "pb",],
//                         ["rb", "nb", "bb", "qb", "kb", "bb", "nb", "rb",],
//                     ]

let showingMovesFor = ""
let colorDark = "rgb(234,128,252)"
let colorLight = "white"
let colorMarkedSquare = "chartreuse" //Color of marked square that a piece can move to
let colorMarkedSelf = "green" //Color of the square containing the piece itself (the piece that we are seeing moves of)
let colorMarkedEnemy = "red" //Color of a square that a piece can move to and has the enemy piece
let possibleSquares = []
let underCheck = false
let playerUnderCheck = ""
let player = "w"
let moveOf = "w"
let opposite = "b"
// ___________________Utility Functions__________________________

function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

const idFromRF = (rank, file) => { return String(rank) + String(file) }

const RFfromId = (id) => { return [parseInt(id[0]), parseInt(id[1])] }

const inGrid = (rank, file) => {
    if(rank<1 || rank >8 || file<1 || file>8) return false;
    return true;
}

function getImageUrl(name) {
    return URLSMap[name]
}

function reset() {

    boardState = [
                    ["rw", "nw", "bw", "qw", "kw", "bw", "nw", "rw",],
                    ["pw", "pw", "pw", "pw", "pw", "pw", "pw", "pw",],
                    [""  , ""  , ""  , ""  , ""  , ""  , ""  , ""  ,],
                    [""  , ""  , ""  , ""  , ""  , ""  , ""  , ""  ,],
                    [""  , ""  , ""  , ""  , ""  , ""  , ""  , ""  ,],
                    [""  , ""  , ""  , ""  , ""  , ""  , ""  , ""  ,],
                    ["pb", "pb", "pb", "pb", "pb", "pb", "pb", "pb",],
                    ["rb", "nb", "bb", "qb", "kb", "bb", "nb", "rb",],
                ]


    //__________________Set Colour of Squares__________________ 
    for(let i=1; i<=8; i++) {
        for(let j=1; j<=8; j++) {
            const id = String(i)+String(j);
            const square = document.getElementById(id);
            square.style.backgroundColor = (i+j)%2 ? colorLight : colorDark;
            square.addEventListener("click", clickSquare)
        }
    }

    //_______________Add images of pieces_____________________(DEFAULT BOARD POSITION)
    for(let i=0; i<8; i++) {
        for(let j=0; j<8; j++) {
            if (boardState[i][j] !== "") {
                const id = String(i+1)+String(j+1);
                const square = document.getElementById(id);
                const imgUrl = getImageUrl(boardState[i][j])
                square.firstChild.src = imgUrl
            } else {
                const id = String(i+1)+String(j+1);
                const square = document.getElementById(id);
                square.firstChild.src = ""
            }
        }
    }

    player = "w"
    moveOf = "w"
    opposite = "b"
}



function checkElement(bigArr, element) {
    //check if possibleSquares array contains some specific array as an element in it
    for(let each of bigArr) {
        if((each[0] == element[0]) && (each[1] == element[1])) return true
    }
    return false
}

// uncomment the player = "b" and player = "w" lines to play from both sides
function flipMove() {

    if(moveOf == "w") {
        // player = "b"
        moveOf = "b"
        opposite = "w"
    } else {
        // player = "w"
        moveOf = "w"
        opposite = "b"
    }
}


function checkCheck(turnOf) {

    let underCheck = false
    let king = "k" + turnOf

    let opponent = (turnOf == "w") ? "b" : "w"
    let pawn = "p" + opponent
    let rook = "r" + opponent
    let bishop = "b" + opponent
    let knight = "n" + opponent
    let queen = "q" + opponent

    let krank = 0, kfile = 0
    let cr=0, cf=0
    let sq = null

    for(let r=0; r<8; r++) {
        for(let f=0; f<8; f++) {
            if(boardState[r][f] == king) {
                krank = r+1
                kfile = f+1
                break
            }
        }
    }

    //pawn
    let id = idFromRF(krank, kfile)
    if(inGrid(krank-1, kfile+1)) if(boardState[krank-2][kfile] == pawn) return true
    if(inGrid(krank-1, kfile-1)) if(boardState[krank-2][kfile-2] == pawn) return true

    //rook and queen
    sq = moveRook(krank, kfile, king)
    for(let i=0; i<sq.length; i++) {
        cr = sq[i][0]
        cf = sq[i][1]
        if(boardState[cr-1][cf-1] == rook || boardState[cr-1][cf-1] == queen) return true
    }

    //bishop and queen
    sq = moveBishop(krank, kfile, king)
    for(let i=0; i<sq.length; i++) {
        cr = sq[i][0]
        cf = sq[i][1]
        if(boardState[cr-1][cf-1] == bishop || boardState[cr-1][cf-1] == queen) return true
    }

    //knight
    sq = moveKnight(krank, kfile, king)
    for(let i=0; i<sq.length; i++) {
        cr = sq[i][0]
        cf = sq[i][1]
        if(boardState[cr-1][cf-1] == knight) return true
    }

    return false

}


function checkCheckMate() {

    let totalPossibleMoves = 0

    for(let i=0; i<8; i++) {
        for(let j=0; j<8; j++) {

            if(boardState[i][j]!= "" && boardState[i][j][1] == moveOf) {
                let piece = boardState[i][j]
                let id = idFromRF(i+1, j+1)
                let moves = getPossibleMoves(id)
                totalPossibleMoves += moves.length
            }
        }
    }

    if(totalPossibleMoves == 0) {
        let winner = (moveOf == "w") ? "Black" : "White"
        // window.alert()
        sleep(200).then(() => {
        if(window.confirm(`Checkmate! ${winner} is Victorious!`)) reset()})
    }

}


function movePawn(rank, file, piece) {

    possibleSquares = []

    if(piece == "pw") {

        if(rank == 8) return possibleSquares

        if(rank == 2) {
            if(boardState[rank][file-1] == "") {
                possibleSquares.push([rank+1, file])
                if(boardState[rank+1][file-1] == "") possibleSquares.push([rank+2, file])
            }
        }
        
        else {
            if(boardState[rank][file-1] == "")  possibleSquares.push([rank+1, file])
        }

        if(inGrid(rank+1, file-1) && boardState[rank][file-2] !="" && boardState[rank][file-2][1] != piece[1])
        possibleSquares.push([rank+1, file-1])
        if(inGrid(rank+1, file+1) && boardState[rank][file] != "" && boardState[rank][file][1] != piece[1])
        possibleSquares.push([rank+1, file+1])

        return possibleSquares
    }
    else {

        if(rank == 1) return possibleSquares

        if(rank == 7) {
            if(boardState[rank-2][file-1] == "") {
                possibleSquares.push([rank-1, file])
                if(boardState[rank-3][file-1] == "") possibleSquares.push([rank-2, file])
            }
        }

        else {
            if(boardState[rank-2][file-1] == "") possibleSquares.push([rank-1, file])
        }

        if(inGrid(rank-1, file-1) && boardState[rank-2][file-2] != "" && boardState[rank-2][file-2][1] != piece[1])
        possibleSquares.push([rank-1, file-1])
        if(inGrid(rank-1, file+1) && boardState[rank-2][file] != "" && boardState[rank-2][file][1] != piece[1])
        possibleSquares.push([rank-1, file+1])
    }
    return possibleSquares

}


function moveRook(rank, file, piece) {

    possibleSquares = []
    let r = rank
    let f = file
    let coll = false
    // console.log(1);
    //fordward
    while(r < 8 && !coll){
        if(boardState[r][f-1] == "") possibleSquares.push([r+1, f])
        else{
            if(boardState[r][f-1][1] != piece[1]) {
                possibleSquares.push([r+1, f])
            }
            coll = true
        }
        r++
    }
    // console.log(2);
    //backward
    r = rank
    coll = false
    while(r > 1 && !coll){
        if(boardState[r-2][f-1] == "") possibleSquares.push([r-1, f])
        else{
            if(boardState[r-2][f-1][1] != piece[1]) {
                possibleSquares.push([r-1, f])
            }
            coll = true
        }
        r--
    }
    // console.log(3);

    //right
    r = rank
    f = file
    coll = false
    while(f < 8 && !coll){
        if(boardState[r-1][f] == "") possibleSquares.push([r, f+1])
        else{
            if(boardState[r-1][f][1] != piece[1]) {
                possibleSquares.push([r, f+1])
            }
            coll = true
        }
        f++
    }
    // console.log(4);
    //left
    r = rank
    f = file
    coll = false
    while(f > 1 && !coll){
        if(boardState[r-1][f-2] == "") possibleSquares.push([r, f-1])
        else{
            if(boardState[r-1][f-2][1] != piece[1]) {
                possibleSquares.push([r, f-1])
            }
            coll = true
        }
        f--
    }
    // console.log(5);
    // console.log(possibleSquares);
    return possibleSquares

}
    

function moveBishop(rank, file, piece) {

    possibleSquares = []
    let r = rank
    let f = file
    let coll = false

    //top right
    while(!coll) {

        if(!inGrid(r+1, f+1)) break

        if(boardState[r][f] == "") possibleSquares.push([r+1, f+1])
        else {
            if(boardState[r][f][1] != piece[1]) possibleSquares.push([r+1, f+1])
            coll = true
        }
        r++
        f++
    }

    r = rank
    f = file
    coll = false

    //bottom right
    while(!coll) {

        if(!inGrid(r-1, f+1)) break

        if(boardState[r-2][f] == "") possibleSquares.push([r-1, f+1])
        else {
            if(boardState[r-2][f][1] != piece[1]) possibleSquares.push([r-1, f+1])
            coll = true
        }
        r--
        f++
    }

    r = rank
    f = file
    coll = false

    //top left
    while(!coll) {

        if(!inGrid(r+1, f-1)) break

        if(boardState[r][f-2] == "") possibleSquares.push([r+1, f-1])
        else {
            if(boardState[r][f-2][1] != piece[1]) possibleSquares.push([r+1, f-1])
            coll = true
        }
        r++
        f--
    }

    r = rank
    f = file
    coll = false

    //bottom left
    while(!coll) {

        if(!inGrid(r-1, f-1)) break

        if(boardState[r-2][f-2] == "") possibleSquares.push([r-1, f-1])
        else {
            if(boardState[r-2][f-2][1] != piece[1]) possibleSquares.push([r-1, f-1])
            coll = true
        }
        r--
        f--
    }


    return possibleSquares

}


function moveKnight(rank, file, piece) {

    possibleSquares = []

    //FORWARD WITH RIGHT OR LEFT________________________________________________
    //ffr
    if(inGrid(rank+2, file+1)) {
        if(boardState[rank+1][file] == "") possibleSquares.push([rank+2, file+1])
        else if(boardState[rank+1][file][1] != piece[1]) possibleSquares.push([rank+2, file+1])
    }
    //ffl
    if(inGrid(rank+2, file-1)) {
        if(boardState[rank+1][file-2] == "") possibleSquares.push([rank+2, file-1])
        else if(boardState[rank+1][file-2][1] != piece[1]) possibleSquares.push([rank+2, file-1])
    }
    //rrf
    if(inGrid(rank+1, file+2)) {
        if(boardState[rank][file+1] == "") possibleSquares.push([rank+1, file+2])
        else if(boardState[rank][file+1][1] != piece[1]) possibleSquares.push([rank+1, file+2])
    }
    //llf
    if(inGrid(rank+1, file-2)) {
        if(boardState[rank][file-3] == "") possibleSquares.push([rank+1, file-2])
        else if(boardState[rank][file-3][1] != piece[1]) possibleSquares.push([rank+1, file-2])
    }

    //BACKWARD WITH RIGHT OR LEFT____________________________________________________________
    //bbr
    if(inGrid(rank-2, file+1)) {
        if(boardState[rank-3][file] == "") possibleSquares.push([rank-2, file+1])
        else if(boardState[rank-3][file][1] != piece[1]) possibleSquares.push([rank-2, file+1])
    }
    //bbl
    if(inGrid(rank-2, file-1)) {
        if(boardState[rank-3][file-2] == "") possibleSquares.push([rank-2, file-1])
        else if(boardState[rank-3][file-2][1] != piece[1]) possibleSquares.push([rank-2, file-1])
    }
    //rrb
    if(inGrid(rank-1, file+2)) {
        if(boardState[rank-2][file+1] == "") possibleSquares.push([rank-1, file+2])
        else if(boardState[rank-2][file+1][1] != piece[1]) possibleSquares.push([rank-1, file+2])
    }
    //llb
    if(inGrid(rank-1, file-2)) {
        if(boardState[rank-2][file-3] == "") possibleSquares.push([rank-1, file-2])
        else if(boardState[rank-2][file-3][1] != piece[1]) possibleSquares.push([rank-1, file-2])
    }

    return possibleSquares

}


function moveKing(rank, file, piece) {
    
    possibleSquares = []

    //MOVE UP__________________3 Choices
    if(inGrid(rank+1, file)) {
        if(boardState[rank][file-1] == "" ) possibleSquares.push([rank+1, file])
        else if(boardState[rank][file-1][1] != piece[1]) possibleSquares.push([rank+1, file])
    }

    if(inGrid(rank+1, file-1)) {
        if(boardState[rank][file-2] == "" ) possibleSquares.push([rank+1, file-1])
        else if(boardState[rank][file-2][1] != piece[1]) possibleSquares.push([rank+1, file-1])
    }

    if(inGrid(rank+1, file+1)) {
        if(boardState[rank][file] == "" ) possibleSquares.push([rank+1, file+1])
        else if(boardState[rank][file][1] != piece[1]) possibleSquares.push([rank+1, file+1])
    }

    //SAME RANK_____________________2 Choices
    if(inGrid(rank, file+1)) {
        if(boardState[rank-1][file] == "" ) possibleSquares.push([rank, file+1])
        else if(boardState[rank-1][file][1] != piece[1]) possibleSquares.push([rank, file+1])
    }

    if(inGrid(rank, file-1)) {
        if(boardState[rank-1][file-2] == "" ) possibleSquares.push([rank, file-1])
        else if(boardState[rank-1][file-2][1] != piece[1]) possibleSquares.push([rank, file-1])
    }

    //MOVE DOWN_______________________3 Choices
    if(inGrid(rank-1, file)) {
        if(boardState[rank-2][file-1] == "" ) possibleSquares.push([rank-1, file])
        else if(boardState[rank-2][file-1][1] != piece[1]) possibleSquares.push([rank-1, file])
    }

    if(inGrid(rank-1, file-1)) {
        if(boardState[rank-2][file-2] == "" ) possibleSquares.push([rank-1, file-1])
        else if(boardState[rank-2][file-2][1] != piece[1]) possibleSquares.push([rank-1, file-1])
    }

    if(inGrid(rank-1, file+1)) {
        if(boardState[rank-2][file] == "" ) possibleSquares.push([rank-1, file+1])
        else if(boardState[rank-2][file][1] != piece[1]) possibleSquares.push([rank-1, file+1])
    }

    return possibleSquares
}


function moveQueen(rank, file, piece) {

    possibleSquares = moveRook(rank, file, piece).concat(moveBishop(rank, file, piece))
    return possibleSquares

}


function mark([rank, file], piece) {

    let id = String(rank) + String(file)
    const square = document.getElementById(id)
    
    square.style.borderColor = "black"
    
    if(boardState[rank-1][file-1] != "" && boardState[rank-1][file-1][1] != piece[1]) {
        square.style.backgroundColor = colorMarkedEnemy
        
    }
    else {
        square.style.backgroundColor = colorMarkedSquare
    }
    
}


function unMark([rank, file]) {
    
    let id = String(rank) + String(file)
    const square = document.getElementById(id)
    square.style.backgroundColor = (rank+file)%2 ? colorLight : colorDark;
    square.style.borderColor = "transparent"
}


function sendMove(source, target) {
    
    makeMove(source, target)

}


function makeMove(source, target) {

    let [rank, file] = RFfromId(source)
    let piece = boardState[rank-1][file-1]
    boardState[rank-1][file-1] = ""

    let [trank, tfile] = RFfromId(target)
    boardState[trank-1][tfile-1] = piece

    document.getElementById(source).firstChild.src = ""
    // document.getElementById(target).firstChild.src = `src/images/${piece}.png`
    document.getElementById(target).firstChild.src = getImageUrl(piece)
    for(let i=0; i<possibleSquares.length; i++) {
        unMark(possibleSquares[i])
    }
    unMark(RFfromId(source))
    if(checkCheck(piece[1])) console.log("CHECK!!!", piece[1])
    flipMove()
    console.log("flipped move ", moveOf, player)
    checkCheckMate()

}


function getLegalMoves(possibleSquares, id, piece) {

    let legalSquares = []
    let prev = ""
    let [rank, file] = RFfromId(id)

    for(let i=0; i<possibleSquares.length; i++) {

        let [trank, tfile] = possibleSquares[i]
        boardState[rank-1][file-1] = ""
        prev = boardState[trank-1][tfile-1]
        boardState[trank-1][tfile-1] = piece
        
        if(!checkCheck(piece[1])) legalSquares.push(possibleSquares[i])
        
        boardState[rank-1][file-1] = piece
        boardState[trank-1][tfile-1] = prev
    }

    return legalSquares
}


function getPossibleMoves(id) {

    const square = document.getElementById(id)
    let [rank, file] = RFfromId(id)
    const piece = boardState[rank-1][file-1]

    possibleSquares = []

    if(piece === "") return possibleSquares

    else if(piece[0] == "p") possibleSquares = movePawn(rank, file, piece)
    else if(piece[0] == "r") possibleSquares = moveRook(rank, file, piece)
    else if(piece[0] == "b") possibleSquares = moveBishop(rank, file, piece)
    else if(piece[0] == "n") possibleSquares = moveKnight(rank, file, piece)
    else if(piece[0] == "k") possibleSquares = moveKing(rank, file, piece)
    else possibleSquares = moveQueen(rank, file, piece)

    return getLegalMoves(possibleSquares, id, piece)

}


function clickSquare(e) {

    let id = (e.target.id !== "") ? e.target.id : e.target.parentElement.id

    if (showingMovesFor != "" && id !== showingMovesFor) {
        const square = document.getElementById(id)
        // console.log(getComputedStyle(square))
        console.log(possibleSquares);
        console.log(RFfromId(id))

        if (checkElement(possibleSquares, RFfromId(id))) {
            console.log("hereee");
            let source = showingMovesFor
            let target = id
            sendMove(source, target)
            showingMovesFor = ""  
            return
        }
    }

    if (showingMovesFor === "") {
        console.log("clicked");
        let id = (e.target.id !== "") ? e.target.id : e.target.parentElement.id
        let [rank, file] = RFfromId(id)
        let piece = boardState[rank-1][file-1]

        if(piece[1] != moveOf || piece[1] != player) return

        document.getElementById(id).style.backgroundColor = colorMarkedSelf
        document.getElementById(id).style.borderColor = "black"

        possibleSquares = getPossibleMoves(id)

        for(let i=0; i<possibleSquares.length; i++) {
            mark(possibleSquares[i], piece)
        }
        showingMovesFor = id
    }

    else {
        let id = showingMovesFor
        possibleSquares = getPossibleMoves(id)

        for(let i=0; i<possibleSquares.length; i++) {
            unMark(possibleSquares[i])
        }

        let [rank, file] = RFfromId(id)
        document.getElementById(id).style.backgroundColor = (rank+file)%2 ? colorLight : colorDark
        document.getElementById(id).style.borderColor = "transparent"
        let prev = showingMovesFor
        showingMovesFor = ""

        //unmarking done above, now marking for new piece

        id = (e.target.id !== "") ? e.target.id : e.target.parentElement.id

        //after unmarking, checking if the new "clicked" square is a different from the "showingMovesFor" one
        if(id != prev) {
            let [rank, file] = RFfromId(id)
            let piece = boardState[rank-1][file-1]
            
            if(piece[1] != moveOf || piece[1] != player) return
            
            document.getElementById(id).style.backgroundColor = colorMarkedSelf
            document.getElementById(id).style.borderColor = "black"
            possibleSquares = getPossibleMoves(id)

            for(let i=0; i<possibleSquares.length; i++) {
                mark(possibleSquares[i], piece)
            }
            showingMovesFor = id
        }
    }

    // console.log(boardState); 
    // console.table(boardState)
}


function flipBoard() {

    //flipping the board
    const board = document.getElementById("board")
    board.classList.remove("board")
    board.classList.add("flipped-board")

    //flipping the ranks

    for(let i=1; i<=8; i++) {
        let rank = document.getElementById(i.toString())
        rank.classList.remove("rank")
        rank.classList.add("flipped-rank")
    }
}

let gid = localStorage.getItem("gid")
let wid = localStorage.getItem("wid")
let bid = localStorage.getItem("bid")
let move = ""

reset()

if(bid) {
    player = "b"
    flipBoard()
}