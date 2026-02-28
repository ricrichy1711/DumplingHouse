import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Package, PackageOpen, Clock, CheckCircle, Truck, MapPin, Phone, CreditCard } from 'lucide-react';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserProfile({ isOpen, onClose }: UserProfileProps) {
  const { user, logout } = useAuth();
  const { orders } = useOrders();

  if (!user) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'preparing': return <PackageOpen className="w-5 h-5 text-orange-500" />;
      case 'pending': return <Clock className="w-5 h-5 text-gray-500" />;
      default: return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered': return 'Entregado';
      case 'preparing': return 'Preparando';
      case 'pending': return 'Pendiente';
      default: return status;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[80]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-full max-w-lg bg-[#0d0d0d] z-[90] flex flex-col overflow-hidden shadow-2xl border-l border-white/10"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-600/20 text-red-500 rounded-full flex items-center justify-center text-xl font-bold uppercase ring-2 ring-red-500/50">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-white text-lg">{user.name}</p>
                  <p className="text-gray-400 text-sm">{user.email}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition">
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <Package className="w-5 h-5 text-red-500" />
                Mi Historial de Pedidos
              </h3>

              {orders.length === 0 ? (
                <div className="bg-[#111] border border-white/5 rounded-2xl p-10 text-center">
                  <PackageOpen className="w-14 h-14 text-gray-600 mx-auto mb-4" />
                  <h4 className="text-lg font-bold text-white mb-1">Aún no tienes pedidos</h4>
                  <p className="text-gray-400 text-sm">Tus compras aparecerán aquí.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="bg-[#111] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors">
                      <div className="flex justify-between items-start gap-4 border-b border-white/5 pb-3 mb-3">
                        <div>
                          <div className="text-gray-400 text-xs font-mono mb-1">#{order.id.split('-')[0]}</div>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(order.status)}
                            <span className="font-bold text-white text-sm uppercase">{getStatusText(order.status)}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-red-500">${order.total}</div>
                          <div className="text-gray-400 text-xs">{order.items.length} artículos</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {order.items.slice(0, 2).map((item, idx) => (
                          <div key={idx} className="flex gap-3 items-center">
                            <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover bg-gray-900" />
                            <div className="flex-1">
                              <p className="font-bold text-sm text-gray-200">{item.name}</p>
                              <p className="text-red-400 text-xs">${item.price} x{item.quantity}</p>
                            </div>
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <p className="text-gray-500 text-xs">+{order.items.length - 2} más...</p>
                        )}
                      </div>

                      <div className="mt-3 pt-3 border-t border-white/5 space-y-1.5">
                        {order.deliveryType && (
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <Truck className="w-3 h-3 text-red-500" />
                            <span className="capitalize">{order.deliveryType}</span>
                          </div>
                        )}
                        {order.address && (
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <MapPin className="w-3 h-3 text-red-500" />
                            <span>{order.address}</span>
                          </div>
                        )}
                        {order.phone && (
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <Phone className="w-3 h-3 text-red-500" />
                            <span>{order.phone}</span>
                          </div>
                        )}
                        {order.paymentMethod && (
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <CreditCard className="w-3 h-3 text-red-500" />
                            <span>{order.paymentMethod}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10">
              <button
                onClick={() => { logout(); onClose(); }}
                className="w-full py-3 bg-white/5 hover:bg-red-600 text-white font-bold rounded-xl transition-all border border-white/10 hover:border-transparent"
              >
                Cerrar Sesión
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}