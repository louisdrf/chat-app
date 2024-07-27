import { Server as SocketIOServer } from 'socket.io';

export const initSocketController = (io : SocketIOServer) => {
    io.on('connection', (socket) => {
        console.log('Un utilisateur est connecté');

        // Exemple d'événement 'message'
        socket.on('message', (msg) => {
            console.log('Message reçu:', msg);
            io.emit('message', msg); // Émettre le message à tous les clients
        });

        // Exemple d'événement 'disconnect'
        socket.on('disconnect', () => {
            console.log('Un utilisateur s\'est déconnecté');
        });
    });
};