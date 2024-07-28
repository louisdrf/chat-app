import express from "express"
import { initGetAllUsersRoute } from "./getAll"

export const initUsersRoutes = (app : express.Express) => {
    initGetAllUsersRoute(app)
 }