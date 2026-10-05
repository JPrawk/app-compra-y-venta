import {
    MAX_ACTIVE_RESERVATIONS,
    MOCK_PRODUCTS,
    Order,
    OrderStatus,
    Product,
    ProductStatus,
    RESERVATION_MINUTES,
} from "@/data/mock";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

type State = { products: Product[]; orders: Order[] };

type StoreValue = State & {
  now: number;
  reserve: (
    productId: string,
    clientName: string,
    clientPhone: string,
    note?: string,
  ) => string | null;
  confirm: (orderId: string) => void;
  cancel: (orderId: string) => void;
};

const StoreContext = createContext<StoreValue | null>(null);

// Libera las reservas que nadie confirmó a tiempo
function expireReservations(s: State, now: number): State {
  const expired = s.orders.filter(
    (o) => o.status === "reserved" && o.expiresAt <= now,
  );
  if (expired.length === 0) return s;

  const orderIds = new Set(expired.map((o) => o.id));
  const productIds = new Set(expired.map((o) => o.productId));

  return {
    orders: s.orders.map(
      (o): Order => (orderIds.has(o.id) ? { ...o, status: "expired" } : o),
    ),
    products: s.products.map(
      (p): Product =>
        productIds.has(p.id) ? { ...p, status: "available" } : p,
    ),
  };
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>({
    products: MOCK_PRODUCTS,
    orders: [],
  });
  const [now, setNow] = useState(() => Date.now());

  // Reloj: cada segundo actualiza la hora y libera las reservas vencidas
  useEffect(() => {
    const timer = setInterval(() => {
      const t = Date.now();
      setNow(t);
      setState((s) => expireReservations(s, t));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const reserve = (
    productId: string,
    clientName: string,
    clientPhone: string,
    note?: string,
  ) => {
    const product = state.products.find((p) => p.id === productId);
    if (!product || product.status !== "available") {
      return "Esta prenda ya no está disponible";
    }

    const active = state.orders.filter(
      (o) => o.clientPhone === clientPhone && o.status === "reserved",
    ).length;
    if (active >= MAX_ACTIVE_RESERVATIONS) {
      return `${clientName} ya tiene ${MAX_ACTIVE_RESERVATIONS} reservas activas`;
    }

    const t = Date.now();
    const order: Order = {
      id: String(t),
      productId,
      clientName,
      clientPhone,
      note,
      status: "reserved",
      createdAt: t,
      expiresAt: t + RESERVATION_MINUTES * 60_000,
    };

    setState((s) => ({
      orders: [order, ...s.orders],
      products: s.products.map(
        (p): Product => (p.id === productId ? { ...p, status: "reserved" } : p),
      ),
    }));
    return null;
  };

  const setOrderStatus = (
    orderId: string,
    status: OrderStatus,
    productStatus: ProductStatus,
  ) => {
    setState((s) => {
      const order = s.orders.find((o) => o.id === orderId);
      if (!order) return s;
      return {
        orders: s.orders.map(
          (o): Order => (o.id === orderId ? { ...o, status } : o),
        ),
        products: s.products.map(
          (p): Product =>
            p.id === order.productId ? { ...p, status: productStatus } : p,
        ),
      };
    });
  };

  const value: StoreValue = {
    ...state,
    now,
    reserve,
    confirm: (id) => setOrderStatus(id, "confirmed", "sold"), // el vendedor ya cobró
    cancel: (id) => setOrderStatus(id, "cancelled", "available"), // se libera la prenda
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore debe usarse dentro de StoreProvider");
  return ctx;
}
