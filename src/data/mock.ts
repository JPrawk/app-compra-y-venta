export type ProductStatus = "available" | "reserved" | "sold";
export type OrderStatus = "reserved" | "confirmed" | "cancelled" | "expired";

export type Product = {
  id: string;
  code: string;
  name: string;
  price: number;
  size: string;
  gender: "Mujer" | "Hombre" | "Unisex";
  image: string;
  status: ProductStatus;
};

export type Order = {
  id: string;
  productId: string;
  clientName: string;
  clientPhone: string; // WhatsApp del cliente
  note?: string;
  status: OrderStatus;
  createdAt: number;
  expiresAt: number;
};

// Corto para poder probar; en producción lo configura cada tienda
export const RESERVATION_MINUTES = 2;
export const MAX_ACTIVE_RESERVATIONS = 2;

const img = (seed: string) => `https://picsum.photos/seed/${seed}/400/500`;

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    code: "PR001",
    name: "Blusa floral",
    price: 85,
    size: "M",
    gender: "Mujer",
    image: img("pr001"),
    status: "available",
  },
  {
    id: "2",
    code: "PR002",
    name: "Jean recto",
    price: 150,
    size: "32",
    gender: "Hombre",
    image: img("pr002"),
    status: "available",
  },
  {
    id: "3",
    code: "PR003",
    name: "Vestido negro",
    price: 180,
    size: "S",
    gender: "Mujer",
    image: img("pr003"),
    status: "available",
  },
  {
    id: "4",
    code: "PR004",
    name: "Polera oversize",
    price: 70,
    size: "L",
    gender: "Unisex",
    image: img("pr004"),
    status: "available",
  },
  {
    id: "5",
    code: "PR005",
    name: "Chaqueta jean",
    price: 220,
    size: "M",
    gender: "Unisex",
    image: img("pr005"),
    status: "available",
  },
  {
    id: "6",
    code: "PR006",
    name: "Falda plisada",
    price: 95,
    size: "S",
    gender: "Mujer",
    image: img("pr006"),
    status: "available",
  },
  {
    id: "7",
    code: "PR007",
    name: "Camisa lino",
    price: 130,
    size: "L",
    gender: "Hombre",
    image: img("pr007"),
    status: "available",
  },
  {
    id: "8",
    code: "PR008",
    name: "Buzo deportivo",
    price: 110,
    size: "M",
    gender: "Unisex",
    image: img("pr008"),
    status: "available",
  },
];

export const MOCK_CLIENTS = [
  { name: "María López", phone: "+59171234567" },
  { name: "Carla Rojas", phone: "+59176543210" },
  { name: "Ana Pérez", phone: "+59170011223" },
];
