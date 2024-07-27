import Joi from "joi";

export const addMembersToRoomValidation = Joi.object<AddMembersToRoomRequest>({

    usernames: Joi.array().items(Joi.string().required()).min(1).required()

}).options({ abortEarly: false })

export interface AddMembersToRoomRequest {
    usernames: string[]
}