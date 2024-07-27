import { Server as SocketIOServer } from 'socket.io';
import http from 'http'; 
import { initSocketController } from './handlers/sockets/socketController';

export const initializeSocket = (server : http.Server) => {
    const io = new SocketIOServer(server, {
        cors: {
            origin: 'http://localhost:3002',
            methods: ['GET', 'POST'],
        },
    })

    initSocketController(io)
}