const registerSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log(`client connected: ${socket.id}`)

    socket.on('join-room', (roomName) => {
      if (!roomName) {
        return
      }

      socket.join(roomName)
      socket.emit('joined-room', roomName)
    })

    socket.on('leave-room', (roomName) => {
      if (!roomName) {
        return
      }

      socket.leave(roomName)
      socket.emit('left-room', roomName)
    })

    socket.on('price-update', ({ roomName, payload } = {}) => {
      if (roomName) {
        io.to(roomName).emit('price-update', payload ?? {})
        return
      }

      io.emit('price-update', payload ?? {})
    })

    socket.on('disconnect', () => {
      console.log(`client disconnected: ${socket.id}`)
    })
  })
}

module.exports = registerSocketHandlers
