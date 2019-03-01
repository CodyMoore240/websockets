const app = require('express')()
const http = require('http').createServer(app)
var io = require('socket.io')(http)

//import modules
const generateToken = require('./generateToken')

app.get('/', (req, res) => {
  res.send('<h1>Hello worlds</h1>')
})

io.on('connection', (socket) => {
  //create a token
  const token = generateToken.generate()
  console.log(`a user connected with a token of ${token}`)
  //send the token
  socket.send(token)


  //on disconnect event
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

http.listen(3001, () => {
  console.log('listening on *:3001')
})