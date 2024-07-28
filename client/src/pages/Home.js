import React, { useState } from "react"
import { ConversationComponent } from '../components/ConversationComponent'
import { InputMessageComponent } from '../components/InputMessageComponent'
import { Navbar } from '../components/Navbar'
import { createPrivateRoom } from "../services/roomsServices"
export const Home = () => {

    const [activeRoom, setActiveRoom] = useState(null)

    const onConversationClick = async (username) => {
        try {
            const room = await createPrivateRoom(username)
            setActiveRoom(room)
        } 
        catch (error) {
            console.error("Erreur lors de la création ou la récupération de la room privée :", error)
        }
    }
    
    return (
        <div>
            <Navbar onConversationClick={onConversationClick} />
            <h1>Home page</h1>
            {activeRoom && <ConversationComponent room={activeRoom} />}
            <InputMessageComponent/>
        </div>
    )
}