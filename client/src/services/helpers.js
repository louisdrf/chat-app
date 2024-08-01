export const formatTimeElapsed = (time) => {
    const now = new Date()
    const sentDate = new Date(time)
    const timeDiff = now - sentDate
    const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60))
    const daysDiff = Math.floor(hoursDiff / 24)
  
    if (daysDiff > 0) {
      return `Il y a ${daysDiff} jour${daysDiff > 1 ? 's' : ''}`
    }
    return `Il y a ${hoursDiff} heure${hoursDiff > 1 ? 's' : ''}`
  }