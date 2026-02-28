import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SimulatedUser } from '../data/users';
import { simulatedUsersDatabase } from '../data/users';

export interface Customer extends SimulatedUser {
  blocked?: boolean;
}

interface CustomerContextType {
  customers: Customer[];
  blockCustomer: (email: string) => void;
  unblockCustomer: (email: string) => void;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export const CustomerProvider = ({ children }: { children: ReactNode }) => {
  const initial: Customer[] = simulatedUsersDatabase
    .filter(u => u.role === 'customer')
    .map(u => ({ ...u, blocked: false }));

  const [customers, setCustomers] = useState<Customer[]>(initial);

  const blockCustomer = (email: string) => {
    setCustomers(prev =>
      prev.map(c => (c.email === email ? { ...c, blocked: true } : c))
    );
  };
  const unblockCustomer = (email: string) => {
    setCustomers(prev =>
      prev.map(c => (c.email === email ? { ...c, blocked: false } : c))
    );
  };

  return (
    <CustomerContext.Provider value={{ customers, blockCustomer, unblockCustomer }}>
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomers = () => {
  const ctx = useContext(CustomerContext);
  if (!ctx) throw new Error('useCustomers must be used within a CustomerProvider');
  return ctx;
};
