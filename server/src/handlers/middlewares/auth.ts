import { NextFunction, Response, Request } from "express";
import { verify } from "jsonwebtoken";
import { AppDataSource } from "../../database/database";
import { Token } from "../../database/entities/token";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    const authHeader = req.headers['authorization']
    if (!authHeader) return res.status(400).json({ error : "Token d'authentification manquant."})

    const token = authHeader.split(' ')[1]
    if (token === null) return res.status(401).json({ error : "Accès non autorisé." })

    const tokenRepo = AppDataSource.getRepository(Token)
    const tokenFound = await tokenRepo.findOne({ where: { token } })
    if (!tokenFound) {
        return res.status(403).json({ error: "Accès non autorisé." })
    }
    

    const secret = process.env.JWT_SECRET ?? ""
    verify(token, secret, async (err, decodedToken) => {
        if (err) return res.status(403).json({ error : "Accès non autorisé." })
        else if (decodedToken) {
            (req as any).user = decodedToken
        }
        next()
    })
}