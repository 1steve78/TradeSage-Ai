require('dotenv').config()

const http = require('http')
const { Server } = require('socket.io')

const app = require('./app')
const connectMongo = require('./confifg/database')
const registerSocketHandlers = require('./sockets/socketHandler')

const PORT = process.env.PORT || 5000
const httpServer = http.createServer(app)

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  },
})

registerSocketHandlers(io)
console.log('Socket server initialized')

const startServer = async () => {
  try {
    await connectMongo()

    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  } catch (error) {
    console.error('Server startup failed:', error.message)
    process.exit(1)
  }
}

startServer()
