import api from '../axiosConfig'

export const login = async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials)
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('username', credentials.username)
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
        
        return response.data
      }
    } catch (error) {
        if (error.response) {
            throw new Error(`Erreur ${error.response.status}: ${error.response.data.message || 'Une erreur est survenue.'}`)
        } else {
            throw new Error('Erreur réseau ou serveur.')
        }
    }
}


export const register = async (credentials) => {
    try {
      const response = await api.post('/auth/register', credentials)
      if (response.data) {
        return response
      }
    } catch (error) {
        if (error.response) {
            throw new Error(`Erreur ${error.response.status}: ${error.response.data.message || 'Une erreur est survenue.'}`)
        } else {
            throw new Error('Erreur réseau ou serveur.')
        }
    }
  }