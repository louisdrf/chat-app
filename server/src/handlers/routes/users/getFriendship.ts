import express, { Request, Response } from "express";
import { AppDataSource } from "../../../database/database";
import { User } from "../../../database/entities/user";
import { Friendship } from "../../../database/entities/friendship"; // Assurez-vous que cette entité existe et est correcte

export const getFriendshipRoute = (app: express.Express) => {
  app.get('/users/:username1/friendships/:username2', async (req: Request, res: Response) => {
    const { username1, username2 } = req.params

    try {
      const user1 = await AppDataSource.getRepository(User).findOne({ where: { username: username1 } })
      const user2 = await AppDataSource.getRepository(User).findOne({ where: { username: username2 } })

      if (!user1 || !user2) {
        return res.status(404).send({ error: 'Un ou les deux utilisateurs sont introuvables.' })
      }

      const friendship = await AppDataSource.getRepository(Friendship).findOne({
        where: [
          { requester: user1, requestee: user2 },
          { requester: user2, requestee: user1 }
        ],
        relations: ['requester', 'requestee']
      })

      if (!friendship) {
        return res.status(404).send({ error: 'Amitié introuvable entre ces utilisateurs.' })
      }

      res.status(200).send({ friendship : friendship })

    } catch (error) {
      console.error("Une erreur est survenue pendant la récupération de l'amitié :", error)
      return res.status(500).json({ error: "Une erreur interne est survenue. Réessayez plus tard." })
    }
  })
}
