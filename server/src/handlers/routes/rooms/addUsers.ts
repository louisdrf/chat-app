import express, { Request, Response } from "express";
import { AppDataSource } from "../../../database/database";
import { Room } from "../../../database/entities/room";
import { User } from "../../../database/entities/user";
import { addMembersToRoomValidation } from "../../validators/rooms/add-members-validator";
import { In } from "typeorm";
import { generateValidationErrorMessage } from "../../validators/validation-message";

export const addMembersToRoomRoute = (app: express.Express) => {
    app.post('/rooms/:roomId', async (req: Request, res: Response) => {

        const { roomId } = req.params

        const validation = addMembersToRoomValidation.validate(req.body)
        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }
    
        const addMembersRequest = validation.value
    
        try {
            const roomRepository = AppDataSource.getRepository(Room)
            const userRepository = AppDataSource.getRepository(User)
    
            const room = await roomRepository.findOne({
                where: { id: parseInt(roomId) },
                relations: ['users'] 
            })
            if (!room) {
                return res.status(404).json({ message: "Le salon n'a pas été trouvé." })
            }
    
            const usersToAdd = await userRepository.findBy({
                username: In(addMembersRequest.usernames)
            })
    
            room.users = [...room.users, ...usersToAdd]
            await roomRepository.save(room)
    
            return res.status(200).json({ message: "Les membres ont bien été ajoutés.", room : room })
    
        } catch (error) {
            console.error("Une erreur est survenue pendant l'ajout des membres :", error)
            return res.status(500).json({ error : "Une erreur interne est survenue. Réessayez plus tard." })
        }
    }) 
}
