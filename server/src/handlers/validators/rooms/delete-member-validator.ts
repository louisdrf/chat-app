import Joi from "joi";

export const deleteUserValidation = Joi.object<DeleteUserRequest>({
    userId: Joi.number().required()
}).options({ abortEarly: false });

export interface DeleteUserRequest {
    userId: number;
}