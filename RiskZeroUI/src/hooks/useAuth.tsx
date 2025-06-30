import { createContext, useContext } from "react";
import type { User, UserAuthDto } from "../types/userType";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: UserAuthDto) => Promise<boolean>;
  logout: () => void;
  getUser: () => User | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};