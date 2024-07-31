import { Socket } from "socket.io";
import { AppDataSource } from "../../database/database";
import { Friendship } from "../../database/entities/friendship";
import { User } from "../../database/entities/user";

export const friendshipRequestsController = (socket: Socket) => {
    const friendshipRepo = AppDataSource.getRepository(Friendship);
    const userRepo = AppDataSource.getRepository(User);

    socket.on('send_friendship_request', async (requestee_uid: string, requester_uid: string) => {
        try {
            const requester = await userRepo.findOne({ where: { uid: requester_uid } })
            if (!requester)  return socket.emit('friendship_request_error', { error: 'Envoyeur de la demande introuvable.' });

            const requestee = await userRepo.findOne({ where: { uid: requestee_uid } });
            if (!requestee) return socket.emit('friendship_request_error', { error: 'Receveur de la demande introuvable.' });

            const existingFriendshipRequest = await friendshipRepo.findOne({
                where: [
                    { requester: requester, requestee: requestee },
                    { requester: requestee, requestee: requester }
                ]
            })

            if (existingFriendshipRequest) return socket.emit('friendship_request_error', { error: 'Demande d\'ami déjà envoyée.' });

            const friendshipRequest = new Friendship(requester, requestee)

            await friendshipRepo.save(friendshipRequest)

            // Notify the requester
            socket.emit('friendship_request_sent', { message: 'Demande envoyée.', demand: friendshipRequest });

            // Optionally, notify the requestee
            socket.to(requestee_uid).emit('new_friendship_request', { requester })

        } catch (error) {
            console.error("Une erreur est survenue pendant l'envoi de la demande d'ami :", error);
            socket.emit('friendship_request_error', { error: "Une erreur interne est survenue. Réessayez plus tard." });
        }
    })

    socket.on('accept_friendship_request', async (friendshipId: number) => {
        try {
            const friendship = await friendshipRepo.findOne({ where: { id: friendshipId } })

            if (!friendship) return socket.emit('friendship_acceptance_error', { error: 'Demande d\'ami non trouvée.' })
                
            friendship.isAccepted = true
            friendship.acceptedAt = new Date()
            await friendshipRepo.save(friendship)

            // Notify both users about the acceptance
            socket.emit('friendship_request_accepted', { message: 'Demande acceptée.', demand: friendship })
            socket.to(friendship.requester.uid).emit('friendship_request_accepted', { message: 'Votre demande d\'ami a été acceptée.', demand: friendship })
            socket.to(friendship.requestee.uid).emit('friendship_request_accepted', { message: 'Vous avez accepté une demande d\'ami.', demand: friendship })

        } catch (error) {
            console.error("Une erreur est survenue pendant l'acceptation de la demande d'ami :", error)
            socket.emit('friendship_acceptance_error', { error: "Une erreur interne est survenue. Réessayez plus tard." })
        }
    })
}
