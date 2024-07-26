import Joi from "joi";

export const loginUserValidation = Joi.object<LoginUserValidationRequest>({

    email:    Joi.string().email().required(),
    password: Joi.string().required()

}).options({ abortEarly: false })

export interface LoginUserValidationRequest {
    email:    string
    password: string
}