import express, { Request, Response } from "express";
import { AppDataSource } from "../../../database/database";
import { User } from "../../../database/entities/user";


export const getUserFriendsRoute = (app: express.Express) => {
    app.get('/users/:username/friends', async(req: Request, res: Response) => {

        const { username } = req.params

        try {
            const user = await AppDataSource.getRepository(User).findOne(
                { 
                    where : { username : username }, 
                    relations : ['sentFriendRequests', 'receivedFriendRequests'] 
                })

            if (!user) return res.status(404).send({ error: 'Utilisateur introuvable.' });
            

            const friends = user.sentFriendRequests // demandes envoyées acceptées + demande reçue acceptées
            .filter(req => req.isAccepted)
            .map(req => req.requestee)
            .concat(user.receivedFriendRequests
                .filter(req => req.isAccepted)
                .map(req => req.requester))

            res.status(200).send({ friends })

        }
        catch(error) {
            console.error("Une erreur est survenue pendant la récupération des amis.' :", error)
            return res.status(500).json({ error : "Une erreur interne est survenue. Réessayez plus tard." })
        }
    })
}