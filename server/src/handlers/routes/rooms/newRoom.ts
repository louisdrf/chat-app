import express, { Request, Response } from "express"
import { AppDataSource } from "../../../database/database"
import { generateValidationErrorMessage } from "../../validators/validation-message"
import { roomValidation } from "../../validators/rooms/new-room-validator"


export const newRoomRoute = (app: express.Express) => {

    app.post('/rooms', async(req: Request, res: Response) => {
        try {
            const validation = roomValidation.validate(req.body)
            if (validation.error) {
                res.status(400).send(generateValidationErrorMessage(validation.error.details))
                return
            }

            const userRepo = AppDataSource.getRepository('User')
            const roomRepo = AppDataSource.getRepository('Room')

            const newRoomRequest = validation.value

            const creatorUsername = newRoomRequest.createdBy
            const creator = userRepo.findOneBy({ username : creatorUsername })
            if(!creator) {
                res.status(400).send({ error : "Aucun utilisateur trouvé." })
            }

            const roomToCreate = {
                name : newRoomRequest.name,
                createdAt: new Date(),
                createdBy : creator,
                isPrivate : newRoomRequest.isPrivate ?? false
            }

            
            const room = roomRepo.save(roomToCreate)

            res.status(201).send({
                message : "La conversation a bien été créée.",
                room : room
            })

            return

        }
        catch(error) {
            console.log(error)
            res.status(500).send({ error: "Une erreur interne est survenue. Réessayez plus tard." })
            return
        }
    })
}