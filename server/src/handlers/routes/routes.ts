import express from "express"
import { initAuthRoutes } from "./auth/routes"

export const initRoutes = (app: express.Express) => {

    initAuthRoutes(app)
}