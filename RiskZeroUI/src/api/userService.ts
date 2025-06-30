import type { AuthResponseDto, User, UserAuthDto } from "../types/userType";
import { api } from "./axiosConfig";
import { API_ENDPOINTS } from "./endpoints";
import { AxiosError } from "axios";

export const registerUser = async (userData: UserAuthDto): Promise<User | {message:string}> => {
  try {
    const response = await api.post<User>(API_ENDPOINTS.REGISTER, userData);
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    
    if (error instanceof AxiosError && error.response?.data?.message) {
      return { message: error.response.data.message };
    }
    
    return { message: 'Error al registrar el usuario. Por favor, intente de nuevo.' };
  }
}

export const loginUser = async (userData: UserAuthDto): Promise<AuthResponseDto | {message:string}> => {
  try {
    const response = await api.post<AuthResponseDto>(API_ENDPOINTS.LOGIN, userData);
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    
    if (error instanceof AxiosError && error.response?.data?.message) {
      return { message: error.response.data.message };
    }
    
    // Error genérico
    throw new Error('Error al iniciar sesión. Por favor, intente de nuevo.');
  }
}

