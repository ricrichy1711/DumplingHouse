import { useState, createContext, useContext, ReactNode } from 'react';
import { detectUserRole, getSimulatedUser, verifyCredentials } from '../data/users';

export type UserRole = 'customer' | 'seller';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      if (!verifyCredentials(email, password)) {
        setError('Email o contraseña incorrectos');
        return false;
      }

      const role = detectUserRole(email);
      const simulatedUser = getSimulatedUser(email);
      const name = simulatedUser?.name || 'Usuario';

      setUser({
        id: Math.random().toString(),
        name,
        email,
        role
      });

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, _password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const simulatedUser = getSimulatedUser(email);
      if (simulatedUser) {
        setError('Este email ya está registrado');
        return false;
      }

      const role = detectUserRole(email);

      setUser({
        id: Math.random().toString(),
        name,
        email,
        role
      });

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al registrarse';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};