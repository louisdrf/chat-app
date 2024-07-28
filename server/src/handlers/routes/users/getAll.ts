import express, { Request, Response } from "express";
import { AppDataSource } from "../../../database/database";
import { User } from "../../../database/entities/user";

export const initGetAllUsersRoute = (app : express.Express) => {

    app.get('/users', async(res: Response, req: Request) => {
        const userRepository = AppDataSource.getRepository(User)

        try {

            const users = await userRepository.find()

            if (!users) {
                return res.status(404).send("Aucun utilisateur n'a pu être récupéré.")
            }

            res.status(200).send({users : users })

        } catch(error) {
            console.error("Une erreur est survenue pendant la récupération des utilisateurs :", error)
            return res.status(500).json({ error: "Une erreur interne est survenue. Réessayez plus tard." })
        }
    })
}