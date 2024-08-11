import express, { Request, Response } from "express";
import { AppDataSource } from "../../../database/database";
import { generateValidationErrorMessage } from "../../validators/validation-message";
import { roomValidation } from "../../validators/rooms/new-room-validator";
import { User } from "../../../database/entities/user";
import { Room } from "../../../database/entities/room";
import { UserRoom } from "../../../database/entities/userRoom";

export const newRoomRoute = (app: express.Express) => {
    app.post('/rooms', async (req: Request, res: Response) => {
        try {
            const validation = roomValidation.validate(req.body)
            if (validation.error) {
                res.status(400).send(generateValidationErrorMessage(validation.error.details))
                return;
            }

            const userRepo = AppDataSource.getRepository(User)
            const roomRepo = AppDataSource.getRepository(Room)
            const userRoomRepo = AppDataSource.getRepository(UserRoom)

            const { name: targetUsername, createdBy: creatorUsername, isPrivate } = validation.value

            const creator = await userRepo.findOne({ where: { username: creatorUsername } })
            if (!creator) {
                res.status(400).send({ error: "Aucun utilisateur trouvé." })
                return
            }

            if (isPrivate) {
                const targetUser = await userRepo.findOne({ where: { username: targetUsername } })
                if (!targetUser) {
                    res.status(400).send({ error: "L'utilisateur cible n'a pas été trouvé." })
                    return
                }
                // on regarde si il n'y a pas déjà une conversation privée entre les deux
                
                const existingRooms = await roomRepo.find({ where : { isPrivate : true }, relations : ['users', 'messages'] })
                if(existingRooms.length > 0) {
                    const existingRoom = existingRooms.find(room => 
                        room.users.some(user => user.id === creator.id) && 
                        room.users.some(user => user.id === targetUser.id)
                    )

                    if (existingRoom) {
                        return res.status(200).json({ message: "Un salon privé existe déjà.", room: existingRoom })
                    }
                }  
            }

            // créer la room
            const roomToCreate = roomRepo.create({
                name: targetUsername,
                createdAt: new Date(),
                createdBy: creator,
                isPrivate: isPrivate ?? false,
                users: [creator]
            })

            const room = await roomRepo.save(roomToCreate)
            room.messages = []


            // créer les instances de table de jointure pour le créateur du salon
            const linkedUserRoom = userRoomRepo.create({
                user : creator,
                room : roomToCreate,
                lastVisitedAt : new Date(),
                unreadMessages : []
            })

            await userRoomRepo.save(linkedUserRoom)


            res.status(201).send({
                message: "La conversation a bien été créée.",
                room: room
            })

        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Une erreur interne est survenue. Réessayez plus tard." })
        }
    })
}
