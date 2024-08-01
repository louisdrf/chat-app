import { Server as SocketIOServer } from 'socket.io';
import { authMiddleware } from './authMiddleware';
import { eventMessageController } from './eventMessageController';
import { updateUserOnlineStatus } from '../services/users/updateUserOnlineStatus.service';
import { friendshipRequestsController } from './friendshipRequestsController';
import { updateUserSocketId } from '../services/users/updateUserSocketId.service';

export const initSocketController = (io: SocketIOServer) => {
  io.use(authMiddleware)

  io.on('connection', async (socket) => {

    eventMessageController(socket)
    friendshipRequestsController(socket)

    const user = (socket as any).user
    if (user) {
        await updateUserOnlineStatus(user.id, true)
        await updateUserSocketId(user.id, socket.id)
        socket.broadcast.emit('user_connected', user)
    }

      socket.on('disconnect', async () => {
        if (user) {
            await updateUserOnlineStatus(user.id, false)
            await updateUserSocketId(user.id, "")
            socket.broadcast.emit('user_disconnected', user)
        }
      })
  })

}