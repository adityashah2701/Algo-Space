import axios from 'axios'
const token = localStorage.getItem('token')
export const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('tempToken')}`, // If needed
  },
})