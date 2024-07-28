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