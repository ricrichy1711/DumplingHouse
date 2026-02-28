import { MenuItem } from '../types';

export const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "Dumplings de Cerdo Clásicos",
    description: "Deliciosos dumplings rellenos de cerdo jugoso con jengibre, cebollín y salsa de soja. Receta tradicional china.",
    price: 8.99,
    image: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&h=300&fit=crop",
    category: "Clásicos",
    isPopular: true
  },
  {
    id: 2,
    name: "Dumplings de Pollo",
    description: "Suaves dumplings con pollo tierno, champiñones shiitake y un toque de sésamo.",
    price: 8.49,
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&h=300&fit=crop",
    category: "Clásicos"
  },
  {
    id: 3,
    name: "Dumplings Vegetarianos",
    description: "Relleno de verduras frescas: col china, zanahoria, tofu y setas. Perfectos para vegetarianos.",
    price: 7.99,
    image: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=300&fit=crop",
    category: "Vegetarianos",
    isVegetarian: true,
    isPopular: true
  },
  {
    id: 4,
    name: "Dumplings de Camarón",
    description: "Exquisitos dumplings transparentes rellenos de camarones frescos con bambú crujiente.",
    price: 10.99,
    image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=300&fit=crop",
    category: "Premium",
    isPopular: true
  },
  {
    id: 5,
    name: "Gyozas Fritas",
    description: "Dumplings japoneses crujientes por fuera, jugosos por dentro. Servidos con salsa ponzu.",
    price: 9.49,
    image: "https://images.unsplash.com/photo-1541696490-8744a5dc0228?w=400&h=300&fit=crop",
    category: "Especiales"
  },
  {
    id: 6,
    name: "Xiao Long Bao",
    description: "Famosos dumplings de sopa shangaineses. Rellenos de carne de cerdo y caldo caliente.",
    price: 11.99,
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=300&fit=crop",
    category: "Premium",
    isPopular: true
  },
  {
    id: 7,
    name: "Dumplings de Pato",
    description: "Sofisticados dumplings con pato confitado, cebolleta y salsa hoisin.",
    price: 12.99,
    image: "https://images.unsplash.com/photo-1547928576-b822bc410e94?w=400&h=300&fit=crop",
    category: "Premium"
  },
  {
    id: 8,
    name: "Dumplings Picantes Sichuan",
    description: "Para los amantes del picante. Con chile de Sichuan, cerdo y pimienta de Sichuan.",
    price: 9.99,
    image: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&h=300&fit=crop",
    category: "Especiales"
  },
  {
    id: 9,
    name: "Wontons en Sopa",
    description: "Delicados wontons en un reconfortante caldo de pollo con verduras.",
    price: 8.99,
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop",
    category: "Sopas"
  },
  {
    id: 10,
    name: "Dumplings Dulces de Sésamo",
    description: "Postre tradicional. Dumplings de arroz glutinoso rellenos de pasta de sésamo negro.",
    price: 6.99,
    image: "https://images.unsplash.com/photo-1517244683847-7456b63c5969?w=400&h=300&fit=crop",
    category: "Postres"
  }
];

export const categories = ["Todos", "Clásicos", "Vegetarianos", "Premium", "Especiales", "Sopas", "Postres"];
