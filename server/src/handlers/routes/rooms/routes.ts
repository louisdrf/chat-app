import express from "express"
import { newRoomRoute } from "./newRoom"
import { addMembersToRoomRoute } from "./addUsers"
import { deleteRoomMember } from "./deleteUser"


export const initRoomRoutes = (app : express.Express) => {
   newRoomRoute(app)
   addMembersToRoomRoute(app)
   deleteRoomMember(app)
}