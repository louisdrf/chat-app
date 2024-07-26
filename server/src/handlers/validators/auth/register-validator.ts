import Joi from "joi";


export const registerValidation = Joi.object<CreateUserValidationRequest>({

    email:    Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    pseudo:     Joi.string().min(1).max(50).required(),

}).options({ abortEarly: false })

export interface CreateUserValidationRequest {
    email:    string
    password: string
    pseudo:     string
}
