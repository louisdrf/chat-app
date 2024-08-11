import { Socket } from 'socket.io';
import { AppDataSource } from '../../database/database';
import { Message } from '../../database/entities/message';
import { User } from '../../database/entities/user';
import { Room } from '../../database/entities/room';
import { UserRoom } from '../../database/entities/userRoom';

export const eventMessageController = (socket: Socket) => {
    const messageRepository = AppDataSource.getRepository(Message)
    const userRepository = AppDataSource.getRepository(User)
    const roomRepository = AppDataSource.getRepository(Room)
    const userRoomRepository = AppDataSource.getRepository(UserRoom)

    socket.on('join_room', async (roomId: number, joinerUsername: string) => {
        try {
            const room = await roomRepository.findOneBy({ id: roomId })
            if (!room) {
                console.error(`Room ${roomId} non trouvée.`)
                return
            }

            const user = await userRepository.findOneBy({ username: joinerUsername })
            if (!user) {
                console.error(`Utilisateur non trouvé: ${joinerUsername}.`)
                return
            }

            // Met à jour la room actuelle de l'utilisateur
            user.currentRoom = room
            await userRepository.save(user)

            const userRoom = await userRoomRepository.findOne({
                where: {
                    user: { id: user.id },
                    room: { id: roomId },
                }
            })

            if (userRoom) {
                // Réinitialise la liste des messages non lus et met à jour la dernière visite
                userRoom.unreadMessages = []
                userRoom.lastVisitedAt = new Date()
                await userRoomRepository.save(userRoom)
            }

            socket.join(`room_${roomId}`)
            socket.emit('new_unread_message', roomId, [])

        } catch (error) {
            console.error('Erreur lors de la jonction de la room:', error)
        }
    })

    socket.on('send_message', async (data: { content: string; senderUsername: string }) => {
        try {
            const { content, senderUsername } = data
    
            // Trouver l'expéditeur
            const sender = await userRepository.findOne( { where : { username: senderUsername }, relations: ['currentRoom', 'currentRoom.users'] } )
            if (!sender) {
                console.error(`Utilisateur ${senderUsername} non trouvé.`)
                return
            }

            const curretUserRoom : Room = sender.currentRoom    
            if (!curretUserRoom) {
                console.error(`L'utilisateur n'est actuellement dans aucune room.`)
                return
            }

            const roomId = curretUserRoom.id

    
            // Créer et sauvegarder un nouveau message
            const message = new Message(content, new Date(), sender, curretUserRoom)
            await messageRepository.save(message)
    
            // Ajouter le message aux messages non lus pour les utilisateurs concernés
            if (curretUserRoom.isPrivate) {
                // Pour une room privée, on ajoute le message à la liste des non lus pour l'autre utilisateur
                const otherUser = curretUserRoom.users.find(user => user.id !== sender.id)
                if (otherUser && otherUser.socketId && otherUser.currentRoom?.id !== curretUserRoom.id) {
                    const userRoom = await userRoomRepository.findOne({
                        where: {
                            user: { id: otherUser.id },
                            room: { id: curretUserRoom.id },
                        },
                        relations: ['unreadMessages']
                    })
    
                    if (userRoom) {
                        if (!userRoom.unreadMessages.find(msg => msg.id === message.id)) {
                            userRoom.unreadMessages.push(message)
                            await userRoomRepository.save(userRoom)
                            socket.to(otherUser.socketId).emit('new_unread_message', roomId, message)
                        }
                    }
                }
            } else {
                // Pour une room publique, on ajoute le message à la liste des non lus pour tous les utilisateurs sauf l'expéditeur
                for (const user of curretUserRoom.users) {
                    if (user.id !== sender.id && user.socketId && user.currentRoom?.id !== roomId) {
                        const userRoom = await userRoomRepository.findOne({
                            where: {
                                user: { id: user.id },
                                room: { id: roomId },
                            },
                            relations: ['unreadMessages']
                        })
    
                        if (userRoom) {
                            if (!userRoom.unreadMessages.find(msg => msg.id === message.id)) {
                                userRoom.unreadMessages.push(message)
                                await userRoomRepository.save(userRoom)
                                socket.to(user.socketId).emit('new_unread_message', roomId, message)
                            }
                        }
                    }
                }
            }
    
            // Émettre le message aux clients dans la room
            socket.in(`room_${roomId}`).emit('receive_message', message)
            socket.emit('receive_message', message)
    
        } catch (error) {
            console.error('Erreur lors de l\'enregistrement du message:', error)
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

