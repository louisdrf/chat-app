import Joi from "joi";

export const deleteUserValidation = Joi.object<DeleteUserRequest>({

    username: Joi.string().min(1).required()

}).options({ abortEarly: false })

export interface DeleteUserRequest {
    username: string
}