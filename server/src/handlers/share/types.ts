import { User } from '../../database/entities/user';

declare module 'socket.io' {
  interface Socket {
    user?: User; 
  }
}