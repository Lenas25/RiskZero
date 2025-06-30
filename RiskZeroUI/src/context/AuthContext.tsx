import React, { useState, useEffect, type ReactNode } from "react";
import type { User, AuthResponseDto, UserAuthDto } from "../types/userType";
import { AuthContext } from "../hooks/useAuth";
import { loginUser } from "../api/userService";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

interface AuthProviderProps {
  children: ReactNode;
}

interface JwtPayload {
  exp: number;
  iat: number;
  id: string;
  email: string;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      try {
        const decodedToken: JwtPayload = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
          console.warn(
            "El token ha expirado, redirigiendo al login..."
          );
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          setIsAuthenticated(false);
          setUser(null);
          navigate("/login", { replace: true });
        } else {
          setIsAuthenticated(true);
          if (
            window.location.pathname === "/login" ||
            window.location.pathname === "/signup"
          ) {
            navigate("/", { replace: true });
          }
        }
      } catch {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setIsAuthenticated(false);
        setUser(null);
        navigate("/login", { replace: true });
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
    setLoading(false);
  }, [navigate]);

  const login = async (credentials: UserAuthDto): Promise<boolean> => {
    try {
      const response: AuthResponseDto = await loginUser(credentials);
      if (!response || !response.accessToken || !response.refreshToken) {
        throw new Error("Invalid login response");
      }
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      setIsAuthenticated(true);
      return true;
    } catch {
      setIsAuthenticated(false);
      setUser(null);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsAuthenticated(false);
    setUser(null);
    window.location.href = "/login";
  };

  const getUser = (): User | null => {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return {
        id: payload.id,
        email: payload.email,
      };
    } catch (error) {
      console.error("Failed to parse token", error);
      return null;
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    getUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
