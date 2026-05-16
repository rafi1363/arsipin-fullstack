export type LoginRequest = {
  email: string;
  password: string;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

export type LoginResponse = {
  message: string;
  token: string;
  user: AuthUser;
};
