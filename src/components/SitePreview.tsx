import React from 'react';
import { ShoppingCart, Phone, Instagram, MapPin, Plus, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SiteConfig } from '../context/SiteConfigContext';
import { MenuItem } from '../types';

interface SitePreviewProps {
    config: SiteConfig;
    menuItems: MenuItem[];
}

export function SitePreview({ config, menuItems: MENU_ITEMS }: SitePreviewProps) {
    const [activeCategory, setActiveCategory] = React.useState('Todos');

    const categories = React.useMemo(() => [
        'Todos',
        ...Array.from(new Set(MENU_ITEMS.map(i => i.category)))
    ], [MENU_ITEMS]);

    React.useEffect(() => {
        if (!categories.includes(activeCategory)) {
            setActiveCategory(categories[0] || 'Todos');
        }
    }, [categories]);

    return (
        <div className="w-full bg-[#0a0a0a] text-white font-sans overflow-y-auto h-full scrollbar-elegant origin-top transform scale-[0.85] rounded-[2rem] shadow-2xl border border-white/10 relative">
            <div className="min-h-screen">
                {/* Navbar */}
                <nav className="sticky top-0 w-full z-50 bg-[#0a0a0a]/90 backdrop-blur-sm border-b border-red-900/30">
                    <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <img src={config.logo || "/logo.jpg"} alt="Logo" className="h-10 w-10 object-contain" />
                            <span className="text-lg font-bold tracking-tighter text-red-500 hidden sm:block">{(config.brandName || "DUMPLING HOUSE").toUpperCase()}</span>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex gap-6 text-[10px] uppercase tracking-widest font-medium">
                                <span className="cursor-default">{config.navLabels?.[1] || "Menú"}</span>
                                <span className="cursor-default">{config.navLabels?.[2] || "Nosotros"}</span>
                                <span className="cursor-default">{config.navLabels?.[3] || "Contacto"}</span>
                            </div>
                            <div className="relative p-2 text-white">
                                <ShoppingCart className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section
                    className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-cover bg-top"
                    style={{ backgroundImage: `url(${config.heroBgImage || config.heroImage || '/interior.jpg'})` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-[#0a0a0a]/40" />

                    <div className="relative z-6 text-center px-4 max-w-4xl">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={config.heroTitle + config.heroHighlight}
                        >
                            <img src={config.logo || "/logo.jpg"} alt="Logo" className="mx-auto w-24 h-24 mb-6 drop-shadow-2xl" />
                            <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tighter">
                                {config.heroTitle} <span className="text-red-600">{config.heroHighlight}</span>
                            </h1>
                            <p className="text-sm md:text-base text-gray-300 mb-8 max-w-xl mx-auto font-light leading-relaxed">
                                {config.heroText}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <div className="bg-red-600 text-white px-6 py-3 rounded-full font-bold uppercase tracking-widest text-[10px] cursor-default">
                                    {config.heroButton1 || "Ver el Menú"}
                                </div>
                                <div className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-6 py-3 rounded-full font-bold uppercase tracking-widest text-[10px] cursor-default">
                                    {config.heroButton2 || "Hacer Pedido"}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Menu Section */}
                <section className="py-20 px-4 relative bg-[#0b0b0b]">
                    <div className="relative max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
                            <div className="max-w-xl text-left">
                                <h2 className="text-red-600 font-bold tracking-widest mb-2 text-[10px] uppercase">{config.menuSubtitle || 'Nuestra Selección'}</h2>
                                <h3 className="text-3xl md:text-4xl font-bold">{config.menuTitle || 'MENÚ TRADICIONAL'}</h3>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveCategory(cat)}
                                        className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition-all border ${activeCategory === cat
                                            ? 'bg-red-600 border-red-600 text-white'
                                            : 'bg-transparent border-white/20 text-gray-400'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence mode="wait">
                                {MENU_ITEMS.filter(i => !i.disabled && (activeCategory === 'Todos' || i.category === activeCategory)).slice(0, 6).map((item) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="bg-[#151515] rounded-3xl overflow-hidden border border-white/5 group"
                                    >
                                        <div className="relative h-48 overflow-hidden">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            <div className="absolute top-3 right-3 bg-red-600 text-white font-bold px-2.5 py-1 rounded-full text-[10px]">
                                                ${item.price}
                                            </div>
                                        </div>
                                        <div className="p-5 text-left">
                                            <h4 className="text-lg font-bold mb-1 truncate">{item.name}</h4>
                                            <p className="text-gray-400 text-[10px] mb-4 line-clamp-2 h-8">{item.description}</p>
                                            <div className="w-full flex items-center justify-center gap-2 bg-white/5 text-white py-2 rounded-xl font-bold uppercase tracking-widest text-[9px]">
                                                <Plus className="w-3 h-3" />
                                                Agregar al Carrito
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </section>

                {/* Banner Section */}
                <section
                    className="relative bg-red-600 py-16 px-4"
                >
                    <div className="absolute inset-0 bg-red-600/90" />
                    <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="md:w-1/2">
                            <img src={config.bannerChefImage || "/chef.jpg"} alt="Chef" className="max-w-[250px] mx-auto drop-shadow-2xl" />
                        </div>
                        <div className="md:w-1/2 text-center md:text-left text-white">
                            <h2 className="text-3xl md:text-5xl font-black mb-4 leading-tight uppercase tracking-tighter italic">{config.bannerTitle || 'LOS DUMPLINGS MÁS FRESCOS'}</h2>
                            <p className="text-sm font-medium mb-6 text-white/90">
                                {config.bannerDescription || 'Ordene ahora y disfrute del sabor auténtico. Envíos locales y pick-up.'}
                            </p>
                            <div className="bg-black text-white px-8 py-4 rounded-full font-bold inline-flex items-center gap-3 uppercase tracking-widest text-[10px] shadow-2xl">
                                <Phone className="w-4 h-4 fill-current" />
                                {config.contactPhone}
                            </div>
                        </div>
                    </div>
                </section>

                {/* About Section */}
                <section className="py-20 px-4 bg-[#0a0a0a]">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <div className="text-left">
                                <h2 className="text-red-600 font-bold tracking-widest mb-2 text-[10px] uppercase">{config.aboutSubtitle || 'Nuestra Historia'}</h2>
                                <h3 className="text-3xl font-bold mb-6 italic tracking-tighter uppercase">{config.aboutTitle || 'PASIÓN POR LA COCINA ASIÁTICA'}</h3>
                                <p className="text-gray-400 text-xs mb-6 leading-relaxed">
                                    {config.aboutUs}
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-[#151515] p-5 rounded-2xl border border-white/5">
                                        <div className="text-red-500 font-bold text-xl mb-1 italic">100%</div>
                                        <div className="text-[8px] uppercase tracking-widest text-gray-500">{config.stat1Title || 'Ingredientes Frescos'}</div>
                                    </div>
                                    <div className="bg-[#151515] p-5 rounded-2xl border border-white/5">
                                        <div className="text-red-500 font-bold text-xl mb-1 italic">HECHO</div>
                                        <div className="text-[8px] uppercase tracking-widest text-gray-500">{config.stat2Title || 'A Mano Diario'}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <img src={config.aboutImage1 || "/dumpling2.jpg"} alt="Dumpling" className="rounded-2xl w-full h-48 object-cover mt-6 shadow-xl" />
                                <img src={config.aboutImage2 || "/dumpling3.jpg"} alt="Dumpling" className="rounded-2xl w-full h-48 object-cover shadow-xl" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-black py-16 px-4 border-t border-white/5">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                <img src={config.logo || "/logo.jpg"} alt="Logo" className="h-8 w-8" />
                                <span className="text-lg font-bold tracking-tighter text-red-500">{(config.brandName || "DUMPLING HOUSE").toUpperCase()}</span>
                            </div>
                            <p className="text-gray-500 text-[10px] leading-relaxed mb-6">
                                {config.footerText}
                            </p>
                            <div className="flex gap-3">
                                <div className="p-2 bg-white/5 rounded-full">
                                    <Instagram className="w-4 h-4" />
                                </div>
                                <div className="p-2 bg-white/5 rounded-full">
                                    <Phone className="w-4 h-4" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-xs font-bold mb-6 uppercase tracking-widest">UBICACIÓN & HORARIO</h4>
                            <div className="space-y-3 text-gray-400 text-[10px]">
                                <div className="flex gap-3">
                                    <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                                    <p>{config.address}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-white font-bold">Lunes - Sábado:</p>
                                    <p>12:00 PM - 10:00 PM</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-xs font-bold mb-6 uppercase tracking-widest">PEDIDOS ONLINE</h4>
                            <p className="text-gray-500 text-[10px] mb-4">
                                ¡Haz tu pedido por WhatsApp y recíbelo en la puerta de tu casa!
                            </p>
                            <div className="bg-red-600 text-white w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest shadow-xl">
                                <Send className="w-4 h-4" />
                                ORDENAR POR WHATSAPP
                            </div>
                        </div>
                    </div>
                    <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/5 text-center text-gray-600 text-[8px] uppercase tracking-widest">
                        {config.copyright || `© ${new Date().getFullYear()} ${config.brandName}. Todos los derechos reservados.`}
                    </div>
                </footer>
            </div>
        </div>
    );
}
