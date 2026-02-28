import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Order } from '../types';

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrder: (order: Order) => void;
  removeOrder: (id: string) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD-001',
      customerName: 'Juan Pérez',
      total: 25.5,
      status: 'pending',
      date: '2024-05-20 14:30',
      scheduledTime: '14:30',
      items: [],
      deliveryType: 'delivery',
      paymentMethod: 'Efectivo',
      address: 'Calle Falsa 123',
      phone: '+52 644 123 4567'
    },
    {
      id: 'ORD-002',
      customerName: 'Maria Garcia',
      total: 42.0,
      status: 'preparing',
      date: '2024-05-20 14:45',
      scheduledTime: '15:00',
      items: [],
      deliveryType: 'pickup',
      paymentMethod: 'Tarjeta',
      address: '',
      phone: '+52 644 765 4321'
    }
  ]);

  const addOrder = (order: Order) => setOrders(prev => [...prev, order]);
  const updateOrder = (order: Order) =>
    setOrders(prev => {
      const result = prev.map(o => (o.id === order.id ? order : o));
      // side effects based on status change
      if (order.status === 'delivered') {
        console.log(`Order ${order.id} marked as delivered`);
        // further actions could be triggered here (notifications, analytics, etc.)
      } else if (order.status === 'cancelled') {
        console.log(`Order ${order.id} was cancelled`);
      }
      return result;
    });
  const removeOrder = (id: string) => setOrders(prev => prev.filter(o => o.id !== id));

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrder, removeOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrders must be used within an OrderProvider');
  return ctx;
};
