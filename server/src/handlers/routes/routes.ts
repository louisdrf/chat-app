import express from "express"
import { initAuthRoutes } from "./auth/routes"
import { initRoomRoutes } from "./rooms/routes"

export const initRoutes = (app: express.Express) => {

    initAuthRoutes(app)
    initRoomRoutes(app)
}