export interface User {
  access_token?: string
  refresh_token?: string
  username?: string
}

export interface AuthStatus {
  loggedIn?: boolean
  loggingIn?: boolean
}

export interface AuthState {
  status: AuthStatus
  user: User
}
