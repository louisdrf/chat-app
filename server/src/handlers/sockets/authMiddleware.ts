import jwt from 'jsonwebtoken';
import { Socket } from 'socket.io';
import { User } from '../../database/entities/user';
import { AppDataSource } from '../../database/database';

export const authMiddleware = async (socket: Socket, next: (err?: any) => void) => {
    const token = socket.handshake.query.token as string

    if (!token) {
        return next(new Error('Authentication error'))
    }

    jwt.verify(token, process.env.JWT_SECRET as string, async (err, decoded) => {
        if (err) {
            return next(new Error('Authentication error'))
        }

        if (!decoded || typeof decoded === 'string') {
            return next(new Error('Authentication error'))
        }

        const userRepo = AppDataSource.getRepository(User);
        const user = await userRepo.findOne({ where: { id: decoded.userId } })
        if (!user) {
            return next(new Error('User not found'))
        }

        (socket as any).user = user

        next()
    })
}
