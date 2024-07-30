import express from "express"
import { newRoomRoute } from "./newRoom"
import { addMembersToRoomRoute } from "./addUsers"
import { deleteRoomMember } from "./deleteUser"
import { deleteRoomRoute } from "./deleteRoom"
import { getRoomByIdRoute } from "./getRoomById"
import { getUserPublicRoomsRoute } from "./getUserPublicRooms"


export const initRoomRoutes = (app : express.Express) => {
   newRoomRoute(app)
   addMembersToRoomRoute(app)
   deleteRoomMember(app)
   deleteRoomRoute(app)
   getRoomByIdRoute(app)
   getUserPublicRoomsRoute(app)
}