import express from "express"
import { initGetAllUsersRoute } from "./getAll"
import { deleteUserByIdRoute } from "./deleteById"
import { getUserFriendsRoute } from "./getUserFriends"
import { initGetOnlineUsersRoute } from "./getOnlineUsers"
import { getUserPendingFriendshipsRoute } from "./getUserPendingFriendships"
import { getUserReceivedFriendshipsRoute } from "./getUserReceivedFriendships"
import { getFriendshipRoute } from "./getFriendship"

export const initUsersRoutes = (app : express.Express) => {
    initGetAllUsersRoute(app)
    deleteUserByIdRoute(app)
    getUserFriendsRoute(app)
    initGetOnlineUsersRoute(app)
    getUserPendingFriendshipsRoute(app)
    getUserReceivedFriendshipsRoute(app)
    getFriendshipRoute(app)
}