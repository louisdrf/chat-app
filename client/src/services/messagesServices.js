import api from '../axiosConfig'


export const deleteMessage = async(messageId) => {
    if(!messageId) return

    try {
        await api.delete(`/messages/${messageId}`)
    }
    catch(error) {
        console.error(error)
        if (error.response) {
            console.log('erreur serveur : ' , error.response.data);
            throw new Error(error.response.data.error)
        } else {
            throw new Error('Erreur réseau ou serveur.')
        }
    }
}


export const pinOrUnpinMessage = async(messageId) => {
    if(!messageId) return

    try {
        await api.put(`/messages/pin/${messageId}`)
    }
    catch(error) {
        console.error(error)
        if (error.response) {
            console.log('erreur serveur : ' , error.response.data);
            throw new Error(error.response.data.error)
        } else {
            throw new Error('Erreur réseau ou serveur.')
        }
    }
}