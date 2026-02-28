import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/cn';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register' | 'recover'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [localError, setLocalError] = useState('');
  const [recoverSuccess, setRecoverSuccess] = useState(false);
  
  const { login, register, isLoading, error } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    try {
      if (mode === 'login') {
        const success = await login(email, password);
        if (success) {
          onClose();
          setEmail('');
          setPassword('');
          setMode('login');
        }
      } else if (mode === 'register') {
        const success = await register(name, email, password);
        if (success) {
          onClose();
          setEmail('');
          setPassword('');
          setName('');
          setMode('login');
        }
      } else if (mode === 'recover') {
        if (!email) {
          setLocalError('Por favor ingresa tu email');
          return;
        }
        setRecoverSuccess(true);
        setTimeout(() => {
          setRecoverSuccess(false);
          setMode('login');
          setEmail('');
        }, 3000);
      }
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Error desconocido');
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
                ? 'Únete a Dumpling House (tu rol se detectará automáticamente)'
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
                  disabled={isLoading}
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
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-400 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100 text-gray-900 placeholder-gray-500"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {mode === 'register' && (
                <p className="text-xs text-gray-500 mt-1">
                  💡 El sistema asigna cliente por defecto; solo el email del vendedor
                  pre‑registrado ({'vendedor@dumpling.com'}) se trata como vendedor.
                </p>
              )}
            </div>

            {mode !== 'recover' && (
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Contraseña</label>
                <input
                  type="password"
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-gray-400 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100 text-gray-900 placeholder-gray-500"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full py-4 bg-gradient-to-r from-red-600 to-red-800 text-white font-bold rounded-xl transition-opacity mt-6 shadow-lg shadow-red-700",
                isLoading ? "opacity-75 cursor-not-allowed" : "hover:opacity-90"
              )}
            >
              {isLoading ? 'Procesando...' : (mode === 'login' ? 'Iniciar Sesión' : mode === 'register' ? 'Registrarse' : 'Enviar enlace')}
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
                  disabled={isLoading}
                  className="block w-full text-red-400 font-medium hover:underline disabled:opacity-50 text-sm"
                >
                  ¿No tienes cuenta? Regístrate
                </button>
                <button
                  onClick={() => {
                    setMode('recover');
                    setLocalError('');
                  }}
                  disabled={isLoading}
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
                disabled={isLoading}
                className="text-red-400 font-medium hover:underline disabled:opacity-50 text-sm"
              >
                Volver a iniciar sesión
              </button>
            )}
          </div>

          {mode === 'register' && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-xs">
              <p className="font-semibold mb-1">📌 Cómo funciona la detección de rol:</p>
              <p className="mb-2">• Por defecto: Cliente</p>
              <p>• Contiene "seller-" o "admin-": Vendedor</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}