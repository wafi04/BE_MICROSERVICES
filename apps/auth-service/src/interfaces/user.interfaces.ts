export interface User {
  username: string;
  password: string;
  id?: number;
  email?: string;
}

// You can add more interfaces here as needed
export interface LoginResponse {
  status: string;
  message: string;
  user?: User;
}

export interface CreateUserResponse {
  status: string;
  message: string;
  user?: User;
}
