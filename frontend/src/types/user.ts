export interface User {
  id: number;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}
export interface CreateUserDto {
  email: string;
  password: string;
  role: string;
}

export interface UpdateUserDto {
  email?: string;
  password?: string;
  role?: string;
}