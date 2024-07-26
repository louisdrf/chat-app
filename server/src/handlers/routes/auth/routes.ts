import express from "express"
import { registerRoutes } from "./register"
import { loginRoute } from "./login"

export const initAuthRoutes = (app : express.Express) => {
    registerRoutes(app)
    loginRoute(app)
}