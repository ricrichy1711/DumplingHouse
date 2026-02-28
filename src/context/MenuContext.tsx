import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { MenuItem } from '../types';

interface MenuContextType {
  items: MenuItem[];
  categories: string[];
  addItem: (item: MenuItem) => Promise<void>;
  updateItem: (updated: MenuItem) => Promise<void>;
  removeItem: (id: string | number) => Promise<void>;
  toggleAvailability: (id: string | number) => Promise<void>;
  addCategory: (name: string) => Promise<void>;
  removeCategory: (name: string) => Promise<void>;
  isLoading: boolean;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [dbCategories, setDbCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMenu = async () => {
    setIsLoading(true);
    try {
      const { data: itemsData } = await supabase
        .from('menu_items')
        .select('*')
        .order('sort_order', { ascending: true });

      const { data: catsData } = await supabase
        .from('menu_categories')
        .select('name')
        .order('sort_order', { ascending: true });

      if (itemsData) setItems(itemsData.map(i => ({ ...i, id: i.id.toString() })));
      if (catsData) setDbCategories(catsData.map(c => c.name));
    } catch (e) {
      console.error('Error fetching menu:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const categories = ['Todos', ...dbCategories];

  const addItem = async (item: MenuItem) => {
    const { data, error } = await supabase.from('menu_items').insert([item]).select();
    if (!error && data) {
      setItems(prev => [...prev, { ...data[0], id: data[0].id.toString() }]);
    }
  };

  const updateItem = async (updated: MenuItem) => {
    const { error } = await supabase.from('menu_items').update(updated).eq('id', updated.id);
    if (!error) {
      setItems(prev => prev.map(i => (i.id === updated.id ? updated : i)));
    }
  };

  const removeItem = async (id: string | number) => {
    const { error } = await supabase.from('menu_items').delete().eq('id', id);
    if (!error) {
      setItems(prev => prev.filter(i => i.id !== id));
    }
  };

  const toggleAvailability = async (id: string | number) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    const { error } = await supabase.from('menu_items').update({ disabled: !item.disabled }).eq('id', id);
    if (!error) {
      setItems(prev => prev.map(i => i.id === id ? { ...i, disabled: !i.disabled } : i));
    }
  };

  const addCategory = async (name: string) => {
    const { error } = await supabase.from('menu_categories').insert([{ name }]);
    if (!error) setDbCategories(prev => [...prev, name]);
  };

  const removeCategory = async (name: string) => {
    const { error } = await supabase.from('menu_categories').delete().eq('name', name);
    if (!error) setDbCategories(prev => prev.filter(c => c !== name));
  };

  return (
    <MenuContext.Provider
      value={{ items, categories, addItem, updateItem, removeItem, toggleAvailability, addCategory, removeCategory, isLoading }}
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
