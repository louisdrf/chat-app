import express, { Request, Response } from "express";
import { AppDataSource } from "../../../database/database";
import { Room } from "../../../database/entities/room";
import { Message } from "../../../database/entities/message";
import { UserRoom } from "../../../database/entities/userRoom";


export const deleteRoomRoute = (app: express.Express) => {
    app.delete('/rooms/:roomId', async(req: Request, res: Response) => {
        const { roomId } = req.params

        try {
            const roomRepo = AppDataSource.getRepository(Room)
            const messageRepo = AppDataSource.getRepository(Message)
            const userRoomRepo = AppDataSource.getRepository(UserRoom)

            const room = await roomRepo.findOne({ where: { id: parseInt(roomId) } })
            if(!room) {
                return res.status(404).send({ error : 'Salon introuvable.' })
            }

            await messageRepo.delete({ room: { id: parseInt(roomId) } })

            await userRoomRepo.delete({ room : room })

            const deletedRoom = await roomRepo.remove(room)

            res.status(200).send({ message : "Le salon a bien été supprimé.", room : deletedRoom })
        }
        catch(error) {
            console.error("Une erreur est survenue pendant la suppression du salon :", error)
            return res.status(500).json({ error : "Une erreur interne est survenue. Réessayez plus tard." })
        }
    })
}