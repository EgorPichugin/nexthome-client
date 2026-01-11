import type { UserUpdateRequest } from './UserUpdateRequest';

export interface UserRegisterRequest extends UserUpdateRequest {
  password: string;
}