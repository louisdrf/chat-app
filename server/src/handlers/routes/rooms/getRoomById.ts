import express, { Request, Response } from "express";
import { AppDataSource } from "../../../database/database";
import { Room } from "../../../database/entities/room";

export const getRoomByIdRoute = (app: express.Express) => {
    app.get('/rooms/:roomId', async (req: Request, res: Response) => {

        const { roomId } = req.params

        try {
            const room = await AppDataSource.getRepository(Room).findOne({ where : { id : parseInt(roomId) }, relations : ['users', 'messages']})

            if(!room) {
                res.status(404).send({ error : "Le salon n'existe pas." })
                return
            }

            res.status(200).send({ message : "Le salon a bien été trouvé." , room : room })
            return
        }
        catch(error) {
            console.error(error)
            return res.status(500).json({ error : "Une erreur interne est survenue. Réessayez plus tard." })
        }
    })
}