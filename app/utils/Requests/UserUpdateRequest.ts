import type { UserLoginRequest } from "./UserLoginRequest";

export interface UserUpdateRequest {
    firstName: string;
    lastName: string;
    country: string;
    city: string;
}