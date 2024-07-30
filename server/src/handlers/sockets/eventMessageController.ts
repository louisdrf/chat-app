import { Socket } from 'socket.io';
import { AppDataSource } from '../../database/database';
import { Message } from '../../database/entities/message';
import { User } from '../../database/entities/user';
import { Room } from '../../database/entities/room';

export const eventMessageController = (socket: Socket) => {
    const messageRepository = AppDataSource.getRepository(Message)
    const userRepository = AppDataSource.getRepository(User)
    const roomRepository = AppDataSource.getRepository(Room)

    socket.on('join_room', async (roomId: number) => {
        socket.join(`room_${roomId}`)
    })

    socket.on('send_message', async (data: { content: string; senderUsername: string, roomId : number}) => {
        try {
            const { content, senderUsername, roomId } = data

            const sender = await userRepository.findOneBy({ username : senderUsername})
            if (!sender) {
                console.error(`Utilisateur ${sender} non trouvé.`)
                return
            }

            const room = await roomRepository.findOneBy({ id : roomId})
            if(!room) {
                console.error(`Room ${roomId} non trouvée.`)
                return
            }

            // Créer un nouveau message
            const message = new Message(content, new Date(), sender, room)

            await messageRepository.save(message)

            socket.in(`room_${roomId}`).emit('receive_message', message)
            socket.emit('receive_message', message)
            
        } catch (error) {
            console.error('Erreur lors de l\'enregistrement du message:', error);
        }
    })


    socket.on('delete_message', async(messageId, roomId) => {
        try {
            const messageRepo = AppDataSource.getRepository(Message)

            const message = await messageRepo.findOne({ where: { id: parseInt(messageId) } })
            if(!message) return

            await messageRepo.delete({ id: parseInt(messageId) })            

            socket.in(`room_${roomId}`).emit('message_deleted', messageId)
            socket.emit('message_deleted', messageId)

          } catch (error) {
            console.error('Error deleting message:', error);
          }
    })


    socket.on('modify_message', async(messageId, roomId, newContent) => {
        try {
            const messageRepo = AppDataSource.getRepository(Message)

            const message = await messageRepo.findOne({ where: { id: parseInt(messageId) } })
            if(!message) return

            message.content = newContent
            message.modifiedAt = new Date()

            await messageRepo.save(message)           

            socket.in(`room_${roomId}`).emit('message_modified', message)
            socket.emit('message_modified', message)

          } catch (error) {
            console.error('Error modifying message:', error);
          }
    })


    socket.on('pin_message', async(messageId, roomId) => {
        try {
            const messageRepo = AppDataSource.getRepository(Message)

            const message = await messageRepo.findOne({ where: { id: parseInt(messageId) } })
            if(!message) return

            message.isPinned = !message.isPinned

            await messageRepo.save(message)

            const room = await roomRepository.findOne({ where : { id : roomId }, relations: ['messages']})
            if(!room) return

            socket.in(`room_${roomId}`).emit('message_pinned', room)
            socket.emit('message_pinned', room)

          } catch (error) {
            console.error('Error deleting message:', error);
          }
    })
}

