import { type UserLoginRequest } from './UserLoginRequest'

export interface UserRegisterRequest extends UserLoginRequest {
  firstName: string
  lastName: string
}