import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../utils/supabase';

export interface SiteConfig {
  brandName: string;
  siteTitle: string;

  // Hero Section
  heroTitle: string;
  heroHighlight: string;
  heroText: string;
  heroButton1?: string;
  heroButton2?: string;
  heroSubtitle: string;
  heroImage: string;
  heroBgImage?: string;

  // Menu Section
  menuTitle?: string;
  menuSubtitle?: string;

  // Featured Banner
  bannerChefImage?: string;
  bannerTitle?: string;
  bannerDescription?: string;

  // About Section
  aboutTitle?: string;
  aboutSubtitle?: string;
  aboutUs: string;
  aboutImage1?: string;
  aboutImage2?: string;
  stat1Title?: string;
  stat2Title?: string;

  // Footer & Contact
  footerText: string;
  contactPhone: string;
  contactEmail: string;
  address: string;
  coords?: { lat: number; lng: number } | null;
  logo?: string;

  // Theme
  primaryColor?: string;
  accentColor?: string;
  highlightColor?: string;
  btnGradientStart?: string;
  btnGradientEnd?: string;

  // Feature boxes shown in hero
  featureBoxes?: { icon: string; title: string; subtitle: string }[];

  // Navigation labels
  navLabels?: string[];

  // Footer
  copyright?: string;
}

const defaultConfig: SiteConfig = {
  brandName: 'Dumpling House',
  siteTitle: 'Dumpling House',

  // Hero
  heroTitle: 'EL ARTE DEL',
  heroHighlight: 'DUMPLING',
  heroText: 'Auténticos sabores orientales preparados artesanalmente cada día. Prueba la perfección en cada mordida.',
  heroButton1: 'Ver el Menú',
  heroButton2: 'Hacer Pedido',
  heroSubtitle: 'Dumplings artesanales hechos con amor y las mejores recetas tradicionales asiáticas',
  heroImage: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=1920&h=1080&fit=crop",
  heroBgImage: "https://images.unsplash.com/photo-1514516348920-f319999a5e82?w=1920&h=1080&fit=crop",

  // Menu
  menuTitle: 'MENÚ TRADICIONAL',
  menuSubtitle: 'Nuestra Selección',

  // Banner
  bannerChefImage: '/chef.jpg',
  bannerTitle: 'LOS DUMPLINGS MÁS FRESCOS',
  bannerDescription: 'Ordene ahora y disfrute del sabor auténtico. Envíos locales y pick-up.',

  // About
  aboutTitle: 'PASIÓN POR LA COCINA ASIÁTICA',
  aboutSubtitle: 'Nuestra Historia',
  aboutUs: 'En Dumpling House, no solo servimos comida; servimos una experiencia. Cada dumpling es moldeado a mano siguiendo recetas tradicionales pasadas de generación en generación.',
  aboutImage1: '/dumpling2.jpg',
  aboutImage2: '/dumpling3.jpg',
  stat1Title: 'Ingredientes Frescos',
  stat2Title: 'A Mano Diario',

  // Contact & Footer
  footerText: 'Trayendo lo mejor de la cocina oriental a tu mesa. Frescura, sabor y tradición en cada bocado.',
  contactPhone: '+34 912 345 678',
  contactEmail: 'info@dumplinghouse.es',
  address: 'Obregón, Sonora, México',
  coords: { lat: 40.4203, lng: -3.7058 },

  primaryColor: '#ffffff',
  accentColor: '#ff7a18',
  highlightColor: '#ffb86b',
  btnGradientStart: '#ff7a18',
  btnGradientEnd: '#ff4b2b',
  featureBoxes: [
    { icon: '🍜', title: '100% Artesanal', subtitle: 'Hechos a mano cada día' },
    { icon: '🚚', title: 'Delivery Rápido', subtitle: 'Entrega en 30-45 min' },
    { icon: '⭐', title: 'Calidad Premium', subtitle: 'Ingredientes frescos' }
  ],
  navLabels: ['Inicio', 'Menú', 'Nosotros', 'Contacto'],
  logo: '',
  copyright: '© 2024 Dumpling House. Todos los derechos reservados.',
};

const SiteConfigContext = createContext<{
  config: SiteConfig;
  setConfig: (next: Partial<SiteConfig>) => Promise<void>;
  resetConfig: () => Promise<void>;
  isLoading: boolean;
  isPublishing: boolean;
} | undefined>(undefined);

export function SiteConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfigState] = useState<SiteConfig>(defaultConfig);
  const [isLoading, setIsLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);

  // Load from Supabase on mount
  useEffect(() => {
    async function loadConfig() {
      try {
        const { data, error } = await supabase
          .from('site_configs')
          .select('config_data')
          .eq('id', 1)
          .single();

        if (error) {
          console.error('Error loading config from Supabase:', error);
        } else if (data && Object.keys(data.config_data).length > 0) {
          setConfigState(prev => ({ ...prev, ...data.config_data }));
        }
      } catch (e) {
        console.error('Caught error loading config:', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadConfig();
  }, []);

  // Sync to localStorage as backup
  useEffect(() => {
    localStorage.setItem('site_config', JSON.stringify(config));
  }, [config]);

  // Apply CSS variables for theme colors
  useEffect(() => {
    const root = document.documentElement;
    if (config.btnGradientStart) root.style.setProperty('--btn-start', config.btnGradientStart);
    if (config.btnGradientEnd) root.style.setProperty('--btn-end', config.btnGradientEnd);
    if (config.accentColor) root.style.setProperty('--accent', config.accentColor);
    if (config.highlightColor) root.style.setProperty('--highlight', config.highlightColor);
    if (config.primaryColor) root.style.setProperty('--primary', config.primaryColor);
  }, [config]);

  const setConfig = async (next: Partial<SiteConfig>) => {
    const newConfig = { ...config, ...next };
    setConfigState(newConfig);

    setIsPublishing(true);
    try {
      const { error } = await supabase
        .from('site_configs')
        .upsert({ id: 1, config_data: newConfig, updated_at: new Date().toISOString() });

      if (error) throw error;
    } catch (e) {
      console.error('Error publishing config to Supabase:', e);
    } finally {
      setIsPublishing(false);
    }
  };

  const resetConfig = async () => {
    await setConfig(defaultConfig);
  };

  return (
    <SiteConfigContext.Provider value={{ config, setConfig, resetConfig, isLoading, isPublishing }}>
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfig() {
  const ctx = useContext(SiteConfigContext);
  if (!ctx) throw new Error('useSiteConfig must be used within SiteConfigProvider');
  return ctx;
}
