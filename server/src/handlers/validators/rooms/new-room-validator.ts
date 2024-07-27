import Joi from "joi";

export const roomValidation = Joi.object<CreateRoomValidationRequest>({
    roomName: Joi.string().required().min(1).max(30),
    isPrivate: Joi.boolean(),
    createdBy: Joi.object({
        username: Joi.string().required()
    }).required()
}).options({ abortEarly: false })

export interface CreateRoomValidationRequest {
    roomName: string
    isPrivate: boolean
    createdBy: {
        username: string
    }
}
