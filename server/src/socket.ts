import { Server as SocketIOServer } from 'socket.io';
import http from 'http'; 
import { initSocketController } from './handlers/sockets/socketController';

export const initializeSocket = (server : http.Server) => {
    const io = new SocketIOServer(server)

    initSocketController(io)
    return io
}