import express, { Request, Response } from "express";
import { AppDataSource } from "../../../database/database";
import { Friendship } from "../../../database/entities/friendship";


export const acceptFriendDemandRoute = (app: express.Express) => {
    app.put('/friendships/accept/:friendshipId', async(req: Request, res: Response) => {

        const { friendshipId } = req.params

        try {
            const friendship = await AppDataSource.getRepository(Friendship).findOneBy({ id: parseInt(friendshipId) });

            if (!friendship) {
                return res.status(404).send({ error: 'Demande d\'ami non trouvée.' });
            }

            friendship.isAccepted = true
            friendship.acceptedAt = new Date()
            await AppDataSource.getRepository(Friendship).save(friendship)

            res.status(200).send({ message: 'Demande acceptée.', demand : friendship })

        }
        catch(error) {
            console.error("Une erreur est survenue pendant l'acceptation de la demande d'ami' :", error)
            return res.status(500).json({ error : "Une erreur interne est survenue. Réessayez plus tard." })
        }
    })
}