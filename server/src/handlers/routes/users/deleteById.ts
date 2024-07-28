import express, { Request, Response } from "express";
import { AppDataSource } from "../../../database/database";
import { User } from "../../../database/entities/user";


export const deleteUserByIdRoute = (app: express.Express) => {
    app.delete('/users/:userId', async(req: Request, res: Response) => {
        const { userId } = req.params

        try {
            const userRepo = AppDataSource.getRepository(User)

            const user = await userRepo.findOne({ where: { id: parseInt(userId) } })
            if(!user) {
                return res.status(404).send({ error : 'Utilisateur introuvable.' })
            }

            const deletedUser = await userRepo.remove(user)

            res.status(200).send({ message : "L'utilisateur a bien été supprimé.", user : deletedUser })
        }
        catch(error) {
            console.error("Une erreur est survenue pendant la suppression de l'utilisateur :", error)
            return res.status(500).json({ error : "Une erreur interne est survenue. Réessayez plus tard." })
        }
    })
}