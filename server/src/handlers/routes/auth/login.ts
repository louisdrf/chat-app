import express, { Request, Response } from "express";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { generateValidationErrorMessage } from "../../validators/validation-message";
import { AppDataSource } from "../../../database/database";
import { User } from "../../../database/entities/user";
import { loginUserValidation } from "../../validators/auth/login-validator";
import { Token } from "../../../database/entities/token";

export const loginRoute = (app: express.Express) => {
    app.post('/auth/login', async (req: Request, res: Response) => {
        try {
            // validate user credentials body
            const loginValidationResult = loginUserValidation.validate(req.body)
            if (loginValidationResult.error) {
                res.status(400).send(generateValidationErrorMessage(loginValidationResult.error.details))
                return
            }
            const loginUserRequest = loginValidationResult.value

            // check if user exists
            const user = await AppDataSource.getRepository(User).findOne({
                where: { email: loginUserRequest.email },
                relations: ["token"]
            })
            if (!user) {
                res.status(400).send({ error: "Identifiants incorrects." })
                return
            }

            // check sent password
            const isValid = await compare(loginUserRequest.password, user.password)
            if (!isValid) {
                res.status(400).send({ error: "Identifiants incorrects." })
                return
            }

            // set a new token for user and save it
            const secret = process.env.JWT_SECRET ?? ""
            const tokenValue = sign(
                {
                    userId: user.id,
                    email: user.email
                },
                secret, { expiresIn: '1d' }
            );

            let token = user.token
            if (token) {
                token.token = tokenValue
            } else {
                token = new Token(tokenValue, user)
                user.token = token
            }

            await AppDataSource.getRepository(Token).save(token)
            await AppDataSource.getRepository(User).save(user)

            res.status(200).json({ token: tokenValue })

        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Une erreur interne est survenue. Veuillez réessayer plus tard." })
            return
        }
    })
}
