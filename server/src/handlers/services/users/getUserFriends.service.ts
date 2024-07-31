import { User } from '../../../database/entities/user';
import { AppDataSource } from '../../../database/database';

export const getUserFriends = async (username: string) => {
    try {
        const user = await AppDataSource.getRepository(User).findOne({
            where: { username },
            relations: ['sentFriendRequests', 'receivedFriendRequests']
        })

        if (!user) throw new Error('Utilisateur introuvable.')

        // Retrieve accepted friends from both sent and received friend requests
        const friends = user.sentFriendRequests
            .filter(req => req.isAccepted)
            .map(req => req.requestee)
            .concat(user.receivedFriendRequests
                .filter(req => req.isAccepted)
                .map(req => req.requester))

        return friends

    } catch (error) {
        console.error("Une erreur est survenue pendant la récupération des amis de l'utilisateur :", error);
        throw error
    }
}