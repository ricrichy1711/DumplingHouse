import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabase';
import { cn } from '../utils/cn';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register' | 'recover'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [localError, setLocalError] = useState('');
  const [recoverSuccess, setRecoverSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, register, error } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('handleSubmit: starting login process');
    setLocalError('');
    setIsSubmitting(true);
    try {
      if (mode === 'login') {
        console.log('handleSubmit: calling login()');
        const success = await login(email, password);
        console.log('handleSubmit: login() returned', success);
        if (success) {
          onClose();
          setEmail('');
          setPassword('');
          setMode('login');
        }
      } else if (mode === 'register') {
        if (password !== confirmPassword) {
          setLocalError('Las contraseñas no coinciden');
          return;
        }
        const success = await register(name, email, password);
        if (success) {
          onClose();
          setEmail('');
          setPassword('');
          setConfirmPassword('');
          setName('');
          setMode('login');
        }
      } else if (mode === 'recover') {
        if (!email) {
          setLocalError('Por favor ingresa tu email');
          return;
        }
        await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin,
        });
        setRecoverSuccess(true);
        setTimeout(() => {
          setRecoverSuccess(false);
          setMode('login');
          setEmail('');
        }, 4000);
      }
    } catch (err) {
      console.log('handleSubmit: caught error', err);
      setLocalError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      console.log('handleSubmit: finally setting isSubmitting(false)');
      setIsSubmitting(false);
    }
  };

  const displayError = error || localError;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-[#0a0a0a] text-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <span className="text-5xl mb-4 inline-block">🥟</span>
            <h2 className="text-2xl font-bold text-red-300">
              {mode === 'login' ? 'Bienvenido de nuevo' : mode === 'register' ? 'Crea tu cuenta' : 'Recuperar contraseña'}
            </h2>
            <p className="text-gray-300 text-sm">
              {mode === 'login'
                ? 'Ingresa para acceder a tu panel'
                : mode === 'register'
                  ? 'Únete a Dumpling House'
                  : 'Te enviaremos un enlace para resetear tu contraseña'}
            </p>
          </div>

          {recoverSuccess && (
            <div className="mb-4 p-3 bg-green-800 border border-green-600 rounded-lg text-green-200 text-sm">
              ✓ Email de recuperación enviado. Revisa tu bandeja de entrada.
            </div>
          )}

          {displayError && (
            <div className="mb-4 p-3 bg-red-800 border border-red-600 rounded-lg text-red-200 text-sm">
              {displayError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Nombre completo</label>
                <input
                  type="text"
                  required
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100 text-gray-900 placeholder-gray-500"
                  placeholder="Tu nombre completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Email</label>
              <input
                type="email"
                required
                disabled={isSubmitting}
                className="w-full px-4 py-3 border border-gray-400 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100 text-gray-900 placeholder-gray-500"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {mode !== 'recover' && (
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Contraseña</label>
                <input
                  type="password"
                  required
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-gray-400 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100 text-gray-900 placeholder-gray-500"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            )}

            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1 mt-4">Confirmar Contraseña</label>
                <input
                  type="password"
                  required
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-gray-400 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100 text-gray-900 placeholder-gray-500"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "w-full py-4 bg-gradient-to-r from-red-600 to-red-800 text-white font-bold rounded-xl transition-opacity mt-6 shadow-lg shadow-red-700",
                isSubmitting ? "opacity-75 cursor-not-allowed" : "hover:opacity-90"
              )}
            >
              {isSubmitting ? 'Procesando...' : (mode === 'login' ? 'Iniciar Sesión' : mode === 'register' ? 'Registrarse' : 'Enviar enlace')}
            </button>
          </form>

          <div className="mt-6 text-center space-y-2">
            {mode === 'login' ? (
              <>
                <button
                  onClick={() => {
                    setMode('register');
                    setLocalError('');
                  }}
                  disabled={isSubmitting}
                  className="block w-full text-red-400 font-medium hover:underline disabled:opacity-50 text-sm"
                >
                  ¿No tienes cuenta? Regístrate
                </button>
                <button
                  onClick={() => {
                    setMode('recover');
                    setLocalError('');
                  }}
                  disabled={isSubmitting}
                  className="block w-full text-red-400 font-medium hover:underline disabled:opacity-50 text-sm"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setMode('login');
                  setLocalError('');
                  setRecoverSuccess(false);
                }}
                disabled={isSubmitting}
                className="text-red-400 font-medium hover:underline disabled:opacity-50 text-sm"
              >
                Volver a iniciar sesión
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}