import Joi from "joi";

export const addMembersToRoomValidation = Joi.object<AddMembersToRoomRequest>({

    roomId:    Joi.number().required(),
    usernames: Joi.array().items(Joi.string().required()).min(1).required(),

}).options({ abortEarly: false })

export interface AddMembersToRoomRequest {
    roomId: number
    usernames: string[]
}