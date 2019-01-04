import axios from 'axios'
import { User } from '../store/authentication/types'

export const cribReq = axios.create({
  baseURL: 'http://127.0.0.1:5000/'
})

export const authInspector = cribReq.interceptors.request.use((config: any) => {
  let userJson: string | null = localStorage.getItem('user')
  let user: User = userJson ? JSON.parse(userJson) : {}
  let headers = { 'Content-Type': 'application/json', ...config.headers }
  if (user && user.access_token) {
    headers = { Authorization: 'Bearer ' + user.access_token, ...headers }
  }
  config.headers = headers
  return config
}, (error: any) => { return Promise.reject(error) })

export const errorInterceptor = cribReq.interceptors.response.use(
  (response: any) => { return response },
  (error: any) => {
    if (error.response && error.response.data.msg) {
      error.message = error.response.data.msg
    }
    return Promise.reject(error)
  }
)
