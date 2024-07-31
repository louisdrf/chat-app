import express, { Request, Response } from "express";
import { AppDataSource } from "../../../database/database";
import { User } from "../../../database/entities/user";


export const getUserPendingFriendshipsRoute = (app: express.Express) => {
    app.get('/users/:username/friendships/pending', async(req: Request, res: Response) => {

        const { username } = req.params

        try {
            const user = await AppDataSource.getRepository(User).findOne(
                { 
                    where : { username : username }, 
                    relations : ['sentFriendRequests'] 
                })

            if (!user) return res.status(404).send({ error: 'Utilisateur introuvable.' })
                
            const pendingFriendships = user.sentFriendRequests.filter(req => !req.isAccepted)            

            res.status(200).send({ friendships : pendingFriendships })

        }
        catch(error) {
            console.error("Une erreur est survenue pendant la récupération des demandes d'amitié en attente :", error)
            return res.status(500).json({ error : "Une erreur interne est survenue. Réessayez plus tard." })
        }
    })
}