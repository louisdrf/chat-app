import express from "express"
import { deleteMessageRoute } from "./deleteById"



export const initMessagesRoutes = (app : express.Express) => {
   deleteMessageRoute(app)
}