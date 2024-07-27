import express from "express"
import { newRoomRoute } from "./newRoom"
import { addMembersToRoomRoute } from "./addUsers"


export const initRoomRoutes = (app : express.Express) => {
   newRoomRoute(app)
   addMembersToRoomRoute(app)
}