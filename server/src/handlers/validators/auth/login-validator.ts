import Joi from "joi";

export const loginUserValidation = Joi.object<LoginUserValidationRequest>({

    username: Joi.string().required(),
    password: Joi.string().required()

}).options({ abortEarly: false })

export interface LoginUserValidationRequest {
    username: string
    password: string
}