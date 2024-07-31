import { Server as SocketIOServer } from 'socket.io';
import { getUserFriends } from '../services/users/getUserFriends.service';
import { authMiddleware } from './authMiddleware';
import { eventMessageController } from './eventMessageController';

const onlineUsers = new Map<number, boolean>(); // Map to keep track of online users


export const initSocketController = (io: SocketIOServer) => {
  io.use(authMiddleware)

  io.on('connection', (socket) => {

    eventMessageController(socket)

    socket.on('getFriendsWithStatus', async (username: string) => {
        try {

          const friends = await getUserFriends(username)
          const friendsWithOnlineStatus = friends.map(friend => ({
            ...friend,
            isOnline: onlineUsers.has(friend.id) ?? false
          }))

          socket.emit('friendsWithOnlineStatus', friendsWithOnlineStatus)
        } catch (error) {
          socket.emit('friendsWithOnlineStatusError', { error: 'An error occurred while retrieving online friends.' })
        }
      })

    socket.on('disconnect', () => {
      const user = (socket as any).user
      if (user) {
        onlineUsers.delete(user.id)
      }
    })
  })

}