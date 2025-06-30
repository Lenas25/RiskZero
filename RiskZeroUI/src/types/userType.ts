export interface User {
  id?: number;
  email: string;
}

export interface UserAuthDto {
  email: string;
  password: string;
}

export interface AuthResponseDto {
  accessToken: string;
  refreshToken: string;
}