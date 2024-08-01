import api from '../axiosConfig'

export const getUserPendingFriendships = async() => {
    try {
        const username = localStorage.getItem('username')
        const response = await api.get(`/users/${username}/friendships/pending`)
        return response.data.friendships
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


export const getUserReceivedFriendships = async() => {
    try {
        const username = localStorage.getItem('username')
        const response = await api.get(`/users/${username}/friendships/received`)
        return response.data.friendships
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