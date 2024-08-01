import { Socket } from "socket.io";
import { AppDataSource } from "../../database/database";
import { Friendship } from "../../database/entities/friendship";
import { User } from "../../database/entities/user";

export const friendshipRequestsController = (socket: Socket) => {
  const friendshipRepo = AppDataSource.getRepository(Friendship);
  const userRepo = AppDataSource.getRepository(User);

  socket.on('send_friendship_request', async (requestee_username: string, requester_username: string) => {
    try {
      if (requestee_username === requester_username) {
        return socket.emit('friendship_request_error', { error: "Il s'agirait de se faire des amis..." });
      }

      const requester = await userRepo.findOne({ where: { username: requester_username } });
      if (!requester) return socket.emit('friendship_request_error', { error: 'Utilisateur introuvable.' });

      const requestee = await userRepo.findOne({ where: { username: requestee_username } });
      if (!requestee) return socket.emit('friendship_request_error', { error: 'Utilisateur introuvable.' });

      const existingFriendshipRequest = await friendshipRepo.findOne({
        where: [
          { requester: requester, requestee: requestee },
          { requester: requestee, requestee: requester }
        ]
      });

      if (existingFriendshipRequest) {
        const message = existingFriendshipRequest.isAccepted ? `${requestee_username} et vous êtes déjà amis.` : "Demande d'ami déjà envoyée.";
        return socket.emit('friendship_request_error', { error: message });
      }

      const friendshipRequest = new Friendship(requester, requestee)
      await friendshipRepo.save(friendshipRequest)

      // envoyer la requête 'en attente' à l'émetteur
      socket.emit('new_pending_request', friendshipRequest)

      // envoyer la nouvelle demande d'ami à l'utilisateur concerné
      if(requestee.socketId) socket.to(requestee.socketId).emit('new_friendship_request', friendshipRequest)

    } catch (error) {
      console.error("Une erreur est survenue pendant l'envoi de la demande d'ami :", error);
      socket.emit('friendship_request_error', { error: "Une erreur interne est survenue. Réessayez plus tard." });
    }
  });

  socket.on('accept_friendship_request', async (friendshipId: number) => {
    try {
      const friendship = await friendshipRepo.findOne({ where: { id: friendshipId }, relations: ["requester", "requestee"] });

      if (!friendship) {
        return socket.emit('friendship_acceptance_error', { error: 'Demande d\'ami non trouvée.' });
      }

      friendship.isAccepted = true
      friendship.acceptedAt = new Date()
      await friendshipRepo.save(friendship)

      
      // envoi à celui qui avait envoyé la demande
      if (friendship.requester.socketId) {      
        socket.to(friendship.requester.socketId).emit('requester_request_accepted', friendship) // lui indiquer que la personne a bien accepté sa demande
        socket.to(friendship.requester.socketId).emit('new_friend', friendship.requestee) // lui indiquer qu'il a un nouvel ami => friendship.requestee
      }

      // envoi à celui qui a accepté la demande
      if (friendship.requestee.socketId) {
        socket.to(friendship.requestee.socketId).emit('requestee_accepted_the_request', friendship) // lui indiquer que lui et le demandeur sont maintenant amis
        socket.to(friendship.requestee.socketId).emit('new_friend', friendship.requester) // lui indiquer qu'il a un nouvel ami => friendship.requester
      }

    } catch (error) {
      console.error("Une erreur est survenue pendant l'acceptation de la demande d'ami :", error);
      socket.emit('friendship_acceptance_error', { error: "Une erreur interne est survenue. Réessayez plus tard." });
    }
  })
}
