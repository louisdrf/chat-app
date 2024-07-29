import express from "express"
import { deleteMessageRoute } from "./deleteById"
import { pinOrUnpinMessageRoute } from "./pinMessage"



export const initMessagesRoutes = (app : express.Express) => {
   deleteMessageRoute(app)
   pinOrUnpinMessageRoute(app)
}