import express, { Request, Response } from "express";
import { AppDataSource } from "../../../database/database";
import { User } from "../../../database/entities/user";
import { Friendship } from "../../../database/entities/friendship";


export const sendFriendDemandRoute = (app: express.Express) => {
    app.post('/friendships/send', async(req: Request, res: Response) => {

        const { requesterUID, requesteeUID } = req.body

        try {
            const userRepo = AppDataSource.getRepository(User)

            const requester = await userRepo.findOne({ where: { uid: requesterUID } })
            if(!requester) {
                return res.status(404).send({ error : 'Envoyeur de la demande introuvable.' })
            }

            const requestee = await userRepo.findOne({ where: { uid: requesteeUID } })
            if(!requestee) {
                return res.status(404).send({ error : 'Receveur de la demande introuvable.' })
            }

            const existingFriendshipRequest = await AppDataSource.getRepository(Friendship).findOne({
                where: [
                  { requester: requester, requestee: requestee },
                  { requester: requestee, requestee: requester }
                ]
              })

            if (existingFriendshipRequest) return res.status(400).send({ error: 'Demande d\'ami déjà existante.' });
               
            const friendshipRequest = new Friendship(requester, requestee);
        
            await AppDataSource.getRepository(Friendship).save(friendshipRequest)

            res.status(200).send({ message: 'Demande envoyée.', demand : friendshipRequest })

        }
        catch(error) {
            console.error("Une erreur est survenue pendant l'envoi de la demande d'ami' :", error)
            return res.status(500).json({ error : "Une erreur interne est survenue. Réessayez plus tard." })
        }
    })
}