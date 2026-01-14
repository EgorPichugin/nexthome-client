import { type UserResponse } from '../Responses/UserResponse'

export interface UserLoginResponse {
  user: UserResponse;
  accessToken: string;
  
}