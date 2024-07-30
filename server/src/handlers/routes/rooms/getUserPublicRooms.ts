import express, { Request, Response } from "express";
import { AppDataSource } from "../../../database/database";
import { Room } from "../../../database/entities/room";

export const getUserPublicRoomsRoute = (app: express.Express) => {
    app.get('/rooms/public/:username', async (req: Request, res: Response) => {

        const { username } = req.params

        try {
            const rooms = await AppDataSource.getRepository(Room).find({
                where: { isPrivate: false },
                relations: ['users', 'messages']
            });

            const userPublicRooms = rooms.filter(room =>
                room.users.some(user => user.username === username)
            )

            res.status(200).send({ message: "Les salons publics ont été trouvés.", rooms: userPublicRooms })
            
        }
        catch(error) {
            console.error(error)
            return res.status(500).json({ error : "Une erreur interne est survenue. Réessayez plus tard." })
        }
    })
}