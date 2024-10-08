import api from '../axiosConfig'


export const createRoom = async (roomName, isPrivate) => {

    if(!roomName) return

    const roomData = {
        name: roomName, // un salon privé portera le nom de l'utilisateur
        createdBy : localStorage.getItem("username"),
        isPrivate : isPrivate
    }

    try {
        const response = await api.post('/rooms', roomData)
        let roomResponseData = response.data.room
        // Un salon privé entre les deux utilisateurs existe déjà
        if (response.status === 200) {
            return roomResponseData
        } 
        else {
            const response = await addMembersToRoom(roomResponseData.id, [roomName])
            return response.data.room
        }
      }
      catch (error) {
        console.error(error)
        if (error.response) {
            console.log('erreur serveur : ' , error.response.data);
            throw new Error(error.response.data.error)
        } else {
            throw new Error('Erreur réseau ou serveur.')
        }
    }
}

export const addMembersToRoom = async(roomId, membersName) => {
    if(membersName.length === 0 || !roomId) return

    try {
        const response = await api.post(`/rooms/${roomId}`, { usernames : membersName })
        return response
    }
    catch(error) {
        console.error(error);
        if (error.response) {
            console.log('erreur serveur : ' , error.response.data);
            throw new Error(error.response.data.error)
        } else {
            throw new Error('Erreur réseau ou serveur.')
        }
    }
}



export const getUserPublicRooms = async() => {
    try {
        const username = localStorage.getItem("username")
        const response = await api.get(`/rooms/public/${username}`)
        return response.data.rooms
    }
    catch(error) {
        console.error(error);
        if (error.response) {
            console.log('erreur serveur : ' , error.response.data);
            throw new Error(error.response.data.error)
        } else {
            throw new Error('Erreur réseau ou serveur.')
        }
    }
}