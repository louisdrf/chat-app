import api from '../axiosConfig'

/**
 * create room then add target user to it
 * @param {*} username : target user for the private room
 * @returns 
 */
export const createPrivateRoom = async (username) => {

    if(!username) return

    const roomData = {
        name: username, // private room will have target username as name
        createdBy : localStorage.getItem("username"),
        isPrivate : true
    }
    try {
        const response = await api.post('/rooms', roomData)
        const roomResponseData = response.data.room
        if (response.status === 200) {
            // Un salon privé entre les deux utilisateurs existe déjà
            console.log(roomResponseData);
            return roomResponseData
        } else {
            await addMembersToRoom(roomResponseData.id, [username])
            console.log(roomResponseData);
            return roomResponseData
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
        await api.post(`/rooms/${roomId}`, { usernames : membersName })
        return
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