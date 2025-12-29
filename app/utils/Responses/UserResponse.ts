export enum EStatus {
  Student = 1,
  Employer = 2,
  Other = 3,
}

export interface UserResponse {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  country: string;
  city: string;
  status?: EStatus | null;
  immigrationDate?: Date | null;
}