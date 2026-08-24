export type Board = "Café da manhã" | "Meia pensão" | "Pensão completa" | "All inclusive" | "Sem refeições";

export interface Destination {
  id: string;
  slug: string;
  name: string;
  uf: string;
  region: string;
  short: string;
  description: string;
  image: string;
  fromPrice: number;
  highlights: string[];
  active: boolean;
}

export interface Hotel {
  id: string;
  slug: string;
  name: string;
  destinationSlug: string;
  stars: number;
  rating: number;
  reviews: number;
  board: Board;
  address: string;
  description: string;
  image: string;
  gallery: string[];
  amenities: string[];
  nightPrice: number;
  active: boolean;
}

export interface Flight {
  airline: string;
  outbound: string;
  inbound: string;
  baggage: string;
  stops: number;
}

export type PackageBadge = "Oferta especial" | "Mais vendido" | "Últimas vagas" | "Melhor preço";

export interface TravelPackage {
  id: string;
  slug: string;
  title: string;
  destinationSlug: string;
  origin: string;
  hotelSlug: string;
  nights: number;
  board: Board;
  transfer: boolean;
  flight: Flight;
  price: number;
  oldPrice: number;
  installments: number;
  badges: PackageBadge[];
  seats: number;
  departure: string;
  ret: string;
  category: "Praia" | "Serra" | "Cidade" | "Resort";
  featured: boolean;
  active: boolean;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  link: string;
  image: string;
  startsAt: string;
  endsAt: string;
  active: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  percent: number;
  description: string;
  active: boolean;
}

export type BookingStatus = "Confirmada" | "Pendente" | "Concluída" | "Cancelada";

export interface Traveler {
  name: string;
  document: string;
  birth: string;
}

export interface PaymentProof {
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  /** Data URL do arquivo enviado (omitida quando o arquivo é grande demais para armazenar). */
  dataUrl?: string;
}

export interface Booking {
  id: string;
  code: string;
  packageSlug: string;
  packageTitle: string;
  destination: string;
  departure: string;
  ret: string;
  travelers: Traveler[];
  contactEmail: string;
  contactPhone: string;
  extras: string[];
  status: BookingStatus;
  total: number;
  paymentMethod: string;
  createdAt: string;
  customerName: string;
  proof?: PaymentProof;
}


export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string;
  since: string;
  bookings: number;
  spent: number;
}
