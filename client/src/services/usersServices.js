import api from '../axiosConfig'

export const getAllUsers = async () => {
    try {
        const response = await api.get('/users')
        return response.data.users
      }
      catch (error) {
        if (error.response) {
            console.log('erreur serveur : ' , error.response.data);
            throw new Error(error.response.data.error)
        } else {
            throw new Error('Erreur réseau ou serveur.')
        }
    }
}

export const getOnlineUsers = async () => {
    try {
        const response = await api.get('/users/online')
        return response.data.users
      }
      catch (error) {
        if (error.response) {
            console.log('erreur serveur : ' , error.response.data);
            throw new Error(error.response.data.error)
        } else {
            throw new Error('Erreur réseau ou serveur.')
        }
    }
}


export const getUserAllFriends = async () => {
    const username = localStorage.getItem("username")

    try {
        const response = await api.get(`/users/${username}/friends`)
        return response.data.friends
      }
      catch (error) {
        if (error.response) {
            console.log('erreur serveur : ' , error.response.data);
            throw new Error(error.response.data.error)
        } else {
            throw new Error('Erreur réseau ou serveur.')
        }
    }
}