const app = require('express')()
const http = require('http').createServer(app)
var io = require('socket.io')(http)

//import modules
const generateToken = require('./generateToken')

//board game data
const gameData = {
  board: [
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0]
  ],
  player1: null,
  player2: null,
  currentTurn: 0
}

app.get('/', (req, res) => {
  res.send('<h1>Hello worlds</h1>')
})

io.on('connection', (socket) => {
  let yourToken = null
  //create a token
  const token = generateToken.generate()
  console.log(`a user connected with a token of ${token}`)

  //Assign token logic
  if (gameData.player1 === null) {
    //set the current user as player1
    gameData.player1 = token
    yourToken = token
  } else if (gameData.player2 === null){
    //set the current user as player2
    gameData.player2 = token
    yourToken = token
  } else {
    //This is just a spectator
  }

  const payload = {
    ...gameData,
    yourToken
  }

  //send the token
  socket.emit('newToken', payload)

  //Move Event
  socket.on('move', (id, x, y) => {
    console.log(`A move event was detected`)

    //modify the data
    socket.emit('updateBoard', gameData)
  })

  //on disconnect event
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

http.listen(3001, () => {
  console.log('listening on *:3001')
})