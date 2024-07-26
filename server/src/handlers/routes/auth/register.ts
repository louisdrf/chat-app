import express, { Request, Response } from "express"
import { AppDataSource } from "../../../database/database"
import { registerValidation } from "../../validators/auth/register-validator"
import { generateValidationErrorMessage } from "../../validators/validation-message"
import { hash } from "bcrypt"


export const registerRoutes = (app: express.Express) => {

    app.post('/auth/register', async(req: Request, res: Response) => {
        try {

            const validation = registerValidation.validate(req.body)
            if (validation.error) {
                res.status(400).send(generateValidationErrorMessage(validation.error.details))
                return
            }

            const registerRequest = validation.value
            const hashedPassword = await hash(registerRequest.password, 10)

            const userToCreate = {
                email : registerRequest.email,
                password : hashedPassword,
                pseudo : registerRequest.password
            }

            const userRepo = AppDataSource.getRepository('User')
            const user = await userRepo.save(userToCreate)

            res.status(201).send({
                message : "L'utilisateur a bien été créé.",
                user : user
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