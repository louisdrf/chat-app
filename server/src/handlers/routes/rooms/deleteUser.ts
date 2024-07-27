import express, { Request, Response } from "express";
import { deleteUserValidation } from "../../validators/rooms/delete-member-validator";
import { generateValidationErrorMessage } from "../../validators/validation-message";
import { AppDataSource } from "../../../database/database";
import { User } from "../../../database/entities/user";
import { Room } from "../../../database/entities/room";

export const deleteRoomMember = (app: express.Express) => {
    app.delete('/rooms/:roomId/members', async (req: Request, res: Response) => {
        const { roomId } = req.params

        const validation = deleteUserValidation.validate(req.body)
        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const deleteUserRequest = validation.value

        try {
            const userRepository = AppDataSource.getRepository(User)
            const roomRepository = AppDataSource.getRepository(Room)

            const room = await roomRepository.findOne({
                where: { id: parseInt(roomId) },
                relations: ['users'],
            })

            if (!room) {
                return res.status(404).json({ message: "Salon introuvable." })
            }

            const user = await userRepository.findOneBy({ username: deleteUserRequest.username })
            if (!user) {
                return res.status(404).json({ message: "Utilisateur introuvable." })
            }

            room.users = room.users.filter(u => u.id !== user.id)

            await roomRepository.save(room)

            return res.status(200).json({ message: "L'utilisateur a bien été retiré du salon." })
        } catch (error) {
            console.error("Une erreur est survenue pendant la suppression du membre :", error)
            return res.status(500).json({ error: "Une erreur interne est survenue. Réessayez plus tard." })
        }
    })
}
