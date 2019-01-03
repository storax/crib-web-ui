export interface AlertState {
  type: AlertType | null
  message: string
}

export enum AlertType {
  success = 'success',
  warning = 'warning',
  info = 'info',
  error = 'error'
}
