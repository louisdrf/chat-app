import express, { Request, Response } from "express";
import { AppDataSource } from "../../../database/database";


export const deleteRoomRoute = (app: express.Express) => {
    app.delete('/rooms/:roomId', async(req: Request, res: Response) => {
        const { roomId } = req.params

        try {
            const roomRepo = AppDataSource.getRepository('Room')

            const room = roomRepo.findOneBy({ id : parseInt(roomId)})
            if(!room) {
                return res.status(404).send({ error : 'Salon introuvable.' })
            }

            await roomRepo.delete(room)
        }
        catch(error) {
            console.error("Une erreur est survenue pendant la suppression du salon :", error)
            return res.status(500).json({ error : "Une erreur interne est survenue. Réessayez plus tard." })
        }
    })
}