export interface SimulatedUser {
  email: string;
  password: string; // Solo para demo local
  name: string;
  role: 'customer' | 'seller';
  sellerId?: string;
}

export const simulatedUsersDatabase: SimulatedUser[] = [
  {
    email: 'vendedor@dumpling.com',
    password: 'password123',
    name: 'Admin Dumpling House',
    role: 'seller',
    sellerId: 'dumpling-house-001'
  },
  {
    email: 'cliente@example.com',
    password: 'password123',
    name: 'Juan Cliente',
    role: 'customer'
  } // note: only one seller account exists in the simulated database

];

export function detectUserRole(email: string): 'customer' | 'seller' {
  // Only treat users explicitly defined in our simulated database as sellers.
  // This ensures no one can sign up arbitrarily as vendedor; the first/predefined
  // seller accounts are the only ones recognized.
  const simulatedUser = simulatedUsersDatabase.find(
    user => user.email.toLowerCase() === email.toLowerCase()
  );

  if (simulatedUser) {
    return simulatedUser.role;
  }

  // Default to customer for any address not in the database.
  return 'customer';
}

export function getSimulatedUser(email: string): SimulatedUser | undefined {
  return simulatedUsersDatabase.find(
    user => user.email.toLowerCase() === email.toLowerCase()
  );
}

export function verifyCredentials(email: string, password: string): boolean {
  const user = getSimulatedUser(email);
  if (!user) return false;
  return user.password === password;
}