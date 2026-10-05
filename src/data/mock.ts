export type Category = "ropa" | "zapatos" | "herramientas";
export type PaymentMethod = "qr" | "transferencia" | "efectivo";
export type ProductStatus = "available" | "reserved" | "sold";
export type OrderStatus = "reserved" | "confirmed" | "cancelled" | "expired";

export type Store = {
  id: string;
  name: string;
  category: Category;
  description: string;
  icon: "shirt" | "footsteps" | "construct";
  whatsapp: string;
};

export type Product = {
  id: string;
  storeId: string;
  code: string;
  name: string;
  price: number;
  description: string;
  attributes: Record<string, string>;
  paymentMethods: PaymentMethod[];
  image: string;
  status: ProductStatus;
};

export type Order = {
  id: string;
  productId: string;
  clientName: string;
  clientPhone: string;
  status: OrderStatus;
  createdAt: number;
  expiresAt: number;
};

// Corto para poder probar; en producción lo configura cada tienda
export const RESERVATION_MINUTES = 2;
export const MAX_ACTIVE_RESERVATIONS = 2;

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  qr: "QR",
  transferencia: "Transferencia",
  efectivo: "Efectivo al recibir",
};

// Campos específicos según el tipo de tienda
export const CATEGORY_FIELDS: Record<
  Category,
  { key: string; label: string; placeholder: string }[]
> = {
  ropa: [
    { key: "size", label: "Talla", placeholder: "S, M, L..." },
    { key: "gender", label: "Género", placeholder: "Mujer, Hombre, Unisex" },
  ],
  zapatos: [
    { key: "size", label: "Número", placeholder: "38, 40, 42..." },
    { key: "color", label: "Color", placeholder: "Negro, Blanco..." },
  ],
  herramientas: [
    { key: "brand", label: "Marca", placeholder: "Bosch, Truper..." },
    { key: "condition", label: "Estado", placeholder: "Nuevo / Usado" },
  ],
};

export function describeProduct(p: Product, category: Category) {
  return CATEGORY_FIELDS[category]
    .map((f) =>
      p.attributes[f.key] ? `${f.label} ${p.attributes[f.key]}` : null,
    )
    .filter(Boolean)
    .join(" · ");
}

export const MOCK_STORES: Store[] = [
  {
    id: "s1",
    name: "Moda Ana",
    category: "ropa",
    description: "Ropa de temporada para toda la familia",
    icon: "shirt",
    whatsapp: "59171111111",
  },
  {
    id: "s2",
    name: "Pasos Firmes",
    category: "zapatos",
    description: "Calzado urbano y deportivo",
    icon: "footsteps",
    whatsapp: "59172222222",
  },
  {
    id: "s3",
    name: "Herramientas Don Luis",
    category: "herramientas",
    description: "Herramientas nuevas y seminuevas",
    icon: "construct",
    whatsapp: "59173333333",
  },
];

const img = (seed: string) => `https://picsum.photos/seed/${seed}/400/500`;
const ALL: PaymentMethod[] = ["qr", "transferencia", "efectivo"];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    storeId: "s1",
    code: "PR001",
    name: "Blusa floral",
    price: 85,
    description: "Blusa liviana de verano",
    attributes: { size: "M", gender: "Mujer" },
    paymentMethods: ["qr", "efectivo"],
    image: img("pr001"),
    status: "available",
  },
  {
    id: "2",
    storeId: "s1",
    code: "PR002",
    name: "Jean recto",
    price: 150,
    description: "Jean azul clásico",
    attributes: { size: "32", gender: "Hombre" },
    paymentMethods: ALL,
    image: img("pr002"),
    status: "available",
  },
  {
    id: "3",
    storeId: "s1",
    code: "PR003",
    name: "Vestido negro",
    price: 180,
    description: "Vestido de fiesta",
    attributes: { size: "S", gender: "Mujer" },
    paymentMethods: ["qr", "transferencia"],
    image: img("pr003"),
    status: "available",
  },
  {
    id: "4",
    storeId: "s2",
    code: "ZP001",
    name: "Zapatilla urbana",
    price: 280,
    description: "Suela de goma, muy cómoda",
    attributes: { size: "40", color: "Blanco" },
    paymentMethods: ALL,
    image: img("zp001"),
    status: "available",
  },
  {
    id: "5",
    storeId: "s2",
    code: "ZP002",
    name: "Bota de cuero",
    price: 350,
    description: "Cuero genuino",
    attributes: { size: "38", color: "Café" },
    paymentMethods: ["qr", "transferencia"],
    image: img("zp002"),
    status: "available",
  },
  {
    id: "6",
    storeId: "s2",
    code: "ZP003",
    name: "Sandalia",
    price: 120,
    description: "Ideal para el calor",
    attributes: { size: "37", color: "Negro" },
    paymentMethods: ["qr", "efectivo"],
    image: img("zp003"),
    status: "available",
  },
  {
    id: "7",
    storeId: "s3",
    code: "HR001",
    name: "Taladro percutor",
    price: 450,
    description: "750 W con maletín",
    attributes: { brand: "Bosch", condition: "Nuevo" },
    paymentMethods: ALL,
    image: img("hr001"),
    status: "available",
  },
  {
    id: "8",
    storeId: "s3",
    code: "HR002",
    name: "Juego de llaves",
    price: 160,
    description: "12 piezas",
    attributes: { brand: "Truper", condition: "Nuevo" },
    paymentMethods: ["qr", "efectivo"],
    image: img("hr002"),
    status: "available",
  },
  {
    id: "9",
    storeId: "s3",
    code: "HR003",
    name: "Amoladora",
    price: 380,
    description: 'Disco de 4 ½"',
    attributes: { brand: "Makita", condition: "Usado" },
    paymentMethods: ["efectivo"],
    image: img("hr003"),
    status: "available",
  },
];
