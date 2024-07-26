import express from "express"
import { registerRoutes } from "./register"

export const initAuthRoutes = (app : express.Express) => {
    registerRoutes(app)
}