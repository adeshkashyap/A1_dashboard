export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  companyProfile?: {
    companyName?: string;
    companyType?: string;
    botName?: string;
    botTone?: string;
    address?: string;
  };
  subscription?: {
    status: "active" | "inactive" | "past_due" | "incomplete";
    planId: string;
    expiresAt?: string;
    currentPeriodEnd?: string;
  };
}

export interface Lead {
  id: string;
  pdId: string;
  buyerName: string;
  buyerPhone: string;
  requirements: string;
  budget: number;
  status: "NEW" | "QUALIFIED" | "VISIT" | "CLOSED" | "LOST";
  location: string;
  assignedRepId?: string;
  assignedRep?: SalesRep;
  createdAt: string;
  updatedAt: string;
}

export interface Property {
  id: string;
  title: string;
  bhk?: number;
  sqft?: number;
  price: number;
  location?: string;
  category: string;
  reraNo?: string;
  amenities?: string | string[];
  images?: string[];
  image?: string;
  available: boolean;
  description?: string;
  possession?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface SalesRep {
  id: string;
  name: string;
  phone: string;
  email?: string;
  active: boolean;
  commission?: number;
  monthlyTarget?: number;
  leadsHandled?: number;
  conversionRate?: number;
}

export interface ReferralDiscount {
  id: string;
  code: string;
  discount: number;
  type: "percentage" | "fixed";
  active: boolean;
  usageLimit: number;
  usedCount: number;
  expiresAt?: string;
}

export interface AgencySettings {
  name: string;
  phone: string;
  address: string;
  lat: number;
  lng: number;
  radius: number;
  logo?: string;
}

export interface WhatsAppStatus {
  connected: boolean;
  connecting?: boolean;
  state?: string;
  status: string;
  qrCode?: string;
  lastMessageAt?: string;
  me?: string;
}

export interface DashboardStats {
  leadsToday: number;
  pipelineValue: number;
  activeGroups: number;
  conversionRate: number;
  propertiesLive: number;
  topRep?: {
    name: string;
    conversionRate: number;
  };
  whatsappStatus: WhatsAppStatus;
}

export interface WhatsAppMetrics {
  instances: {
    total: number;
    active: number;
    inactive: number;
  };
  queue: {
    waiting: number;
    active: number;
    completed: number;
    failed: number;
  };
  timestamp: string;
}
