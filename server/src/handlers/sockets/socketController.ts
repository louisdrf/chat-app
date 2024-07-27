import { Server as SocketIOServer } from 'socket.io';
import { eventMessageController } from './eventMessageController';

export const initSocketController = (io : SocketIOServer) => {
    io.on('connection', (socket) => {
        console.log('Un utilisateur est connecté : ', socket.id);

        eventMessageController(socket)

        socket.on('disconnect', () => {
            console.log('Un utilisateur s\'est déconnecté : ', socket.id);
        });
    });
};