import express, { Request, Response } from "express";
import { AppDataSource } from "../../../database/database";
import { Message } from "../../../database/entities/message";


export const pinOrUnpinMessageRoute = (app: express.Express) => {
    app.put('/messages/pin/:messageId', async(req: Request, res: Response) => {
        const { messageId } = req.params

        try {
            const messageRepo = AppDataSource.getRepository(Message)

            const message = await messageRepo.findOne({ where: { id: parseInt(messageId) } })
            if(!message) {
                return res.status(404).send({ error : 'Message introuvable.' })
            }

            message.isPinned = !message.isPinned

            await messageRepo.save(message)

            res.status(200).send({ message : "Le message a bien été modifié.", updatedMessage : message })
        }
        catch(error) {
            console.error("Une erreur est survenue pendant la modification du message :", error)
            return res.status(500).json({ error : "Une erreur interne est survenue. Réessayez plus tard." })
        }
    })
}