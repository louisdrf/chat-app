import express from "express"
import { initGetAllUsersRoute } from "./getAll"
import { deleteUserByIdRoute } from "./deleteById"

export const initUsersRoutes = (app : express.Express) => {
    initGetAllUsersRoute(app)
    deleteUserByIdRoute(app)
 }