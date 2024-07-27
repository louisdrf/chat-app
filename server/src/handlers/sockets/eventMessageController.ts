import { Socket } from 'socket.io';
import { AppDataSource } from '../../database/database';
import { Message } from '../../database/entities/message';
import { User } from '../../database/entities/user';

export const eventMessageController = (socket: Socket) => {
    const messageRepository = AppDataSource.getRepository(Message);
    const userRepository = AppDataSource.getRepository(User);

    socket.on('send_message', async (data: { content: string; senderUsername: string }) => {
        try {
            const { content, senderUsername } = data

            console.log('content message : ', content);
            console.log('sent by : ', senderUsername);

            // Récupérer l'utilisateur depuis la base de données
            const sender = await userRepository.findOneBy({ username : senderUsername})
            if (!sender) {
                console.error(`Utilisateur ${sender} non trouvé.`)
                return;
            }

            // Créer un nouveau message
            const message = new Message(content, new Date(), sender);

            console.log(message);
            
            
            // Sauvegarder le message dans la base de données
            await messageRepository.save(message);

            console.log('Message reçu:', content);
            console.log('Envoyé par:', sender.username);

            // Émettre un message de confirmation ou de réponse
            socket.emit('receive_message', { sender : sender.username, content : content});
            
            // Optionnel : émettre à tous les clients si nécessaire
            socket.broadcast.emit('receive_message', { sender : sender.username, content : content});
        } catch (error) {
            console.error('Erreur lors de l\'enregistrement du message:', error);
        }
    });
};

