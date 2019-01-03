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
  }
}
