import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getDestinations, getHotels, getPackages, getBanners, getCoupons, getCustomers, createDestination, updateDestination, deleteDestination, createHotel, updateHotel, deleteHotel, createPackage, updatePackage, deletePackage, createCoupon, updateCoupon, deleteCoupon } from "@/api/catalog";
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

const STORAGE_KEY = "voar-brasil-state-v2";

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
    // Attempt to load local state first for fast render
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...initialState, ...(JSON.parse(raw) as CatalogState) });
    } catch {
      /* estado padrão */
    }
    
    // Then fetch from database to sync
    const fetchDB = async () => {
      try {
        const [dbDestinations, dbHotels, dbPackages, dbBanners, dbCoupons, dbCustomers] = await Promise.all([
          getDestinations(),
          getHotels(),
          getPackages(),
          getBanners(),
          getCoupons(),
          getCustomers(),
        ]);
        
        setState(prev => ({
          ...prev,
          destinations: dbDestinations as any,
          hotels: dbHotels as any,
          packages: dbPackages as any,
          banners: dbBanners as any,
          coupons: dbCoupons as any,
          customers: dbCustomers as any,
        }));
      } catch (err) {
        console.error("Failed to sync store with DB", err);
      } finally {
        setReady(true);
      }
    };
    
    fetchDB();
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
      
      // Fire DB sync in background
      try {
        if (entity === "packages") {
          exists ? updatePackage({ data: item }) : createPackage({ data: item });
        } else if (entity === "destinations") {
          exists ? updateDestination({ data: item }) : createDestination({ data: item });
        } else if (entity === "hotels") {
          exists ? updateHotel({ data: item }) : createHotel({ data: item });
        } else if (entity === "coupons") {
          exists ? updateCoupon({ data: item }) : createCoupon({ data: item });
        }
      } catch(e) { console.error("Sync error", e) }

      const next = exists ? list.map((i) => (i.id === item.id ? item : i)) : [...list, item];
      return { ...prev, [entity]: next } as CatalogState;
    });
  }, []);

  const remove = useCallback((entity: Entity, id: string) => {
    setState((prev) => {
      // Fire DB sync in background
      try {
        if (entity === "packages") deletePackage({ data: { id } });
        else if (entity === "destinations") deleteDestination({ data: { id } });
        else if (entity === "hotels") deleteHotel({ data: { id } });
        else if (entity === "coupons") deleteCoupon({ data: { id } });
      } catch(e) { console.error("Sync error", e) }

      return {
        ...prev,
        [entity]: (prev[entity] as { id: string }[]).filter((i) => i.id !== id),
      };
    });
  }, []);

  const toggleActive = useCallback((entity: Entity, id: string) => {
    setState((prev) => {
      const list = prev[entity] as { id: string; active: boolean }[];
      const nextList = list.map((i) => i.id === id ? { ...i, active: !i.active } : i);
      const updatedItem = nextList.find((i) => i.id === id);

      // Fire DB sync in background
      if (updatedItem) {
        try {
          if (entity === "packages") updatePackage({ data: updatedItem });
          else if (entity === "destinations") updateDestination({ data: updatedItem });
          else if (entity === "hotels") updateHotel({ data: updatedItem });
          else if (entity === "coupons") updateCoupon({ data: updatedItem });
        } catch(e) { console.error("Sync error", e) }
      }

      return {
        ...prev,
        [entity]: nextList,
      };
    });
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
