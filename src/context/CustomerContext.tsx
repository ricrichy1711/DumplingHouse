import { createContext, useContext, useState, ReactNode } from 'react';
export interface Customer {
  email: string;
  name: string;
  role: 'customer' | 'seller';
  blocked?: boolean;
}

interface CustomerContextType {
  customers: Customer[];
  blockCustomer: (email: string) => void;
  unblockCustomer: (email: string) => void;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export const CustomerProvider = ({ children }: { children: ReactNode }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);

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
