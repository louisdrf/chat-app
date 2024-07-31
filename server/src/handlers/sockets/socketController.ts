import { Server as SocketIOServer } from 'socket.io';
import { eventMessageController } from './eventMessageController';
import jwt from 'jsonwebtoken';
import { User } from '../../database/entities/user';
import { AppDataSource } from '../../database/database';

const onlineUsers = new Map<number, boolean>(); // Map to keep track of online users

export const initSocketController = (io: SocketIOServer) => {
  io.use(async (socket, next) => {
    const token = socket.handshake.query.token as string;

    if (!token) {
      return next(new Error('Authentication error'));
    }

    jwt.verify(token, process.env.JWT_SECRET as string, async (err, decoded) => {
      if (err) {
        return next(new Error('Authentication error'));
      }

      if (!decoded || typeof decoded === 'string') {
        return next(new Error('Authentication error'));
      }

      const userRepo = AppDataSource.getRepository(User);
      const user = await userRepo.findOne({ where: { id: decoded.userId } });
      if (!user) {
        return next(new Error('User not found'));
      }

      // Attach the user to the socket object
      (socket as any).user = user;

      // Mark user as online
      onlineUsers.set(user.id, true);
      console.log(`User ${user.username} is now online`);

      next();
    });
  });

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);

      const user = (socket as any).user;
      if (user) {
        // Mark user as offline
        onlineUsers.delete(user.id);
        console.log(`User ${user.username} is now offline`);
      }
    });
  });

  // Custom event to get online users
  io.on('getOnlineUsers', (callback) => {
    callback(Array.from(onlineUsers.keys())); // Return a list of online user IDs
  });
};