import express from "express"
import { initGetAllUsersRoute } from "./getAll"
import { deleteUserByIdRoute } from "./deleteById"
import { getUserFriendsRoute } from "./getUserFriends"
import { initGetOnlineUsersRoute } from "./getOnlineUsers"

export const initUsersRoutes = (app : express.Express) => {
    initGetAllUsersRoute(app)
    deleteUserByIdRoute(app)
    getUserFriendsRoute(app)
    initGetOnlineUsersRoute(app)
}