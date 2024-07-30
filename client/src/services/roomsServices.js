import api from '../axiosConfig'

/**
 * create room then add target user to it
 * @param {*} username : target user for the private room
 * @returns 
 */
export const createPrivateRoom = async (username) => {

    if(!username) return

    const roomData = {
        name: username, // un salon privé portera le nom de l'utilisateur
        createdBy : localStorage.getItem("username"),
        isPrivate : true
    }
    try {
        const response = await api.post('/rooms', roomData)
        let roomResponseData = response.data.room
        // Un salon privé entre les deux utilisateurs existe déjà
        if (response.status === 200) {
            return roomResponseData

        } else {
            const response = await addMembersToRoom(roomResponseData.id, [username])
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