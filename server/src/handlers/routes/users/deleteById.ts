import express, { Request, Response } from "express";
import { AppDataSource } from "../../../database/database";
import { User } from "../../../database/entities/user";
import { Room } from "../../../database/entities/room";


export const deleteUserByIdRoute = (app: express.Express) => {
    app.delete('/users/:userId', async(req: Request, res: Response) => {
        const { userId } = req.params

        try {
            const userRepo = AppDataSource.getRepository(User)
            const roomRepo = AppDataSource.getRepository(Room)

            const user = await userRepo.findOne({ 
                where: { id: parseInt(userId) }, 
                relations: ['rooms', 'rooms.users'] 
            })

            if (!user) return res.status(404).send({ error: 'Utilisateur introuvable.' })

            // Supprimer l'utilisateur des rooms
            for (const room of user.rooms) {                                
                room.users = room.users.filter(u => u.id !== user.id)
                await roomRepo.save(room)
            }    

            // Supprimer les rooms créees par l'utilisateur
            await roomRepo.delete({ createdBy: user })

            // Supprimer l'utilisateur
            const deletedUser = await userRepo.remove(user)

            res.status(200).send({ message : "L'utilisateur a bien été supprimé.", user : deletedUser })
        }
        catch(error) {
            console.error("Une erreur est survenue pendant la suppression de l'utilisateur :", error)
            return res.status(500).json({ error : "Une erreur interne est survenue. Réessayez plus tard." })
        }
    })
}