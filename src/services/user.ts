import { cribReq } from '../utils'

export const userService = {
  login: (username: string, password: string) => {
    const config = {
      method: 'post',
      url: '/auth/login',
      data: { username, password }
    }
    return cribReq(config).then(response => {
      const tokens = response.data
      if (tokens.access_token) {
        localStorage.setItem('user', JSON.stringify(tokens))
      }
      return tokens
    })
  },
  logout: () => {
    localStorage.removeItem('user')
  },
  refresh: () => {
    let refreshtoken = ''
    const tokensjson = localStorage.getItem('user')
    if (tokensjson) {
      const tokens = JSON.parse(tokensjson)
      refreshtoken = tokens.refresh_token ? tokens.refresh_token : ''
    }
    const config = {
      method: 'post',
      url: '/auth/refresh',
      headers: { Authorization: 'Bearer ' + refreshtoken }
    }
    return cribReq(config).then(response => {
      const tokens = response.data
      tokens.refresh_token = refreshtoken
      if (tokens.access_token) {
        localStorage.setItem('user', JSON.stringify(tokens))
      }
      return tokens
    })

  }
}

let isAlreadyFetchingAccessToken = false
let subscribers: (() => void)[] = []

function onAccessTokenFetched () {
  subscribers = subscribers.filter(callback => callback())
}

function addSubscriber (callback: () => void) {
  subscribers.push(callback)
}

cribReq.interceptors.response.use(function (response) {
  return response
}, function (error) {
  const { config, response } = error
  const originalRequest = config

  if (response.status === 401) {
    if (originalRequest.baseURL + 'auth/refresh' === originalRequest.url) {
      isAlreadyFetchingAccessToken = false
      userService.logout()
      location.reload(true)
      return Promise.reject(error)
    }
    if (!isAlreadyFetchingAccessToken) {
      isAlreadyFetchingAccessToken = true
      userService.refresh().then(() => {
        isAlreadyFetchingAccessToken = false
        onAccessTokenFetched()
      })
    }

    const retryOriginalRequest = new Promise((resolve) => {
      delete originalRequest.headers['Authorization']
      addSubscriber(() => resolve(cribReq(originalRequest)))
    })
    return retryOriginalRequest
  }
  return Promise.reject(error)
})
