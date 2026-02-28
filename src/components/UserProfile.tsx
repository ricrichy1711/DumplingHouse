import { useAuth } from '../context/AuthContext';

export function UserProfile() {
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <div className="bg-red-900 text-white p-6 mt-20">
      <h2 className="text-2xl font-bold mb-4 text-red-300">Perfil de Usuario</h2>
      <p><strong>Nombre:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Rol:</strong> {user.role}</p>
      <button
        onClick={logout}
        className="mt-4 bg-red-600 px-4 py-2 rounded hover:bg-red-700"
      >Cerrar sesión</button>
    </div>
  );
}