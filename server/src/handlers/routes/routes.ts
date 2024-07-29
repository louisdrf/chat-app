import express from "express"
import { initAuthRoutes } from "./auth/routes"
import { initRoomRoutes } from "./rooms/routes"
import { initUsersRoutes } from "./users/routes"
import { initMessagesRoutes } from "./messages/routes"

export const initRoutes = (app: express.Express) => {

    initAuthRoutes(app)
    initRoomRoutes(app)
    initUsersRoutes(app)
    initMessagesRoutes(app)
}