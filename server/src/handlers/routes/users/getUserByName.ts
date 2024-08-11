import express, { Request, Response } from "express";
import { AppDataSource } from "../../../database/database";
import { User } from "../../../database/entities/user";

export const getUserByNameRoute = (app: express.Express) => {
    app.get('/users/:username', async (req: Request, res: Response) => {

        const { username } = req.params

        try {
            const user = await AppDataSource.getRepository(User).findOne(
                    { where : { username : username }, 
                    relations : ['currentRoom', 'currentRoom.users', 'currentRoom.messages']
                }
            )

            if(!user) {
                res.status(404).send({ error : "Aucune utilisateur trouvé." })
                return
            }

            res.status(200).send({ message : "L'utilisateur a bien été trouvé." , user : user })
            return
        }
        catch(error) {
            console.error(error)
            return res.status(500).json({ error : "Une erreur interne est survenue. Réessayez plus tard." })
        }
    })
}