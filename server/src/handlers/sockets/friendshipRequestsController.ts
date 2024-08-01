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
      if (!requester) return socket.emit('friendship_request_error', { error: 'Envoyeur de la demande introuvable.' });

      const requestee = await userRepo.findOne({ where: { username: requestee_username } });
      if (!requestee) return socket.emit('friendship_request_error', { error: 'Receveur de la demande introuvable.' });

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

      const friendshipRequest = new Friendship(requester, requestee);
      await friendshipRepo.save(friendshipRequest);

      // Notify the requester
      socket.emit('friendship_request_sent', { message: "Votre demande a été envoyée.", friendship: friendshipRequest });

      // Notify the requestee
      socket.to(requestee.socketId).emit('new_friendship_request', { friendship: friendshipRequest });

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

      friendship.isAccepted = true;
      friendship.acceptedAt = new Date();
      await friendshipRepo.save(friendship);

      // Notify the requester
      if (friendship.requester.socketId) {
        socket.to(friendship.requester.socketId).emit('friendship_request_accepted_requester', { friendship });
      }

      // Notify the requestee
      socket.emit('friendship_request_accepted_requestee', { friendship });

    } catch (error) {
      console.error("Une erreur est survenue pendant l'acceptation de la demande d'ami :", error);
      socket.emit('friendship_acceptance_error', { error: "Une erreur interne est survenue. Réessayez plus tard." });
    }
  });
};
