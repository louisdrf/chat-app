import Joi from "joi";

export const roomValidation = Joi.object<CreateRoomValidationRequest>({

    name: Joi.string().required().min(1).max(30),
    isPrivate: Joi.boolean(),
    createdBy: Joi.string().required().required()

}).options({ abortEarly: false })

export interface CreateRoomValidationRequest {
    name: string
    isPrivate: boolean
    createdBy: string
}
