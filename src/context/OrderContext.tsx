import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../utils/supabase';
import { Order } from '../types';
import { useAuth } from './AuthContext';

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Order) => Promise<void>;
  updateOrder: (order: Order) => Promise<void>;
  removeOrder: (id: string) => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { user } = useAuth();

  const fetchOrders = async () => {
    if (!user) {
      setOrders([]);
      return;
    }
    try {
      let query = supabase
        .from('orders')
        .select(`*, order_items(*)`)
        .order('created_at', { ascending: false });

      if (user.role !== 'seller') {
        query = query.eq('customer_id', user.id);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching orders:', error);
        return;
      }

      if (data) {
        setOrders(data.map(o => ({
          id: o.id,
          customerName: o.customer_name,
          total: o.total,
          status: o.status,
          date: new Date(o.created_at).toLocaleString('es-MX'),
          scheduledTime: o.scheduled_time || '',
          items: (o.order_items || []).map((i: any) => ({
            id: i.menu_item_id,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            image: i.image || '',
          })),
          deliveryType: o.delivery_type || 'pickup',
          paymentMethod: o.payment_method || '',
          address: o.address || '',
          phone: o.phone || '',
        })));
      }
    } catch (e) {
      console.error('Error fetching orders:', e);
    }
  };

  useEffect(() => {
    fetchOrders();

    // Real-time subscription for order status updates
    if (!user) return;

    let filterString = undefined;
    if (user.role !== 'seller') {
      filterString = `customer_id=eq.${user.id}`;
    }

    const channel = supabase
      .channel(`orders-realtime-${user.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'orders',
        filter: filterString
      }, () => {
        fetchOrders();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user?.id, user?.role]);

  const addOrder = async (order: Order) => {
    try {
      const { data: orderData, error } = await supabase
        .from('orders')
        .insert([{
          customer_id: user?.id || null,
          customer_name: order.customerName,
          total: order.total,
          status: order.status || 'pending',
          delivery_type: order.deliveryType,
          payment_method: order.paymentMethod,
          address: order.address,
          phone: order.phone,
          scheduled_time: order.scheduledTime,
        }])
        .select()
        .single();

      if (error || !orderData) {
        console.error('Error creating order:', error);
        return;
      }

      // Insert order items
      if (order.items?.length > 0) {
        const itemsToInsert = order.items.map(item => ({
          order_id: orderData.id,
          menu_item_id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        }));
        await supabase.from('order_items').insert(itemsToInsert);
      }

      await fetchOrders();
    } catch (e) {
      console.error('Error creating order:', e);
    }
  };

  const updateOrder = async (order: Order) => {
    try {
      await supabase
        .from('orders')
        .update({ status: order.status })
        .eq('id', order.id);
      setOrders(prev => prev.map(o => o.id === order.id ? order : o));
    } catch (e) {
      console.error('Error updating order:', e);
    }
  };

  const removeOrder = async (id: string) => {
    try {
      await supabase.from('orders').delete().eq('id', id);
      setOrders(prev => prev.filter(o => o.id !== id));
    } catch (e) {
      console.error('Error removing order:', e);
    }
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrder, removeOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrders must be used within an OrderProvider');
  return context;
};
