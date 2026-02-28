import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MenuItem } from '../types';
import { menuItems as initialItems } from '../data/menu';

interface MenuContextType {
  items: MenuItem[];
  addItem: (item: MenuItem) => void;
  updateItem: (updated: MenuItem) => void;
  removeItem: (id: number | string) => void;
  toggleAvailability: (id: number | string) => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<MenuItem[]>(() => [...initialItems]);

  const addItem = (item: MenuItem) => {
    setItems(prev => [...prev, item]);
  };

  const updateItem = (updated: MenuItem) => {
    setItems(prev => prev.map(i => (i.id === updated.id ? updated : i)));
  };

  const removeItem = (id: number | string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const toggleAvailability = (id: number | string) => {
    setItems(prev =>
      prev.map(i =>
        i.id === id ? { ...i, disabled: !i.disabled } : i
      )
    );
  };

  return (
    <MenuContext.Provider
      value={{ items, addItem, updateItem, removeItem, toggleAvailability }}
    >
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error('useMenu must be used within a MenuProvider');
  return ctx;
};
