export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isPopular?: boolean;
  isVegetarian?: boolean;
  // whether the item is currently available for ordering
  disabled?: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface OrderFormData {
  name: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
  deliveryType: 'delivery' | 'pickup';
}

export type UserRole = 'customer' | 'seller';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Order {
  id: string;
  customerName: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'preparing' | 'delivered' | 'cancelled';
  date: string;
  deliveryType: 'delivery' | 'pickup';
  paymentMethod?: string;
  address?: string;
  phone?: string;
  scheduledTime?: string; // optional time, e.g. "14:30" or ISO string
}
