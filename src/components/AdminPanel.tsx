import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCw, Eye, EyeOff, Trash2, Maximize2 } from 'lucide-react';
import { cn } from '../utils/cn';
import { useSiteConfig } from '../context/SiteConfigContext';
import { useAuth } from '../context/AuthContext';
import { useMenu } from '../context/MenuContext';
import { useOrders } from '../context/OrderContext';
import { useCustomers } from '../context/CustomerContext';
import { MenuItem } from '../types';
import { SitePreview } from './SitePreview';

export function AdminPanel() {
  const { config, setConfig, isPublishing } = useSiteConfig();
  const { logout } = useAuth();
  const { items, categories, addItem, updateItem, removeItem, toggleAvailability, addCategory, removeCategory } = useMenu();
  const { orders, updateOrder } = useOrders();
  const { customers, blockCustomer, unblockCustomer } = useCustomers();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'menu' | 'customers' | 'orders' | 'editInicio'>('dashboard');
  const [editedConfig, setEditedConfig] = useState(config);
  const [navOpen, setNavOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);

  const [currentSection, setCurrentSection] = useState<'hero' | 'menu' | 'banner' | 'about' | 'footer' | 'design' | 'preview' | 'backgrounds' | null>('preview');
  const [showSuccess, setShowSuccess] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderImageInput = (key: keyof typeof config, placeholder: string, id: string) => (
    <div className="flex gap-2 items-center">
      {(editedConfig[key] as string)?.startsWith('data:') ? (
        <div className="flex-1 bg-green-900/20 border border-green-500/30 rounded-xl px-4 py-3 text-[10px] text-green-400 font-bold flex items-center truncate">
          ✓ ARCHIVO LOCAL CARGADO
        </div>
      ) : (
        <input type="text" value={(editedConfig[key] as string) || ''} onChange={e => setEditedConfig({ ...editedConfig, [key]: e.target.value })} className="flex-1 bg-black border border-white/5 rounded-xl px-4 py-3 text-[10px] text-gray-400 focus:border-red-600 outline-none transition-all" placeholder={placeholder} />
      )}
      <button onClick={() => document.getElementById(id)?.click()} className="px-5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/5 transition-all h-[38px]">Subir</button>
      {(editedConfig[key] as string) && (
        <button onClick={() => setEditedConfig({ ...editedConfig, [key]: '' })} className="w-[38px] h-[38px] flex items-center justify-center bg-red-600/20 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all shrink-0"><Trash2 className="w-4 h-4" /></button>
      )}
      <input id={id} type="file" className="hidden" accept="image/*" onChange={e => handleImageUpload(e, (url) => setEditedConfig({ ...editedConfig, [key]: url }))} />
    </div>
  );

  const getImgStyle = (key: keyof typeof config) => {
    const scale = (editedConfig[`${key}Scale` as keyof typeof config] as number) || 1;
    const posX = (editedConfig[`${key}PositionX` as keyof typeof config] as number) ?? 50;
    const posY = (editedConfig[`${key}PositionY` as keyof typeof config] as number) ?? 50;
    const rotate = (editedConfig[`${key}Rotate` as keyof typeof config] as number) || 0;
    return {
      objectPosition: `${posX}% ${posY}%`,
      transform: `scale(${scale}) rotate(${rotate}deg)`
    };
  };



  const renderImageControls = (key: keyof typeof config) => {
    if (!editedConfig[key]) return null;

    const scaleKey = `${key}Scale` as keyof typeof config;
    const posXKey = `${key}PositionX` as keyof typeof config;
    const posYKey = `${key}PositionY` as keyof typeof config;

    const currentScale = (editedConfig[scaleKey] as number) || 1;
    const currentX = (editedConfig[posXKey] as number) !== undefined ? (editedConfig[posXKey] as number) : 50;
    const currentY = (editedConfig[posYKey] as number) !== undefined ? (editedConfig[posYKey] as number) : 50;

    return (
      <details className="mt-4 group border border-white/5 rounded-xl bg-black/40 overflow-hidden outline-none">
        <summary className="text-[9px] font-black uppercase text-white/50 tracking-widest p-4 cursor-pointer hover:bg-white/5 hover:text-white transition-all list-none flex items-center justify-between outline-none select-none">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            Ajustar Imagen (Opcional)
          </div>
          <span className="text-white/30 group-open:rotate-180 transition-transform">▼</span>
        </summary>
        <div className="p-4 pt-2 space-y-6">
          <div className="flex items-start justify-between">
            <span className="text-[9px] font-black text-white/50 uppercase tracking-widest mt-2">Escala (Zoom)</span>
            <div className="flex flex-wrap gap-1 justify-end max-w-[180px]">
              {[0.5, 0.75, 1, 1.5].map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={(e) => { e.preventDefault(); setEditedConfig({ ...editedConfig, [scaleKey]: s }); }}
                  className={`w-10 h-8 rounded-lg text-[9px] font-black transition-all ${currentScale === s ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}
                >
                  {s * 100}%
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-[9px] text-white/50 font-black uppercase"><span className="tracking-widest">Horizontal (X)</span> <span>{currentX}%</span></div>
              <input type="range" min="0" max="100" value={currentX} onChange={e => setEditedConfig({ ...editedConfig, [posXKey]: parseInt(e.target.value) })} className="w-full accent-red-600 h-1.5 bg-white/10 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-red-500 [&::-webkit-slider-thumb]:rounded-full cursor-pointer hover:[&::-webkit-slider-thumb]:scale-125 transition-all" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[9px] text-white/50 font-black uppercase"><span className="tracking-widest">Vertical (Y)</span> <span>{currentY}%</span></div>
              <input type="range" min="0" max="100" value={currentY} onChange={e => setEditedConfig({ ...editedConfig, [posYKey]: parseInt(e.target.value) })} className="w-full accent-red-600 h-1.5 bg-white/10 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-red-500 [&::-webkit-slider-thumb]:rounded-full cursor-pointer hover:[&::-webkit-slider-thumb]:scale-125 transition-all" />
            </div>
          </div>
        </div>
      </details>
    );
  };


  // Sync edited config when entering the tab
  useEffect(() => {
    if (activeTab === 'editInicio') {
      setEditedConfig({ ...config });
    }
  }, [activeTab, config]);

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    c.email.toLowerCase().includes(customerSearch.toLowerCase())
  );

  const ordersToPrepare = orders
    .filter(o => o.status === 'pending' || o.status === 'preparing')
    .sort((a, b) => {
      const ta = a.scheduledTime || a.date;
      const tb = b.scheduledTime || b.date;
      return ta.localeCompare(tb);
    });

  const ordersHistory = orders.filter(o => o.status !== 'pending' && o.status !== 'preparing');

  const stats = {
    totalSales: orders.reduce((sum, o) => sum + o.total, 0),
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    totalProducts: items.length
  };

  const MenuForm = ({
    item,
    onSave,
    onCancel
  }: {
    item: MenuItem | null;
    onSave: (it: MenuItem) => void;
    onCancel: () => void;
  }) => {
    const [form, setForm] = useState<MenuItem>(
      item || {
        id: Date.now(),
        name: '',
        description: '',
        price: 0,
        image: '',
        category: '',
      }
    );

    useEffect(() => {
      if (item) {
        setForm(item);
      } else {
        setForm({
          id: Date.now(),
          name: '',
          description: '',
          price: 0,
          image: '',
          category: '',
        });
      }
    }, [item]);

    const handleChange = (key: keyof MenuItem, value: any) => {
      setForm(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = () => {
      onSave(form);
    };

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Nombre</label>
          <input
            type="text"
            value={form.name}
            onChange={e => handleChange('name', e.target.value)}
            className="w-full px-4 py-2 border border-gray-700 rounded bg-gray-800 text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Descripción</label>
          <textarea
            value={form.description}
            onChange={e => handleChange('description', e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-700 rounded bg-gray-800 text-white"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Precio</label>
            <input
              type="number"
              value={form.price}
              onChange={e => handleChange('price', parseFloat(e.target.value))}
              className="w-full px-4 py-2 border border-gray-700 rounded bg-gray-800 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Categoría</label>
            <input
              type="text"
              value={form.category}
              onChange={e => handleChange('category', e.target.value)}
              className="w-full px-4 py-2 border border-gray-700 rounded bg-gray-800 text-white"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Imagen (URL)</label>
          <input
            type="text"
            value={form.image}
            onChange={e => handleChange('image', e.target.value)}
            className="w-full px-4 py-2 border border-gray-700 rounded bg-gray-800 text-white"
          />
        </div>
        <div className="flex gap-4 justify-end">
          <button onClick={onCancel} className="px-4 py-2 border border-gray-700 rounded text-gray-300">Cancelar</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-red-600 text-white rounded">Guardar</button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white pb-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="fixed top-0 left-0 right-0 bg-black z-50 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setNavOpen(!navOpen)}
              className="p-2 text-white hover:text-red-500"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <a href="/" className="flex items-center gap-2">
              <img src="/logo.jpg" alt="Logo" className="h-10 w-10 object-contain" />
              <span className="text-2xl font-bold text-red-500 italic tracking-tighter">DUMPLING</span>
            </a>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={logout}
              className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700"
            >
              Cerrar sesión
            </button>
            <div className="bg-red-500/10 text-red-500 border border-red-500/20 px-4 py-2 rounded-lg font-black uppercase text-xs tracking-widest">
              Panel de Control
            </div>
          </div>
        </div>
      </div>

      <div className="h-24" />

      {navOpen && (
        <div className="fixed inset-0 top-20 bg-black/95 backdrop-blur-xl z-40 flex flex-col p-8 sm:hidden animate-in fade-in zoom-in duration-200">
          <div className="flex flex-col gap-4">
            {['dashboard', 'orders', 'menu', 'customers', 'editInicio'].map(tab => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab as any); setNavOpen(false); }}
                className={`text-2xl font-black italic tracking-tighter text-left py-4 border-b border-white/5 ${activeTab === tab ? 'text-red-500' : 'text-gray-500'}`}
              >
                {tab === 'editInicio' ? 'EDIT INICIO' : tab.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Desktop Tabs */}
        <div className="hidden sm:flex gap-4 mb-10 border-b border-white/5">
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'orders', label: 'Pedidos' },
            { id: 'menu', label: 'Menú' },
            { id: 'customers', label: 'Clientes' },
            { id: 'editInicio', label: 'EDIT INICIO', premium: true }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-4 px-6 font-bold transition-all relative ${activeTab === tab.id ? 'text-red-500' : 'text-gray-500 hover:text-gray-300'}`}
            >
              {tab.label}
              {tab.premium && <span className="ml-2 bg-red-600 text-white text-[8px] px-1 py-0.5 rounded-full uppercase tracking-tighter vertical-align-middle">Live</span>}
              {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-500 rounded-t-full shadow-[0_-4px_10px_rgba(239,68,68,0.5)]" />}
            </button>
          ))}
        </div>

        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Ingresos Totales', value: `€${stats.totalSales.toFixed(2)}`, color: 'text-white' },
                { label: 'Pedidos Pendientes', value: stats.pendingOrders, color: 'text-red-500' },
                { label: 'Productos en Menú', value: stats.totalProducts, color: 'text-white' }
              ].map((stat, i) => (
                <div key={i} className="bg-white/5 p-8 rounded-3xl border border-white/5 hover:border-white/10 transition-colors">
                  <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className={`text-4xl font-black italic tracking-tighter ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white/5 rounded-3xl border border-white/5 overflow-hidden">
                <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                  <h2 className="text-xl font-black italic tracking-tighter text-white">ÚLTIMOS PEDIDOS</h2>
                </div>
                <div className="divide-y divide-white/5">
                  {orders.length > 0 ? orders.slice(0, 5).map(order => (
                    <div key={order.id} className="p-6 hover:bg-white/5 transition-colors group">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{order.id}</span>
                          <h3 className="font-bold text-white group-hover:text-red-500 transition-colors">{order.customerName}</h3>
                        </div>
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                          order.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                            order.status === 'preparing' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                              'bg-green-500/10 text-green-500 border border-green-500/20'
                        )}>
                          {order.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 font-medium">{order.date} • {order.deliveryType}</span>
                        <span className="font-black text-white">€{order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  )) : (
                    <div className="p-12 text-center text-gray-600 font-bold uppercase tracking-widest">Sin pedidos aún</div>
                  )}
                </div>
              </div>

              <div className="bg-white/5 rounded-3xl border border-white/5 overflow-hidden">
                <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                  <h2 className="text-xl font-black italic tracking-tighter text-white">INVENTARIO RÁPIDO</h2>
                </div>
                <div className="divide-y divide-white/5 max-h-[400px] overflow-y-auto scrollbar-elegant">
                  {items.map(product => (
                    <div key={product.id} className="p-4 flex gap-4 items-center group hover:bg-white/5">
                      <img src={product.image} className="w-12 h-12 rounded-2xl object-cover border border-white/5 group-hover:scale-110 transition-transform" alt="" />
                      <div className="flex-1">
                        <h4 className="font-bold text-white text-sm">{product.name}</h4>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">€{product.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'editInicio' && (
          <div className="bg-[#0a0a0a] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl h-[78vh] flex animate-in zoom-in-95 duration-500">
            <aside className="w-72 bg-black border-r border-white/5 flex flex-col pt-10">
              <div className="px-8 mb-10">
                <h3 className="text-2xl font-black text-white italic tracking-tighter leading-none mb-1">EDITAR <span className="text-red-600 not-italic">INICIO</span></h3>
                <p className="text-[9px] text-gray-600 uppercase tracking-widest font-black underline decoration-red-600 underline-offset-4">Panel de Personalización</p>
              </div>
              <nav className="flex-1 space-y-1 px-4 overflow-y-auto scrollbar-none">
                {[
                  { id: 'hero', label: 'EDITAR HERO', icon: '🏠' },
                  { id: 'menu', label: 'EDITAR MENÚ', icon: '📜' },
                  { id: 'banner', label: 'EDITAR BANNER', icon: '👨‍🍳' },
                  { id: 'about', label: 'EDITAR HISTORIA', icon: 'ℹ️' },
                  { id: 'footer', label: 'EDITAR DATOS', icon: '🔗' },
                  { id: 'backgrounds', label: 'EDITAR FONDOS', icon: '🖼️' },
                  { id: 'design', label: 'LOGO Y TEMA', icon: '🎨' },
                ].map(sec => (
                  <button
                    key={sec.id}
                    onClick={() => setCurrentSection(sec.id as any)}
                    className={`w-full flex items-center gap-4 px-6 py-5 rounded-2xl transition-all ${currentSection === sec.id ? 'bg-red-600 text-white shadow-xl shadow-red-600/20' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
                  >
                    <span className="text-xl grayscale group-hover:grayscale-0">{sec.icon}</span>
                    <span className="text-[11px] font-black uppercase tracking-widest">{sec.label}</span>
                  </button>
                ))}

                <div className="pt-4 border-t border-white/5 mt-4">
                  <button
                    onClick={() => setCurrentSection('preview')}
                    className={`w-full flex items-center gap-4 px-6 py-5 rounded-2xl transition-all ${currentSection === 'preview' ? 'bg-white text-black shadow-xl' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
                  >
                    <span className="text-xl">👁️</span>
                    <span className="text-[11px] font-black uppercase tracking-widest">VER VISTA PREVIA</span>
                  </button>
                </div>
              </nav>
              <div className="p-8 border-t border-white/5 bg-white/[0.01]">
                <button
                  onClick={async () => {
                    await setConfig(editedConfig);
                    setShowSuccess(true);
                    setTimeout(() => setShowSuccess(false), 3000);
                  }}
                  disabled={isPublishing}
                  className={`w-full ${isPublishing ? 'bg-gray-700' : 'bg-red-600 hover:bg-red-700'} text-white font-black py-4 rounded-2xl shadow-xl shadow-red-600/30 transition-all active:scale-95 uppercase tracking-widest text-xs flex items-center justify-center gap-3 relative overflow-hidden`}
                >
                  <AnimatePresence>
                    {showSuccess && (
                      <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '-100%' }}
                        className="absolute inset-0 bg-green-600 flex items-center justify-center gap-2"
                      >
                        <span className="text-xl">✅</span>
                        ¡PUBLICADO!
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {isPublishing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Publicando...
                    </>
                  ) : (
                    'Publicar Cambios'
                  )}
                </button>
              </div>
            </aside>

            <main className="flex-1 overflow-y-auto bg-[#050505] p-12 scrollbar-elegant">
              {currentSection === 'preview' ? (
                <div className="h-full space-y-8 animate-in fade-in zoom-in-95 duration-700">
                  <header className="flex justify-between items-center bg-white/5 p-6 rounded-3xl border border-white/5">
                    <div>
                      <h4 className="text-2xl font-black italic tracking-tighter text-white uppercase leading-none mb-1">Página en Vivo</h4>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest underline decoration-red-600 underline-offset-4">Live Preview Engine</p>
                    </div>
                    <div className="flex items-center gap-4 bg-black/40 px-4 py-2 rounded-xl border border-white/10">
                      <span className="text-[10px] font-bold text-gray-500">RESOLUCIÓN ESTIMADA: 1920x1080</span>
                      <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                    </div>
                  </header>
                  <div className="h-[calc(100%-100px)] relative bg-black rounded-[3rem] p-4 border border-white/5 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] overflow-hidden">
                    <SitePreview config={editedConfig} menuItems={items} />
                  </div>
                </div>
              ) : !currentSection ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-40">
                  <div className="w-32 h-32 bg-red-600/10 rounded-full flex items-center justify-center border border-red-600/20">
                    <span className="text-6xl animate-pulse">✨</span>
                  </div>
                  <div>
                    <h4 className="text-3xl font-black italic tracking-tighter text-white mb-2 uppercase">Centro de Mando</h4>
                    <p className="text-gray-500 max-w-xs mx-auto text-sm font-medium leading-relaxed">Personaliza cada rincón de tu sitio web con previsualización en tiempo real.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-500">
                  <header className="flex justify-between items-end border-b border-white/5 pb-8">
                    <div>
                      <h4 className="text-4xl font-black italic tracking-tighter text-white uppercase mb-1">{currentSection}</h4>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Editando en vivo</span>
                      </div>
                    </div>
                  </header>

                  {currentSection === 'hero' && (
                    <div className="grid grid-cols-1 xl:grid-cols-5 gap-12">
                      <div className="xl:col-span-3 space-y-8">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Título de Impacto</label>
                          <input type="text" value={editedConfig.heroTitle} onChange={e => setEditedConfig({ ...editedConfig, heroTitle: e.target.value })} className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-5 text-white focus:border-red-600 focus:bg-white/[0.05] outline-none transition-all font-black italic text-xl tracking-tight" />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Palabra Clave (Color Rojo)</label>
                          <input type="text" value={editedConfig.heroHighlight} onChange={e => setEditedConfig({ ...editedConfig, heroHighlight: e.target.value })} className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-5 text-red-600 focus:border-red-600 focus:bg-white/[0.05] outline-none transition-all font-black italic text-xl tracking-tight" />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Mensaje de Bienvenida</label>
                          <textarea rows={5} value={editedConfig.heroText} onChange={e => setEditedConfig({ ...editedConfig, heroText: e.target.value })} className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-5 text-gray-300 focus:border-red-600 focus:bg-white/[0.05] outline-none transition-all text-sm leading-relaxed" />
                        </div>
                      </div>
                      <div className="xl:col-span-2 space-y-8">
                        <div className="space-y-4">
                          <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Imagen de Fondo (Sección Hero)</label>

                          {editedConfig.heroBgImage ? (
                            <div className="relative rounded-[2.5rem] overflow-hidden aspect-video border border-white/5 shadow-2xl ring-1 ring-white/10 transition-all duration-500">
                              <img src={editedConfig.heroBgImage} className="w-full h-full object-cover transition-all" style={{ ...getImgStyle('heroBgImage'), opacity: editedConfig.heroBgImageHidden ? 0.2 : 0.6 }} />
                              <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />

                              <div className="absolute top-4 right-4 flex flex-wrap gap-2 z-30">
                                <button onClick={() => setEditedConfig({ ...editedConfig, heroBgImageRotate: ((editedConfig.heroBgImageRotate || 0) + 90) % 360 })} className="p-2 bg-black/60 border border-white/10 rounded-lg text-white/70 hover:text-white"><RotateCw className="w-4 h-4" /></button>
                                <button onClick={() => setEditedConfig({ ...editedConfig, heroBgImageHidden: !editedConfig.heroBgImageHidden })} className="p-2 bg-black/60 border border-white/10 rounded-lg text-white/70 hover:text-white">{editedConfig.heroBgImageHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                                <button onClick={() => setEditedConfig({ ...editedConfig, heroBgImage: '' })} className="p-2 bg-red-600/60 border border-red-600/30 rounded-lg text-white hover:bg-red-600"><Trash2 className="w-4 h-4" /></button>
                              </div>

                              <div className="absolute inset-x-6 bottom-6 flex gap-2">
                                <input type="text" value={editedConfig.heroBgImage} onChange={e => setEditedConfig({ ...editedConfig, heroBgImage: e.target.value })} className="flex-1 bg-black/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl text-[10px] text-white outline-none focus:border-red-600" />
                                <button onClick={() => document.getElementById('hero-bg-file-1')?.click()} className="px-4 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all">Cambiar</button>
                                <input id="hero-bg-file-1" type="file" className="hidden" accept="image/*" onChange={e => handleImageUpload(e, (url) => setEditedConfig({ ...editedConfig, heroBgImage: url }))} />
                              </div>
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <input type="text" value={editedConfig.heroBgImage || ''} onChange={e => setEditedConfig({ ...editedConfig, heroBgImage: e.target.value })} className="flex-1 bg-white/[0.03] border border-white/10 px-4 py-4 rounded-xl text-[10px] text-white outline-none focus:border-red-600" placeholder="Pega el enlace de la imagen de fondo..." />
                              <button onClick={() => document.getElementById('hero-bg-file-2')?.click()} className="px-6 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all">Subir Fondo</button>
                              <input id="hero-bg-file-2" type="file" className="hidden" accept="image/*" onChange={e => handleImageUpload(e, (url) => setEditedConfig({ ...editedConfig, heroBgImage: url }))} />
                            </div>
                          )}
                          {renderImageControls('heroBgImage')}
                        </div>

                        <div className="space-y-4">
                          <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Logo de Hero (Opcional)</label>
                          <div className={`relative rounded-[2.5rem] overflow-hidden border transition-all duration-500 bg-black/20 ${editedConfig.heroImage ? 'aspect-[4/5] shadow-2xl ring-1 ring-white/10 border-white/5' : 'min-h-[12rem] border-dashed border-white/10 flex flex-col items-center justify-center p-8'}`}>
                            {editedConfig.heroBgImage && (
                              <img src={editedConfig.heroBgImage} className="absolute inset-0 w-full h-full object-cover opacity-10 blur-[8px]" />
                            )}

                            {editedConfig.heroImage ? (
                              <div className="relative h-full w-full p-12 flex items-center justify-center">
                                <motion.img
                                  src={editedConfig.heroImage}
                                  className="max-h-full max-w-full object-contain rounded-2xl shadow-[0_30px_60px_-12px_rgba(0,0,0,0.8)] border border-white/10"
                                  style={{ ...getImgStyle('heroImage'), opacity: editedConfig.heroImageHidden ? 0.2 : 1 }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/80 via-[#0a0a0a]/10 to-transparent pointer-events-none" />

                                {/* Adjust Controls */}
                                <div className="absolute top-6 right-6 flex flex-col gap-2 z-30">
                                  <div className="flex flex-col gap-1">
                                    <button onClick={() => setEditedConfig({ ...editedConfig, heroImageRotate: ((editedConfig.heroImageRotate || 0) + 90) % 360 })} className="w-12 h-12 flex items-center justify-center bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl text-white/50 hover:text-white transition-all"><RotateCw className="w-4 h-4" /></button>
                                    <button onClick={() => setEditedConfig({ ...editedConfig, heroImageHidden: !editedConfig.heroImageHidden })} className="w-12 h-12 flex items-center justify-center bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl text-white/50 hover:text-white transition-all">{editedConfig.heroImageHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                                    <button onClick={() => setEditedConfig({ ...editedConfig, heroImage: '' })} className="w-12 h-12 flex items-center justify-center bg-red-600/40 border border-red-600/20 rounded-xl text-white hover:bg-red-600 transition-all"><Trash2 className="w-4 h-4" /></button>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center relative z-10 opacity-30">
                                <Maximize2 className="w-6 h-6 mb-2" />
                                <div className="text-[10px] font-black uppercase tracking-[0.2em]">Sube una Promo o Portada</div>
                              </div>
                            )}

                            <div className={`p-6 bg-black/60 backdrop-blur-xl border-t border-white/5 relative z-20 ${editedConfig.heroImage ? 'absolute bottom-0 left-0 right-0' : 'w-full mt-auto'}`}>
                              <div className="flex gap-2">
                                <input type="text" value={editedConfig.heroImage || ''} onChange={e => setEditedConfig({ ...editedConfig, heroImage: e.target.value })} className="flex-1 bg-white/[0.03] border border-white/10 px-4 py-3 rounded-xl text-[10px] text-white outline-none focus:border-red-600 focus:bg-white/10 transition-all" placeholder="URL de la imagen destacada..." />
                                <button onClick={() => document.getElementById(editedConfig.heroImage ? 'hero-img-file-1' : 'hero-img-file-2')?.click()} className="px-5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all">Subir</button>
                                <input id={editedConfig.heroImage ? 'hero-img-file-1' : 'hero-img-file-2'} type="file" className="hidden" accept="image/*" onChange={e => handleImageUpload(e, (url) => setEditedConfig({ ...editedConfig, heroImage: url }))} />
                              </div>
                            </div>
                          </div>
                          {renderImageControls('heroImage')}
                        </div>
                      </div>
                    </div>
                  )}

                  {currentSection === 'menu' && (
                    <div className="max-w-2xl space-y-12">
                      <div className="p-10 bg-white/[0.02] rounded-[2.5rem] border border-white/5 space-y-8">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Título de la Carta</label>
                          <input type="text" value={editedConfig.menuTitle} onChange={e => setEditedConfig({ ...editedConfig, menuTitle: e.target.value })} className="w-full bg-black border border-white/5 rounded-2xl px-6 py-5 text-white font-black italic text-2xl tracking-tight" />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Eslogan del Menú</label>
                          <input type="text" value={editedConfig.menuSubtitle} onChange={e => setEditedConfig({ ...editedConfig, menuSubtitle: e.target.value })} className="w-full bg-black border border-white/5 rounded-2xl px-6 py-5 text-gray-400 font-medium" />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Primera Imagen Opcional (Aspecto Platillo)</label>
                          <div className="bg-black border border-white/5 rounded-2xl p-6 space-y-4">
                            {renderImageInput('menuFeaturedImage', 'URL de la imagen...', 'menu-feat-img')}
                            {editedConfig.menuFeaturedImage && (
                              <div className="w-full max-w-[350px] aspect-[4/3] rounded-[2rem] overflow-hidden border border-white/10 opacity-60">
                                <img src={editedConfig.menuFeaturedImage} className="w-full h-full object-cover" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>


                      <div className="p-10 bg-white/[0.02] rounded-[2.5rem] border border-white/5 space-y-8">
                        <div>
                          <h5 className="text-xl font-black italic tracking-tighter text-white uppercase mb-2">Gestión de Categorías</h5>
                          <p className="text-xs text-gray-500 font-medium mb-6">Agrega o elimina las columnas/filtros de tu menú.</p>

                          <div className="flex flex-wrap gap-2 mb-8">
                            {categories.filter(c => c !== 'Todos').map(cat => (
                              <div key={cat} className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full group">
                                <span className="text-[10px] font-bold text-white uppercase tracking-wider">{cat}</span>
                                <button
                                  onClick={() => removeCategory(cat)}
                                  className="text-gray-500 hover:text-red-500 transition-colors"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>

                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newCatName}
                              onChange={(e) => setNewCatName(e.target.value)}
                              placeholder="Nueva categoría..."
                              className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-3 text-xs text-white"
                            />
                            <button
                              onClick={() => {
                                if (newCatName.trim()) {
                                  addCategory(newCatName.trim());
                                  setNewCatName('');
                                }
                              }}
                              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-red-600/20"
                            >
                              Agregar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentSection === 'banner' && (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                      <div className="space-y-8">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Título Llamativo</label>
                          <input type="text" value={editedConfig.bannerTitle} onChange={e => setEditedConfig({ ...editedConfig, bannerTitle: e.target.value })} className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-5 text-white font-black italic text-xl" />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Texto Secundario</label>
                          <textarea rows={4} value={editedConfig.bannerDescription} onChange={e => setEditedConfig({ ...editedConfig, bannerDescription: e.target.value })} className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-5 text-gray-400" />
                        </div>
                      </div>
                      <div className="space-y-6">
                        <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Imagen del Chef/Plato Principal</label>
                        <div className="space-y-4">
                          <div className="h-80 rounded-[2.5rem] overflow-hidden bg-white/5 flex items-center justify-center border border-white/10 relative group">
                            <img src={editedConfig.bannerChefImage} className="w-full h-full object-cover drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-transform duration-500" style={getImgStyle('bannerChefImage')} />
                          </div>
                          {renderImageInput('bannerChefImage', 'URL imagen Chef...', 'banner-img-input')}
                          {renderImageControls('bannerChefImage')}
                        </div>
                      </div>
                    </div>
                  )}

                  {currentSection === 'about' && (
                    <div className="space-y-12">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="space-y-8">
                          <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Título de Sección</label>
                            <input type="text" value={editedConfig.aboutTitle} onChange={e => setEditedConfig({ ...editedConfig, aboutTitle: e.target.value })} className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-5 text-white font-black italic text-xl" />
                          </div>
                          <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Historia del Restaurante</label>
                            <textarea rows={8} value={editedConfig.aboutUs} onChange={e => setEditedConfig({ ...editedConfig, aboutUs: e.target.value })} className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-5 text-gray-400 text-sm leading-relaxed" />
                          </div>
                        </div>
                        <div className="space-y-8">
                          <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Galería de Imágenes</label>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-4">
                              <div className="aspect-square rounded-[2rem] overflow-hidden border border-white/5 bg-gray-900 ring-1 ring-white/10">
                                <img src={editedConfig.aboutImage1} className="w-full h-full object-cover" style={getImgStyle('aboutImage1')} />
                              </div>
                              {renderImageInput('aboutImage1', 'URL imagen 1...', 'about1-img-input')}
                              {renderImageControls('aboutImage1')}
                            </div>
                            <div className="space-y-4">
                              <div className="aspect-square rounded-[2rem] overflow-hidden border border-white/5 bg-gray-900 ring-1 ring-white/10">
                                <img src={editedConfig.aboutImage2} className="w-full h-full object-cover" style={getImgStyle('aboutImage2')} />
                              </div>
                              {renderImageInput('aboutImage2', 'URL imagen 2...', 'about2-img-input')}
                              {renderImageControls('aboutImage2')}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mt-8">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Dato Destacado 1</label>
                              <input type="text" value={editedConfig.stat1Title} onChange={e => setEditedConfig({ ...editedConfig, stat1Title: e.target.value })} className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-white text-xs" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Dato Destacado 2</label>
                              <input type="text" value={editedConfig.stat2Title} onChange={e => setEditedConfig({ ...editedConfig, stat2Title: e.target.value })} className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-white text-xs" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentSection === 'footer' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                      <div className="p-10 bg-white/[0.02] rounded-[2.5rem] border border-white/5 space-y-8">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Teléfono de Soporte</label>
                          <input type="text" value={editedConfig.contactPhone} onChange={e => setEditedConfig({ ...editedConfig, contactPhone: e.target.value })} className="w-full bg-black border border-white/5 rounded-2xl px-6 py-5 text-white" />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Email Público</label>
                          <input type="text" value={editedConfig.contactEmail} onChange={e => setEditedConfig({ ...editedConfig, contactEmail: e.target.value })} className="w-full bg-black border border-white/5 rounded-2xl px-6 py-5 text-white" />
                        </div>
                      </div>
                      <div className="p-10 bg-white/[0.02] rounded-[2.5rem] border border-white/5 space-y-8">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Dirección Física</label>
                          <input type="text" value={editedConfig.address} onChange={e => setEditedConfig({ ...editedConfig, address: e.target.value })} className="w-full bg-black border border-white/5 rounded-2xl px-6 py-5 text-white" />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Nombre de Marca / Copyright</label>
                          <input type="text" value={editedConfig.copyright} onChange={e => setEditedConfig({ ...editedConfig, copyright: e.target.value })} className="w-full bg-black border border-white/5 rounded-2xl px-6 py-5 text-white" />
                        </div>
                      </div>
                    </div>
                  )}

                  {currentSection === 'design' && (
                    <div className="space-y-12">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="p-10 bg-white/[0.02] rounded-[2.5rem] border border-white/5 space-y-8">
                          <div>
                            <h5 className="text-xl font-black italic tracking-tighter text-white uppercase mb-2">Temas Rápidos</h5>
                            <p className="text-xs text-gray-500 font-medium mb-6">Selecciona una combinación de colores predefinida.</p>
                            <div className="grid grid-cols-2 gap-3">
                              {[
                                { name: 'Oscuro/Rojo', primary: '#ffffff', accent: '#ff0000', start: '#ff0000', end: '#990000' },
                                { name: 'Purply', primary: '#ffffff', accent: '#a855f7', start: '#a855f7', end: '#6b21a8' },
                                { name: 'Gold', primary: '#ffffff', accent: '#fbbf24', start: '#fbbf24', end: '#b45309' },
                                { name: 'Emerald', primary: '#ffffff', accent: '#10b981', start: '#10b981', end: '#064e3b' },
                                { name: 'Ocean', primary: '#ffffff', accent: '#0ea5e9', start: '#0ea5e9', end: '#0369a1' },
                                { name: 'Ruby', primary: '#ffffff', accent: '#e11d48', start: '#e11d48', end: '#9f1239' },
                                { name: 'Sunset', primary: '#ffffff', accent: '#f59e0b', start: '#f59e0b', end: '#d97706' },
                              ].map(theme => (
                                <button
                                  key={theme.name}
                                  onClick={() => setEditedConfig({
                                    ...editedConfig,
                                    primaryColor: theme.primary,
                                    accentColor: theme.accent,
                                    btnGradientStart: theme.start,
                                    btnGradientEnd: theme.end
                                  })}
                                  className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 hover:border-white/20 transition-all text-left"
                                >
                                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.accent }} />
                                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{theme.name}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="p-10 bg-white/[0.02] rounded-[2.5rem] border border-white/5 flex items-center justify-between group">
                          <div className="flex-1 mr-8">
                            <h5 className="text-xl font-black italic tracking-tighter text-white uppercase mb-2">Personalización Libre</h5>
                            <div className="space-y-4">
                              <div className="flex justify-between items-center bg-black/40 p-3 rounded-xl border border-white/5">
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Color de Acento</span>
                                <input type="color" value={editedConfig.accentColor} onChange={e => setEditedConfig({ ...editedConfig, accentColor: e.target.value })} className="w-8 h-8 rounded-lg border-none bg-transparent cursor-pointer" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-10 bg-white/[0.02] rounded-[2.5rem] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="flex-1 space-y-4">
                          <h5 className="text-xl font-black italic tracking-tighter text-white uppercase">Fondo Global (Sitio Completo)</h5>
                          <p className="text-xs text-gray-500 font-medium tracking-tight leading-relaxed">Este fondo se verá en todo el sitio, detrás de las secciones transparentes. Úsalo para dar una atmósfera única a tu restaurante.</p>
                          {renderImageInput('globalBgImage', 'URL fondo global...', 'global-bg-file')}
                          {renderImageControls('globalBgImage')}
                        </div>
                        <div className="w-56 h-32 rounded-3xl overflow-hidden border border-white/10 relative shadow-2xl group">
                          {editedConfig.globalBgImage && <img src={editedConfig.globalBgImage} className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 scale-110 group-hover:scale-100" style={getImgStyle('globalBgImage')} />}
                          {!editedConfig.globalBgImage && <div className="absolute inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center text-[10px] font-black uppercase text-gray-600 tracking-widest">Sin Fondo Global</div>}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">VISTA PREVIA</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-10 bg-white/[0.02] rounded-[2.5rem] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="flex-1 space-y-4">
                          <h5 className="text-xl font-black italic tracking-tighter text-white uppercase">Logo de Marca</h5>
                          <p className="text-xs text-gray-500 font-medium">Este logo se mostrará en el encabezado y pie de página de todo el sitio.</p>
                          {renderImageInput('logo', 'URL del logo...', 'logo-img-input')}
                          {renderImageControls('logo')}
                        </div>
                        <div className="w-48 h-48 bg-black rounded-[2rem] p-8 border border-white/10 flex items-center justify-center shadow-2xl relative group">
                          <img src={editedConfig.logo || '/logo.jpg'} className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500" style={getImgStyle('logo')} />
                          <div className="absolute inset-x-8 -bottom-4 bg-red-600 text-white text-[8px] font-black uppercase tracking-[0.2em] py-2 rounded-full text-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">PREVISUALIZACIÓN</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentSection === 'backgrounds' && (
                    <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-500">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Global Background */}
                        <div className="p-10 bg-white/[0.02] rounded-[2.5rem] border border-white/5 space-y-6">
                          <div>
                            <h5 className="text-xl font-black italic tracking-tighter text-white uppercase mb-2">Fondo Principal (Global)</h5>
                            <p className="text-xs text-gray-500 font-medium mb-6">Esta imagen se ve detrás de todas las secciones si no tienen una propia.</p>
                            {renderImageInput('globalBgImage', 'URL fondo global...', 'global-bg-input')}
                            {renderImageControls('globalBgImage')}
                          </div>
                          <div className="aspect-video bg-black rounded-2xl border border-white/10 overflow-hidden relative group">
                            <img src={editedConfig.globalBgImage || '/interior.jpg'} className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" style={getImgStyle('globalBgImage')} />
                            <div className="absolute inset-x-8 -bottom-4 bg-red-600 text-white text-[8px] font-black uppercase tracking-[0.2em] py-2 rounded-full text-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">FONDO DEL SITIO</div>
                          </div>
                        </div>

                        {/* Section Overrides */}
                        <div className="space-y-6">
                          <div className="p-8 bg-white/[0.02] rounded-[2.5rem] border border-white/5 space-y-4">
                            <div className="flex justify-between items-center">
                              <h5 className="text-xs font-black italic tracking-widest text-red-500 uppercase">Fondo Sección HERO</h5>
                              {!editedConfig.heroBgImage && <span className="text-[8px] font-bold text-gray-600 uppercase border border-white/10 px-2 py-1 rounded">Usando Global</span>}
                            </div>
                            {renderImageInput('heroBgImage', 'Fondo del Hero...', 'hero-bg-up-f')}
                            {renderImageControls('heroBgImage')}
                          </div>

                          <div className="p-8 bg-white/[0.02] rounded-[2.5rem] border border-white/5 space-y-4">
                            <div className="flex justify-between items-center">
                              <h5 className="text-xs font-black italic tracking-widest text-red-500 uppercase">Fondo Sección MENÚ</h5>
                              {!editedConfig.menuBgImage && <span className="text-[8px] font-bold text-gray-600 uppercase border border-white/10 px-2 py-1 rounded">Usando Global</span>}
                            </div>
                            {renderImageInput('menuBgImage', 'Fondo del Menú...', 'menu-bg-up-f')}
                            {renderImageControls('menuBgImage')}
                          </div>

                          <div className="p-8 bg-white/[0.02] rounded-[2.5rem] border border-white/5 space-y-4">
                            <div className="flex justify-between items-center">
                              <h5 className="text-xs font-black italic tracking-widest text-red-500 uppercase">Fondo Sección HISTORIA</h5>
                              {!editedConfig.aboutBgImage && <span className="text-[8px] font-bold text-gray-600 uppercase border border-white/10 px-2 py-1 rounded">Usando Global</span>}
                            </div>
                            {renderImageInput('aboutBgImage', 'Fondo de Historia...', 'about-bg-up-f')}
                            {renderImageControls('aboutBgImage')}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </main>
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-black italic tracking-tighter text-white">GESTIÓN DE MENÚ</h2>
            </header>

            <div className="grid lg:grid-cols-2 gap-10">
              <div className="bg-white/5 rounded-[2.5rem] border border-white/5 overflow-hidden">
                <div className="p-8 border-b border-white/5 bg-white/[0.02]">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">Productos Disponibles ({items.length})</h3>
                </div>
                <div className="p-6 space-y-4 max-h-[600px] overflow-y-auto scrollbar-elegant">
                  {items.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-black/40 rounded-3xl border border-white/5 hover:border-red-500/30 transition-all group">
                      <div className="flex items-center gap-6">
                        <div className="relative">
                          <img src={item.image} className="w-20 h-20 rounded-2xl object-cover border border-white/10 group-hover:scale-105 transition-transform" alt="" />
                          {item.disabled && <div className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center text-[8px] font-black uppercase tracking-widest text-red-500">Inactivo</div>}
                        </div>
                        <div>
                          <h4 className="font-black italic tracking-tighter text-white group-hover:text-red-500 transition-colors uppercase">{item.name}</h4>
                          <p className="text-sm font-black text-gray-500">€{item.price.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setEditingItem(item)} className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl hover:bg-blue-600 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                        <button onClick={() => toggleAvailability(item.id)} className={`w-10 h-10 flex items-center justify-center rounded-xl transition-colors ${item.disabled ? 'bg-green-600/10 text-green-600' : 'bg-yellow-600/10 text-yellow-600'}`}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 115.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                        </button>
                        <button onClick={() => removeItem(item.id)} className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl hover:bg-red-600 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/5 rounded-[2.5rem] border border-white/5 overflow-hidden h-fit">
                <div className="p-8 border-b border-white/5 bg-white/[0.02]">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-red-500">
                    {editingItem ? 'EDITAR PRODUCTO' : 'REGISTRAR NUEVO'}
                  </h3>
                </div>
                <div className="p-8">
                  <MenuForm
                    item={editingItem}
                    onSave={(it) => {
                      if (editingItem) updateItem(it);
                      else addItem(it);
                      setEditingItem(null);
                    }}
                    onCancel={() => setEditingItem(null)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
              <h2 className="text-3xl font-black italic tracking-tighter text-white">CLIENTES</h2>
              <div className="relative w-full sm:w-auto">
                <input
                  type="text"
                  value={customerSearch}
                  placeholder="BUSCAR POR NOMBRE O EMAIL..."
                  className="w-full sm:w-80 px-6 py-4 bg-white/5 border border-white/5 rounded-2xl text-xs font-bold uppercase tracking-widest focus:border-red-600 outline-none transition-all"
                  onChange={(e) => setCustomerSearch(e.target.value)}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 text-lg">🔍</div>
              </div>
            </header>

            <div className="bg-white/5 rounded-[2.5rem] border border-white/5 overflow-hidden">
              <div className="divide-y divide-white/5">
                {filteredCustomers.length > 0 ? filteredCustomers.map(c => (
                  <div key={c.email} className="p-8 hover:bg-white/[0.02] transition-colors group">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-600 to-red-900 border border-white/20 flex items-center justify-center text-xl font-black shadow-lg">
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <p className="text-xl font-black italic tracking-tighter text-white uppercase group-hover:text-red-500 transition-colors">{c.name}</p>
                            {c.blocked && <span className="bg-red-600/20 text-red-500 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest border border-red-600/30">Bloqueado</span>}
                          </div>
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{c.email}</p>
                        </div>
                      </div>
                      <div className="flex gap-3 w-full md:w-auto">
                        <button onClick={() => c.blocked ? unblockCustomer(c.email) : blockCustomer(c.email)} className={cn(
                          "flex-1 md:flex-none px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                          c.blocked ? "bg-green-600 text-white hover:bg-green-700 shadow-xl shadow-green-600/20" : "bg-white/5 text-gray-400 hover:bg-red-600 hover:text-white"
                        )}>
                          {c.blocked ? 'Desbloquear' : 'Bloquear'}
                        </button>
                        <button onClick={() => setSelectedCustomer(c.email === selectedCustomer ? null : c.email)} className="flex-1 md:flex-none px-6 py-3 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-red-600/20 hover:bg-red-700 active:scale-95 transition-all">
                          {selectedCustomer === c.email ? 'Cerrar' : 'Actividad'}
                        </button>
                      </div>
                    </div>
                    {selectedCustomer === c.email && (
                      <div className="mt-8 p-8 bg-black/40 rounded-[2rem] border border-white/5 animate-in slide-in-from-top-4 duration-300">
                        <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-6">Historial de Consumo</h4>
                        <div className="space-y-4">
                          {orders.filter(o => o.customerName === c.name).length > 0 ?
                            orders.filter(o => o.customerName === c.name).map(o => (
                              <div key={o.id} className="flex justify-between items-center p-4 bg-white/[0.02] rounded-2xl border border-white/5">
                                <div>
                                  <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest leading-none mb-1">{o.id}</p>
                                  <p className="text-xs font-black uppercase text-white">{o.date}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-red-500 font-black italic">€{o.total.toFixed(2)}</p>
                                  <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">{o.status}</p>
                                </div>
                              </div>
                            )) : (
                              <div className="text-center py-8 text-gray-700 text-xs font-black uppercase tracking-widest">Sin registros de compras</div>
                            )
                          }
                        </div>
                      </div>
                    )}
                  </div>
                )) : (
                  <div className="p-20 text-center opacity-20 filter grayscale">
                    <span className="text-8xl">👥</span>
                    <p className="text-xl font-black italic uppercase tracking-[0.5em] mt-8">No hay resultados</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase">Gestión de Comandas</h2>
            </header>

            <div className="grid lg:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500">En Cocina / Por Salir</h3>
                </div>
                <div className="space-y-4 max-h-[70vh] overflow-y-auto scrollbar-elegant pr-2">
                  {ordersToPrepare.length > 0 ? ordersToPrepare.map(o => (
                    <div key={o.id} className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5 hover:border-red-500/30 transition-all shadow-2xl">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest leading-none mb-1">{o.id}</p>
                          <h4 className="text-2xl font-black italic tracking-tighter text-white uppercase">{o.customerName}</h4>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-black italic text-red-500 leading-none">€{o.total.toFixed(2)}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                          <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1">Método</p>
                          <p className="text-xs font-bold text-gray-300 uppercase">{o.paymentMethod || 'Efectivo'}</p>
                        </div>
                        <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                          <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1">Entrega</p>
                          <p className="text-xs font-bold text-gray-300 uppercase">{o.deliveryType}</p>
                        </div>
                      </div>

                      {o.address && (
                        <div className="mb-6 p-4 bg-red-600/5 rounded-2xl border border-red-600/10">
                          <p className="text-[8px] font-black text-red-500 uppercase tracking-widest mb-1">Destino</p>
                          <p className="text-xs font-medium text-gray-300">{o.address}</p>
                        </div>
                      )}

                      <div className="flex gap-3">
                        <select
                          value={o.status}
                          onChange={(e) => updateOrder({ ...o, status: e.target.value as any })}
                          className="flex-1 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest p-4 rounded-xl cursor-pointer"
                        >
                          <option value="pending">🛒 Pendiente</option>
                          <option value="preparing">🍳 En Cocina</option>
                          <option value="delivered">🛵 Entregado</option>
                          <option value="cancelled">❌ Cancelar</option>
                        </select>
                        <button onClick={() => o.phone && window.open('https://wa.me/' + o.phone.replace(/\D/g, ''), '_blank')} className="w-14 h-14 flex items-center justify-center bg-green-600 text-white rounded-xl shadow-lg shadow-green-600/20 hover:scale-105 active:scale-95 transition-all">
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.653a11.888 11.888 0 005.685 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                        </button>
                      </div>
                    </div>
                  )) : (
                    <div className="p-20 text-center bg-white/5 rounded-[2.5rem] border border-white/5 border-dashed">
                      <span className="text-6xl mb-4 block">🍳</span>
                      <p className="text-xs font-black uppercase tracking-widest text-gray-600">No hay comandas activas</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500">Historial de Despacho</h3>
                </div>
                <div className="space-y-4 max-h-[70vh] overflow-y-auto scrollbar-elegant pr-2">
                  {ordersHistory.length > 0 ? ordersHistory.map(o => (
                    <div key={o.id} className="p-6 bg-white/[0.02] rounded-3xl border border-white/5 opacity-60 flex justify-between items-center group hover:opacity-100 transition-opacity">
                      <div>
                        <h5 className="font-black italic tracking-tighter text-white uppercase">{o.customerName}</h5>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{o.date} • €{o.total.toFixed(2)}</p>
                      </div>
                      <div className="text-right">
                        <span className="px-3 py-1 bg-white/5 rounded-full text-[8px] font-black uppercase tracking-widest text-gray-400 group-hover:bg-green-600/10 group-hover:text-green-600 transition-colors">{o.status}</span>
                      </div>
                    </div>
                  )) : (
                    <div className="p-10 text-center text-gray-700 text-[10px] font-black uppercase tracking-widest">El historial está vacío</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
