import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  seedBanners,
  seedBookings,
  seedCoupons,
  seedCustomers,
  seedDestinations,
  seedHotels,
  seedPackages,
} from "./seed";
import type { Banner, Booking, Coupon, Customer, Destination, Hotel, TravelPackage } from "./types";

/**
 * Camada de dados da aplicação (serviço em memória + persistência local).
 * Substituir os setters por chamadas de API/banco mantém a UI intacta.
 */

export interface SessionUser {
  name: string;
  email: string;
  role: "cliente" | "admin";
}

interface CatalogState {
  destinations: Destination[];
  hotels: Hotel[];
  packages: TravelPackage[];
  banners: Banner[];
  coupons: Coupon[];
  customers: Customer[];
  bookings: Booking[];
  user: SessionUser | null;
}

const STORAGE_KEY = "voar-brasil-state-v1";

const initialState: CatalogState = {
  destinations: seedDestinations,
  hotels: seedHotels,
  packages: seedPackages,
  banners: seedBanners,
  coupons: seedCoupons,
  customers: seedCustomers,
  bookings: seedBookings,
  user: null,
};

type Entity = "destinations" | "hotels" | "packages" | "banners" | "coupons";

interface StoreApi extends CatalogState {
  ready: boolean;
  upsert: <K extends Entity>(entity: K, item: CatalogState[K][number]) => void;
  remove: (entity: Entity, id: string) => void;
  toggleActive: (entity: Entity, id: string) => void;
  addBooking: (booking: Omit<Booking, "id" | "code" | "createdAt">) => Booking;
  updateBookingStatus: (id: string, status: Booking["status"]) => void;
  login: (email: string, name?: string) => SessionUser;
  logout: () => void;
  resetDemoData: () => void;
}

const StoreContext = createContext<StoreApi | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CatalogState>(initialState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...initialState, ...(JSON.parse(raw) as CatalogState) });
    } catch {
      /* estado padrão */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage indisponível */
    }
  }, [state, ready]);

  const upsert = useCallback(<K extends Entity>(entity: K, item: CatalogState[K][number]) => {
    setState((prev) => {
      const list = prev[entity] as { id: string }[];
      const exists = list.some((i) => i.id === item.id);
      const next = exists ? list.map((i) => (i.id === item.id ? item : i)) : [...list, item];
      return { ...prev, [entity]: next } as CatalogState;
    });
  }, []);

  const remove = useCallback((entity: Entity, id: string) => {
    setState((prev) => ({
      ...prev,
      [entity]: (prev[entity] as { id: string }[]).filter((i) => i.id !== id),
    }));
  }, []);

  const toggleActive = useCallback((entity: Entity, id: string) => {
    setState((prev) => ({
      ...prev,
      [entity]: (prev[entity] as { id: string; active: boolean }[]).map((i) =>
        i.id === id ? { ...i, active: !i.active } : i,
      ),
    }));
  }, []);

  const addBooking = useCallback((booking: Omit<Booking, "id" | "code" | "createdAt">) => {
    const created: Booking = {
      ...booking,
      id: `r${Math.random().toString(36).slice(2, 9)}`,
      code: `VB-${Math.floor(100000 + Math.random() * 899999)}`,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setState((prev) => ({ ...prev, bookings: [created, ...prev.bookings] }));
    return created;
  }, []);

  const updateBookingStatus = useCallback((id: string, status: Booking["status"]) => {
    setState((prev) => ({
      ...prev,
      bookings: prev.bookings.map((b) => (b.id === id ? { ...b, status } : b)),
    }));
  }, []);

  const login = useCallback((email: string, name?: string) => {
    const user: SessionUser = {
      email,
      name: name?.trim() || (email.split("@")[0] ?? email).replace(/\./g, " "),
      role: email.trim().toLowerCase().startsWith("admin") ? "admin" : "cliente",
    };
    setState((prev) => ({ ...prev, user }));
    return user;
  }, []);

  const logout = useCallback(() => setState((prev) => ({ ...prev, user: null })), []);
  const resetDemoData = useCallback(() => setState({ ...initialState }), []);

  const value = useMemo<StoreApi>(
    () => ({
      ...state,
      ready,
      upsert,
      remove,
      toggleActive,
      addBooking,
      updateBookingStatus,
      login,
      logout,
      resetDemoData,
    }),
    [state, ready, upsert, remove, toggleActive, addBooking, updateBookingStatus, login, logout, resetDemoData],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore precisa estar dentro de StoreProvider");
  return ctx;
}

/* ---------- seletores utilitários ---------- */

export function useCatalog() {
  const { destinations, hotels, packages, banners, coupons } = useStore();
  return useMemo(() => {
    const activePackages = packages.filter((p) => p.active);
    return {
      destinations: destinations.filter((d) => d.active),
      hotels: hotels.filter((h) => h.active),
      packages: activePackages,
      banners: banners.filter((b) => b.active),
      coupons: coupons.filter((c) => c.active),
      hotelBySlug: (slug: string) => hotels.find((h) => h.slug === slug),
      destinationBySlug: (slug: string) => destinations.find((d) => d.slug === slug),
      packageBySlug: (slug: string) => packages.find((p) => p.slug === slug),
    };
  }, [destinations, hotels, packages, banners, coupons]);
}
