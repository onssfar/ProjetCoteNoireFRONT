export type ProductCategory = "Fleurs" | "Bougies" | "Diffuseurs" | "Cadeaux";

export interface Product {
  id: number;
  name: string;
  category: ProductCategory;
  price: number;
  oldPrice?: number;
  badge?: string;
  image: string;
  hoverImage: string;
  description: string;
  scent: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Le Bouquet Côte Noire",
    category: "Fleurs",
    price: 89,
    badge: "Best-seller",
    image: "https://images.unsplash.com/photo-1487070183336-b863922373d4?auto=format&fit=crop&w=1000&q=85",
    hoverImage: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1000&q=85",
    description: "Un bouquet de fleurs séchées aux tons ivoire, pensé pour durer.",
    scent: "Lin frais",
  },
  {
    id: 2,
    name: "Bougie Santal 01",
    category: "Bougies",
    price: 42,
    badge: "Nouveau",
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=85",
    hoverImage: "https://images.unsplash.com/photo-1602607203557-4b7c0e0f6c9e?auto=format&fit=crop&w=1000&q=85",
    description: "Une cire naturelle coulée à la main dans un verre ambré.",
    scent: "Santal · Ambre",
  },
  {
    id: 3,
    name: "Le Petit Jardin",
    category: "Fleurs",
    price: 55,
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1000&q=85",
    hoverImage: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1000&q=85",
    description: "Une composition miniature inspirée des jardins de la côte.",
    scent: "Rose blanche",
  },
  {
    id: 4,
    name: "Diffuseur Maison N°3",
    category: "Diffuseurs",
    price: 48,
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=85",
    hoverImage: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1000&q=85",
    description: "Un parfum d'ambiance discret et enveloppant pour chaque pièce.",
    scent: "Figuier · Thé blanc",
  },
  {
    id: 5,
    name: "Coffret Éclat",
    category: "Cadeaux",
    price: 68,
    oldPrice: 78,
    badge: "-13%",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1000&q=85",
    hoverImage: "https://images.unsplash.com/photo-1513883049090-d0b7439799bf?auto=format&fit=crop&w=1000&q=85",
    description: "Le duo signature à offrir : bougie et brume parfumée.",
    scent: "Néroli · Musc",
  },
  {
    id: 6,
    name: "Brume Fleur de Thé",
    category: "Diffuseurs",
    price: 29,
    image: "https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?auto=format&fit=crop&w=1000&q=85",
    hoverImage: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1000&q=85",
    description: "Une brume légère pour réveiller le linge et les intérieurs.",
    scent: "Thé vert · Bergamote",
  },
  {
    id: 7,
    name: "Bougie Riviera",
    category: "Bougies",
    price: 36,
    image: "https://images.unsplash.com/photo-1602523961358-f9f03dd557db?auto=format&fit=crop&w=1000&q=85",
    hoverImage: "https://images.unsplash.com/photo-1603905179139-db12ab535d4e?auto=format&fit=crop&w=1000&q=85",
    description: "Une note solaire et minérale dans un écrin en céramique.",
    scent: "Cèdre · Fleur de sel",
  },
  {
    id: 8,
    name: "Le Grand Côte Noire",
    category: "Fleurs",
    price: 145,
    badge: "Pièce unique",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=85",
    hoverImage: "https://images.unsplash.com/photo-1509223197845-458d87318791?auto=format&fit=crop&w=1000&q=85",
    description: "Une pièce généreuse aux fleurs séchées, sculptée pour votre intérieur.",
    scent: "Immortelle",
  },
];

export const collectionTiles = [
  {
    title: "Fleurs préservées",
    subtitle: "Des bouquets qui restent",
    href: "/collections/fleurs",
    image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Rituels parfumés",
    subtitle: "Lumière & matière",
    href: "/collections/bougies",
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "La maison",
    subtitle: "Une signature sensible",
    href: "/collections/diffuseurs",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "À offrir",
    subtitle: "Pour les beaux jours",
    href: "/collections/cadeaux",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=85",
  },
];

export const formatPrice = (price: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "TND" }).format(price);
