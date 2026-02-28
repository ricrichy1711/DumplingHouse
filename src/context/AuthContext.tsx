import { useState, createContext, useContext, ReactNode, useEffect } from 'react';
import { supabase } from '../utils/supabase';

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
  const [isLoading, setIsLoading] = useState(false); // only true during login/register/logout ops
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // onAuthStateChange fires with INITIAL_SESSION immediately on mount
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || (event === 'TOKEN_REFRESHED' && !session)) {
        setUser(null);
        return;
      }
      if (session?.user) {
        await loadUserProfile(session.user.id, session.user.email || '');
      } else {
        setUser(null);
      }
    });

    // Auto-recover session when tab becomes visible again or internet reconnects
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible') {
        const { data } = await supabase.auth.getSession();
        if (data.session?.user) {
          await loadUserProfile(data.session.user.id, data.session.user.email || '');
        }
      }
    };

    const handleOnline = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        await loadUserProfile(data.session.user.id, data.session.user.email || '');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('online', handleOnline);

    return () => {
      subscription.unsubscribe();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  const loadUserProfile = async (userId: string, email: string) => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data) {
        setUser({
          id: userId,
          email,
          name: data.name || email.split('@')[0],
          role: (data.role as UserRole) || 'customer'
        });
      } else {
        // Profile not yet created by trigger — safe default
        setUser({ id: userId, email, name: email.split('@')[0], role: 'customer' });
      }
    } catch (e) {
      setUser({ id: userId, email, name: email.split('@')[0], role: 'customer' });
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setError('Email o contraseña incorrectos');
        return false;
      }

      if (data.user) {
        await loadUserProfile(data.user.id, data.user.email || '');
        return true;
      }
      return false;
    } catch (err) {
      setError('Error al iniciar sesión');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      // All new users are ALWAYS 'customer'. Role is set manually in Supabase Dashboard.
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name, role: 'customer' } }
      });

      if (error) {
        setError(error.message);
        return false;
      }

      if (data.session) {
        await loadUserProfile(data.user!.id, email);
      } else {
        setError('Registro exitoso. Revisa tu correo para confirmar tu cuenta.');
      }
      return true;
    } catch (err) {
      setError('Error al registrarse');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
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