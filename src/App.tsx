import React from 'react';
import { ShoppingCart, X, Phone, Instagram, MapPin, Plus, Minus, Send, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SiteConfigProvider, useSiteConfig } from './context/SiteConfigContext';
import { AuthModal } from './components/AuthModal';
import { UserProfile } from './components/UserProfile';
import { AdminPanel } from './components/AdminPanel';
import { MenuProvider, useMenu } from './context/MenuContext';
import { OrderProvider } from './context/OrderContext';
import { CustomerProvider } from './context/CustomerContext';

// Reuse types from shared definitions
import { MenuItem, CartItem } from './types';



function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative"
      >
        <img src="/logo.jpg" alt="Logo" className="w-32 h-32 object-contain brightness-125 grayscale opacity-50" />
        <div className="absolute inset-0 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </motion.div>
      <div className="text-center">
        <h2 className="text-xl font-bold tracking-tighter text-white uppercase italic">Cargando Experiencia</h2>
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-2 underline decoration-red-600 underline-offset-4">Dumpling House Premium</p>
      </div>
    </div>
  );
}

function SiteContent() {
  const { user, logout } = useAuth();
  const { items: MENU_ITEMS, categories } = useMenu();
  const { config, isLoading } = useSiteConfig();
  const [cart, setCart] = React.useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [activeCategory, setActiveCategory] = React.useState('Todos');
  const [isAuthOpen, setIsAuthOpen] = React.useState(false);
  const [showProfile, setShowProfile] = React.useState(false);

  React.useEffect(() => {
    if (!categories.includes(activeCategory)) {
      setActiveCategory(categories[0] || 'Todos');
    }
  }, [categories]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  // if seller, show admin panel only
  if (user?.role === 'seller') {
    return <AdminPanel />;
  }

  // helper to open login modal
  // helper to open login modal
  const openAuth = () => setIsAuthOpen(true);

  const getImgStyle = (key: keyof typeof config) => {
    const scale = (config[`${key}Scale` as keyof typeof config] as number) || 1;
    const posX = (config[`${key}PositionX` as keyof typeof config] as number) ?? 50;
    const posY = (config[`${key}PositionY` as keyof typeof config] as number) ?? 50;
    const rotate = (config[`${key}Rotate` as keyof typeof config] as number) || 0;
    return {
      objectPosition: `${posX}% ${posY}%`,
      transform: `scale(${scale}) rotate(${rotate}deg)`
    };
  };

  const getBgStyle = (key: keyof typeof config) => {
    const scale = (config[`${key}Scale` as keyof typeof config] as number) || 1;
    const posX = (config[`${key}PositionX` as keyof typeof config] as number) ?? 50;
    const posY = (config[`${key}PositionY` as keyof typeof config] as number) ?? 50;
    return {
      backgroundPosition: `${posX}% ${posY}%`,
      backgroundSize: scale === 1 ? 'cover' : `${scale * 100}%`
    };
  };
  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    const text = cart.map(item => `${item.name} x${item.quantity} - $${item.price * item.quantity}`).join('\n');
    const message = encodeURIComponent(`¡Hola! Quisiera hacer el siguiente pedido:\n\n${text}\n\nTotal: $${total}\n\nGracias.`);
    window.open(`https://wa.me/526441989061?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen text-white font-sans relative bg-[#0a0a0a]">
      {/* Global Background Image Layer */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `url(${config.globalBgImage || '/interior.jpg'})`,
          ...getBgStyle('globalBgImage')
        }}
      />
      {/* Dark tint overlay for the whole site readability */}
      <div className="fixed inset-0 bg-black/70 z-[1] pointer-events-none" />

      <div className="relative z-10">
        {/* Navbar */}
        <nav className="fixed top-0 left-0 w-full z-50 bg-[#0a0a0a]/90 backdrop-blur-sm border-b border-red-900/30">
          <div className="max-w-7xl mx-auto px-4 h-20 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <img src={config.logo || "/logo.jpg"} alt="Logo" className="h-14 w-14 object-contain" style={getImgStyle('logo')} />
              <span className="text-2xl font-bold tracking-tighter text-red-500 hidden sm:block">{(config.brandName || "DUMPLING HOUSE").toUpperCase()}</span>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden md:flex gap-8 text-sm uppercase tracking-widest font-medium">
                <a href="#menu" className="hover:text-red-500 transition">{config.navLabels?.[1] || "Menú"}</a>
                <a href="#about" className="hover:text-red-500 transition">{config.navLabels?.[2] || "Nosotros"}</a>
                <a href="#contact" className="hover:text-red-500 transition">{config.navLabels?.[3] || "Contacto"}</a>
              </div>

              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-white hover:text-red-500 transition"
              >
                <ShoppingCart className="w-6 h-6" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-black">
                    {cart.reduce((s, i) => s + i.quantity, 0)}
                  </span>
                )}
              </button>
              {user ? (
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => setShowProfile(true)}
                    className="w-9 h-9 bg-red-600 rounded-full flex items-center justify-center text-white font-bold uppercase text-sm hover:bg-red-700 transition"
                    title="Mi perfil"
                  >
                    {user.name.charAt(0)}
                  </button>
                  <button
                    onClick={logout}
                    className="text-sm bg-white/10 px-3 py-2 rounded-full hover:bg-red-600 hover:text-white transition-all border border-white/10"
                  >Salir</button>
                </div>
              ) : (
                <button
                  onClick={openAuth}
                  className="ml-4 text-sm bg-red-600 px-3 py-2 rounded-full hover:bg-red-700"
                >Iniciar sesión</button>
              )}
            </div>
          </div>
        </nav>

        {user && <UserProfile isOpen={showProfile} onClose={() => setShowProfile(false)} />}

        <section
          id="home"
          className={`relative min-h-screen pt-32 pb-16 md:pt-40 md:pb-20 flex items-center justify-center overflow-hidden transition-all duration-500 bg-transparent ${config.heroBgImageHidden ? 'hidden' : ''}`}
        >
          {/* Hero Specific Background Layer */}
          {config.heroBgImage && !config.heroBgImageHidden && (
            <div
              className="absolute inset-0 z-0 transition-transform duration-500"
              style={{
                backgroundImage: `url(${config.heroBgImage})`,
                ...getBgStyle('heroBgImage')
              }}
            />
          )}

          {config.heroBgImage && !config.heroBgImageHidden && (
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/90 via-[#0a0a0a]/30 to-transparent z-[1]" />
          )}

          <div className="relative z-6 text-center px-4 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >

              {config.heroImage && !config.heroImageHidden && (
                <motion.img
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{
                    opacity: 1,
                    scale: config.heroImageScale || 1,
                    rotate: config.heroImageRotate || 0
                  }}
                  src={config.heroImage}
                  alt="Hero"
                  className="mx-auto w-64 h-auto mb-8 rounded-3xl shadow-2xl border border-white/10"
                  style={{ objectPosition: `${config.heroImagePositionX ?? 50}% ${config.heroImagePositionY ?? 50}%` }}
                />
              )}

              <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tighter">
                {config.heroTitle} <span className="text-red-600">{config.heroHighlight}</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto font-light leading-relaxed">
                {config.heroText}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="#menu"
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full font-bold transition-all transform hover:scale-105 text-center uppercase tracking-widest text-sm"
                >
                  {config.heroButton1 || "Ver el Menú"}
                </a>
                <button
                  onClick={() => window.open(`https://wa.me/${config.contactPhone.replace(/\D/g, '')}`, '_blank')}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-full font-bold transition-all text-center uppercase tracking-widest text-sm"
                >
                  {config.heroButton2 || "Hacer Pedido"}
                </button>
              </div>
            </motion.div>
          </div>

        </section>

        {/* Menu Section */}
        <section
          id="menu"
          className="py-16 px-4 relative transition-all duration-700"
          style={{
            backgroundImage: config.menuBgImage ? `url(${config.menuBgImage})` : 'none',
            ...getBgStyle('menuBgImage')
          }}
        >
          {config.menuBgImage && <div className="absolute inset-0 bg-black/70 z-0" />}
          <div className="relative max-w-7xl mx-auto z-10">
            {/* Main Flex Container */}
            <div className="flex flex-col xl:flex-row xl:items-end gap-8 lg:gap-10 w-full overflow-hidden">

              {/* LEFT COLUMN: Header + Image */}
              <div className="w-full xl:w-[360px] flex flex-col gap-6 lg:gap-8 shrink-0">
                {/* 1. Headers */}
                <div className="max-w-xl">
                  <h2 className="text-red-600 font-bold tracking-widest mb-2 text-sm uppercase">{config.menuSubtitle || 'Nuestra Selección'}</h2>
                  <h3 className="text-4xl md:text-5xl font-bold">{config.menuTitle || 'MENÚ TRADICIONAL'}</h3>
                </div>

                {/* 2. Featured Image */}
                {config.menuFeaturedImage && (
                  <div className="w-full aspect-square md:aspect-[4/3] xl:aspect-auto xl:h-[480px] rounded-3xl overflow-hidden border border-white/5 shadow-2xl shrink-0 xl:flex-1">
                    <img
                      src={config.menuFeaturedImage}
                      className="w-full h-full object-cover"
                      alt="Menu Destacado"
                      style={{
                        objectPosition: `${config.menuFeaturedImagePositionX ?? 50}% ${config.menuFeaturedImagePositionY ?? 50}%`,
                        transform: `scale(${config.menuFeaturedImageScale || 1})`
                      }}
                    />
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN: Categories + Carousel */}
              <div className="flex-1 flex flex-col min-w-0 gap-6">
                {/* 3. Categories */}
                <div className="flex flex-wrap gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-6 py-2 rounded-full text-sm font-bold transition-all border whitespace-nowrap ${activeCategory === cat
                        ? 'bg-red-600 border-red-600 text-white'
                        : 'bg-transparent border-white/20 text-gray-400 hover:border-red-500 hover:text-white'
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* 4. Dishes Carousel */}
                <div className="relative group/carousel flex-1 min-w-0">
                  <div id="dishes-carousel" className="flex gap-6 overflow-x-auto snap-x scrollbar-hide pb-8 scroll-smooth will-change-transform items-stretch h-full">
                    <AnimatePresence mode="wait">
                      {MENU_ITEMS.filter(i => !i.disabled && (activeCategory === 'Todos' || i.category === activeCategory)).map((item) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.3 }}
                          className="min-w-[80vw] sm:min-w-[260px] md:min-w-[280px] max-w-[280px] shrink-0 snap-center bg-[#151515] rounded-[2rem] overflow-hidden border border-white/5 hover:border-red-900/50 transition-all group/card"
                        >
                          <div className="relative h-56 overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.name}
                              style={{
                                transform: `scale(${item.imageScale || 1})`,
                                objectPosition: `${item.imagePositionX ?? 50}% ${item.imagePositionY ?? 50}%`
                              }}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
                            />
                            <div className="absolute top-4 right-4 bg-red-600 text-white font-bold px-3 py-1 rounded-full text-sm shadow-xl">
                              ${item.price.toFixed(2)}
                            </div>
                          </div>
                          <div className="p-5 flex flex-col h-[calc(100%-14rem)] min-h-[160px]">
                            <h4 className="text-lg font-bold mb-1 group-hover/card:text-red-500 transition-colors uppercase truncate">{item.name}</h4>
                            <p className="text-gray-400 text-xs mb-5 leading-relaxed line-clamp-2">
                              {item.description}
                            </p>
                            <button
                              onClick={() => addToCart(item)}
                              className="mt-auto w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-red-600 text-white py-2.5 rounded-xl transition-all font-bold uppercase tracking-widest text-xs"
                            >
                              <Plus className="w-4 h-4" />
                              Agregar al Carrito
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {MENU_ITEMS.filter(i => !i.disabled && (activeCategory === 'Todos' || i.category === activeCategory)).length > 1 && (
                    <>
                      <button onClick={() => document.getElementById('dishes-carousel')?.scrollBy({ left: -380, behavior: 'smooth' })} className="flex absolute left-2 md:-left-6 top-[40%] -translate-y-1/2 w-10 h-10 md:w-14 md:h-14 bg-black/95 border border-white/10 rounded-full items-center justify-center text-white hover:bg-red-600 hover:scale-110 transition-all z-30 shadow-[0_0_40px_rgba(0,0,0,0.8)] opacity-100 backdrop-blur-md">
                        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                      </button>
                      <button onClick={() => document.getElementById('dishes-carousel')?.scrollBy({ left: 380, behavior: 'smooth' })} className="flex absolute right-2 md:-right-6 top-[40%] -translate-y-1/2 w-10 h-10 md:w-14 md:h-14 bg-black/95 border border-white/10 rounded-full items-center justify-center text-white hover:bg-red-600 hover:scale-110 transition-all z-30 shadow-[0_0_40px_rgba(0,0,0,0.8)] opacity-100 backdrop-blur-md">
                        <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className="relative bg-cover bg-top md:bg-fixed bg-[length:120%] py-16 px-4"
          style={{ backgroundImage: `url(${config.heroImage || '/interior.jpg'})` }}
        >
          <div className="absolute inset-0 bg-red-600/90"></div>
          <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2">
              <img src={config.bannerChefImage || "/chef.jpg"} alt="Chef" className="max-w-sm mx-auto drop-shadow-2xl" style={getImgStyle('bannerChefImage')} />
            </div>
            <div className="md:w-1/2 text-center md:text-left">
              <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">{config.bannerTitle || 'LOS DUMPLINGS MÁS FRESCOS'}</h2>
              <p className="text-xl font-medium mb-8 text-white/90">
                {config.bannerDescription || 'Ordene ahora y disfrute del sabor auténtico. Envíos locales y pick-up.'}
              </p>
              <button
                onClick={() => window.open(`https://wa.me/${config.contactPhone.replace(/\D/g, '')}`, '_blank')}
                className="bg-black text-white px-10 py-5 rounded-full font-bold flex items-center gap-3 mx-auto md:mx-0 hover:bg-gray-900 transition-all transform hover:scale-105 uppercase tracking-widest shadow-2xl"
              >
                <Phone className="w-5 h-5 fill-current" />
                {config.contactPhone}
              </button>
            </div>
          </div>
        </section>

        {/* Gallery/About Section */}
        <section
          id="about"
          className="py-20 px-4 relative transition-all duration-700"
          style={{
            backgroundImage: config.aboutBgImage ? `url(${config.aboutBgImage})` : 'none',
            backgroundAttachment: 'fixed',
            ...getBgStyle('aboutBgImage')
          }}
        >
          {config.aboutBgImage && <div className="absolute inset-0 bg-black/70 z-0" />}
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-red-600 font-bold tracking-widest mb-2 text-sm uppercase">{config.aboutSubtitle || 'Nuestra Historia'}</h2>
                <h3 className="text-4xl font-bold mb-6">{config.aboutTitle || 'PASIÓN POR LA COCINA ASIÁTICA'}</h3>
                <p className="text-gray-400 text-lg mb-6 leading-relaxed">
                  {config.aboutUs}
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-[#151515] p-6 rounded-2xl border border-white/5">
                    <div className="text-red-500 font-bold text-3xl mb-2">100%</div>
                    <div className="text-xs uppercase tracking-widest text-gray-500">{config.stat1Title || 'Ingredientes Frescos'}</div>
                  </div>
                  <div className="bg-[#151515] p-6 rounded-2xl border border-white/5">
                    <div className="text-red-500 font-bold text-3xl mb-2">HECHO</div>
                    <div className="text-xs uppercase tracking-widest text-gray-500">{config.stat2Title || 'A Mano Diario'}</div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <img src={config.aboutImage1 || "/dumpling2.jpg"} alt="Dumpling" className="rounded-3xl w-full h-64 object-cover mt-8" style={getImgStyle('aboutImage1')} />
                <img src={config.aboutImage2 || "/dumpling3.jpg"} alt="Dumpling" className="rounded-3xl w-full h-64 object-cover" style={getImgStyle('aboutImage2')} />
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer id="contact" className="bg-[#0a0a0a] py-16 px-4 border-t border-white/5 relative z-20">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
            <div>
              <div className="flex items-center gap-2 mb-8">
                <img src={config.logo || "/logo.jpg"} alt="Logo" className="h-12 w-12 object-contain" style={getImgStyle('logo')} />
                <span className="text-xl font-bold tracking-tighter text-red-500">{(config.brandName || "DUMPLING HOUSE").toUpperCase()}</span>
              </div>
              <p className="text-gray-500 leading-relaxed mb-8">
                {config.footerText}
              </p>
              <div className="flex gap-4">
                <a href="#" className="p-3 bg-white/5 rounded-full hover:bg-red-600 transition-all">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href={`tel:${config.contactPhone}`} className="p-3 bg-white/5 rounded-full hover:bg-red-600 transition-all">
                  <Phone className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-xl font-bold mb-8">UBICACIÓN & HORARIO</h4>
              <div className="space-y-4 text-gray-400">
                <div className="flex gap-4">
                  <MapPin className="w-5 h-5 text-red-500 shrink-0" />
                  <p>{config.address}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-white font-bold">Lunes - Sábado:</p>
                  <p>12:00 PM - 10:00 PM</p>
                </div>
                <div className="space-y-2">
                  <p className="text-white font-bold">Domingo:</p>
                  <p>Cerrado</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xl font-bold mb-8">PEDIDOS ONLINE</h4>
              <p className="text-gray-500 mb-6">
                ¡Haz tu pedido por WhatsApp y recíbelo en la puerta de tu casa!
              </p>
              <button
                onClick={() => window.open(`https://wa.me/${config.contactPhone.replace(/\D/g, '')}`, '_blank')}
                className="bg-red-600 hover:bg-red-700 text-white w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all"
              >
                <Send className="w-5 h-5" />
                ORDENAR POR WHATSAPP
              </button>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 text-center text-gray-600 text-sm">
            {config.copyright || `© ${new Date().getFullYear()} ${config.brandName}. Todos los derechos reservados.`}
          </div>
        </footer>

        {/* Cart Modal Overlay */}
        <AnimatePresence>
          {isCartOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsCartOpen(false)}
                className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60]"
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0d0d0d] shadow-2xl z-[70] flex flex-col"
              >
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                  <h3 className="text-2xl font-bold">Tu Pedido</h3>
                  <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {cart.length === 0 ? (
                    <div className="text-center py-20 opacity-50">
                      <ShoppingCart className="w-16 h-16 mx-auto mb-4" />
                      <p className="text-xl">Tu carrito está vacío</p>
                      <button
                        onClick={() => setIsCartOpen(false)}
                        className="mt-6 text-red-500 font-bold"
                      >
                        Empezar a comprar
                      </button>
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div key={item.id} className="flex gap-4 items-center">
                        <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-sm">{item.name}</h4>
                          <p className="text-red-500 font-bold text-sm">${item.price * item.quantity}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <button
                              onClick={() => updateQuantity(item.id as string, -1)}
                              className="p-1 hover:bg-white/10 rounded border border-white/10"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id as string, 1)}
                              className="p-1 hover:bg-white/10 rounded border border-white/10"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id as string)}
                          className="text-gray-500 hover:text-red-500"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {cart.length > 0 && (
                  <div className="p-6 border-t border-white/5 space-y-4">
                    <div className="flex justify-between items-center text-xl font-bold">
                      <span>Total</span>
                      <span className="text-red-500">${total}</span>
                    </div>
                    <button
                      onClick={handleCheckout}
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all"
                    >
                      CONFIRMAR POR WHATSAPP
                      <Send className="w-5 h-5" />
                    </button>
                    <p className="text-[10px] text-center text-gray-500 uppercase tracking-widest">
                      El pago se acuerda directamente con el restaurante
                    </p>
                  </div>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      </div>
    </div>
  );
}

function AppProviders() {
  const { isInitializing } = useAuth();

  // STALL OTHER PROVIDERS UNTIL AUTH COMPLETES TO PREVENT SUPABASE LOCK ERRORS
  if (isInitializing) {
    return <LoadingScreen />;
  }

  return (
    <SiteConfigProvider>
      <MenuProvider>
        <OrderProvider>
          <CustomerProvider>
            <SiteContent />
          </CustomerProvider>
        </OrderProvider>
      </MenuProvider>
    </SiteConfigProvider>
  );
}

export function App() {
  return (
    <AuthProvider>
      <AppProviders />
    </AuthProvider>
  );
}
