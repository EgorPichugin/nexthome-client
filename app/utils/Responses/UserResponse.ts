export interface UserResponse {
  userId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  country?: string;
  city?: string;
  isCompleted: boolean;
  avatarUrl?: string;
}