import type { UserLoginRequest } from "./UserLoginRequest";

export interface UserUpdateRequest {
    email: string;  
    firstName: string;
    lastName: string;
    country: string;
    city: string;
    status?: number | null;
    immigrationDate?: Date | null;
}