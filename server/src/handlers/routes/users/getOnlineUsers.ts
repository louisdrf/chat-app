import express, { Request, Response } from "express";
import { AppDataSource } from "../../../database/database";
import { User } from "../../../database/entities/user";

export const initGetOnlineUsersRoute = (app : express.Express) => {

    app.get('/users/online', async(req: Request, res: Response) => {
        const userRepository = AppDataSource.getRepository(User)

        try {

            const users = await userRepository.find({ where : { isOnline : true } })            

            if (!users) {
                res.status(404).send("Aucun utilisateur n'a pu être récupéré.")
                return
            }

            res.status(200).send({users : users })
            return

        } catch(error) {
            console.error("Une erreur est survenue pendant la récupération des utilisateurs en ligne :", error)
            return res.status(500).json({ error: "Une erreur interne est survenue. Réessayez plus tard." })
        }
    })
}