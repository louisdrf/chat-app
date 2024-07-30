import express from "express"
import { sendFriendDemandRoute } from "./sendDemand"
import { acceptFriendDemandRoute } from "./acceptDemand"


export const initFriendshipRoutes = (app : express.Express) => {
    sendFriendDemandRoute(app)
    acceptFriendDemandRoute(app)
}