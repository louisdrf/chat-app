import express, { Request, Response } from "express";
import { AppDataSource } from "../../../database/database";
import { Room } from "../../../database/entities/room";
import { UserRoom } from "../../../database/entities/userRoom";
import { User } from "../../../database/entities/user";

export const getUserPublicRoomsRoute = (app: express.Express) => {
    app.get('/rooms/public/:username', async (req: Request, res: Response) => {

        const { username } = req.params

        try {
            const userRepo = AppDataSource.getRepository(User)
            const roomRepo = AppDataSource.getRepository(Room)
            const userRoomRepo = AppDataSource.getRepository(UserRoom)

            const user = await userRepo.findOne({ where : { username : username }})
            if(!user) {
                return res.status(404).send({ error : "Utilisateur introuvable." })
            }

            const rooms = await roomRepo.find({
                where: { isPrivate: false },
                relations: ['users', 'messages']
            })

            const userPublicRooms = rooms.filter(room =>
                room.users.some(user => user.username === username)
            )


            const roomsWithUserRoomData = await Promise.all(userPublicRooms.map(async publicRoom => {
                const userRoom = await userRoomRepo.findOne({
                    where: {
                        user: { id: user.id },
                        room: { id: publicRoom.id }
                    }
                })

                return {
                    ...publicRoom,
                    userRoomData: userRoom || {}  // Ajoute les données telles que le nombre de messages non lus et la dernière visite d'une conversation
                }
            }))

            res.status(200).send({ message: "Les salons publics ont été trouvés.", rooms: roomsWithUserRoomData })
            
        }
        catch(error) {
            console.error(error)
            return res.status(500).json({ error : "Une erreur interne est survenue. Réessayez plus tard." })
        }
    })
}