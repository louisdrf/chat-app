import express from "express"
import { newRoomRoute } from "./newRoom"


export const initRoomRoutes = (app : express.Express) => {
   newRoomRoute(app)
}