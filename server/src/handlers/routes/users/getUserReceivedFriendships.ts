import express, { Request, Response } from "express";
import { AppDataSource } from "../../../database/database";
import { User } from "../../../database/entities/user";


export const getUserReceivedFriendshipsRoute = (app: express.Express) => {
    app.get('/users/:username/friends', async(req: Request, res: Response) => {

        const { username } = req.params

        try {
            const user = await AppDataSource.getRepository(User).findOne(
                { 
                    where : { username : username }, 
                    relations : ['receivedFriendRequests'] 
                })

            if (!user) return res.status(404).send({ error: 'Utilisateur introuvable.' });
            

            const receivedFriendRequests = user.receivedFriendRequests.filter(req => !req.isAccepted)

            res.status(200).send({ friendships : receivedFriendRequests })

        }
        catch(error) {
            console.error("Une erreur est survenue pendant la récupération des demandes d'ami reçues :", error)
            return res.status(500).json({ error : "Une erreur interne est survenue. Réessayez plus tard." })
        }
    })
}