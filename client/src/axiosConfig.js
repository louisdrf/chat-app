import axios from 'axios';
import { message } from 'antd';

const api = axios.create({
  baseURL: "http://localhost:3001/",  
  headers: {
    'Content-Type': 'application/json',
  }
})

api.interceptors.request.use(function (config) {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config

}, (error) => {
  return Promise.reject(error)
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

message.config({
  top: 70,
  duration: 2,
  maxCount: 3,
})


export default api