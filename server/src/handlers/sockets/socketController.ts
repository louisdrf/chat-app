import { Server as SocketIOServer } from 'socket.io';
import { authMiddleware } from './authMiddleware';
import { eventMessageController } from './eventMessageController';
import { updateUserOnlineStatus } from '../services/users/updateUserOnlineStatus.service';
import { friendshipRequestsController } from './friendshipRequestsController';
import { updateUserSocketId } from '../services/users/updateUserSocketId.service';
import { AppDataSource } from '../../database/database';
import { User } from '../../database/entities/user';

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

    
    socket.on('login', async (username: string) => {
      const userRepo = AppDataSource.getRepository(User);

      try {
        const user = await userRepo.findOne({ where: { username: username } });
        if (user) {
          user.socketId = socket.id
          await userRepo.save(user)
          socket.emit('login_success', { message: 'Connexion réussie' })
        } else {
          socket.emit('login_error', { error: 'Utilisateur non trouvé' })
        }
      } catch (error) {
        console.error("Erreur lors de la connexion :", error);
        socket.emit('login_error', { error: "Erreur interne. Réessayez plus tard." });
      }
    })


    socket.on('disconnect', async () => {
      if (user) {
          await updateUserOnlineStatus(user.id, false)
          await updateUserSocketId(user.id, "")
          socket.broadcast.emit('user_disconnected', user)
      }
    })
  })

}