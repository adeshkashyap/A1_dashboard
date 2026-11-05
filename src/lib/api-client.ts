// EstateFlow local data store — localStorage + seeded dummy data (no backend)

import {
  DEMO_LEADS,
  DEMO_PROPERTIES,
  DEMO_REFERRALS,
  DEMO_REPS,
  DEMO_SETTINGS,
  DEMO_SUBSCRIPTION_PLANS,
  DEMO_USER,
  DEMO_WHATSAPP_METRICS,
  DEMO_WHATSAPP_STATUS,
  computeDemoStats,
} from "./dummy-data";
import type {
  AgencySettings,
  DashboardStats,
  Lead,
  Property,
  ReferralDiscount,
  SalesRep,
  User,
  WhatsAppMetrics,
  WhatsAppStatus,
} from "./types";

export type {
  AgencySettings,
  DashboardStats,
  Lead,
  Property,
  ReferralDiscount,
  SalesRep,
  User,
  WhatsAppMetrics,
  WhatsAppStatus,
};

// ============================================
// STORAGE HELPERS
// ============================================

const KEYS = {
  leads: "estateflow_leads",
  properties: "estateflow_properties",
  reps: "estateflow_reps",
  settings: "estateflow_settings",
  referrals: "estateflow_referrals",
  whatsapp: "estateflow_whatsapp",
  seeded: "estateflow_seeded_v2",
} as const;

const SEED_VERSION = "v2";

function uid(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

function ensureSeed() {
  if (typeof localStorage === "undefined") return;
  if (localStorage.getItem(KEYS.seeded) === SEED_VERSION) return;

  // Drop legacy seed flag so images/data refresh for returning demo users
  localStorage.removeItem("estateflow_seeded");

  write(KEYS.leads, DEMO_LEADS);
  write(KEYS.properties, DEMO_PROPERTIES);
  write(KEYS.reps, DEMO_REPS);
  write(KEYS.settings, DEMO_SETTINGS);
  write(KEYS.referrals, DEMO_REFERRALS);
  write(KEYS.whatsapp, DEMO_WHATSAPP_STATUS);
  localStorage.setItem(KEYS.seeded, SEED_VERSION);
}

function withRep(lead: Lead, reps: SalesRep[]): Lead {
  if (!lead.assignedRepId) return { ...lead, assignedRep: undefined };
  const rep = reps.find((r) => r.id === lead.assignedRepId);
  return { ...lead, assignedRep: rep };
}

function delay<T>(value: T, ms = 120): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

// ============================================
// LOCAL API CLIENT
// ============================================

export const api = {
  auth: {
    requestOtp: async (): Promise<{ success: boolean; message?: string }> =>
      delay({ success: true, message: "Demo mode — OTP skipped" }),

    verifyOtp: async (): Promise<{ accessToken: string; dealer: User }> =>
      delay({ accessToken: "demo-token", dealer: DEMO_USER }),

    login: async (): Promise<{ accessToken: string; dealer: User }> =>
      delay({ accessToken: "demo-token", dealer: DEMO_USER }),

    signup: async (): Promise<{ success: boolean; message?: string }> =>
      delay({ success: true, message: "Demo mode — account ready" }),

    validateOtp: async (): Promise<{ isValid: boolean }> =>
      delay({ isValid: true }),

    verifyPhoneEmail: async (): Promise<{ success: boolean; dealer: User }> =>
      delay({ success: true, dealer: DEMO_USER }),

    requestOtpSMS: async (): Promise<{
      success: boolean;
      message?: string;
      error?: string;
    }> => delay({ success: true, message: "Demo mode — SMS skipped" }),

    verifyOtpSMS: async (): Promise<{ accessToken: string; dealer: User }> =>
      delay({ accessToken: "demo-token", dealer: DEMO_USER }),
  },

  subscription: {
    listPlans: async () => delay([...DEMO_SUBSCRIPTION_PLANS]),

    getStatus: async () =>
      delay({
        status: "active",
        plan: { id: "pro", name: "Pro" },
      }),

    createCheckout: async (planId: string, gateway: "razorpay" | "stripe") =>
      delay({
        success: true,
        gateway,
        subscription: { planId, status: "active" },
      }),

    getInvoices: async () => delay([]),
  },

  leads: {
    list: async (_page = 1, _limit = 20): Promise<Lead[]> => {
      ensureSeed();
      const reps = read<SalesRep[]>(KEYS.reps, DEMO_REPS);
      const leads = read<Lead[]>(KEYS.leads, DEMO_LEADS).map((l) =>
        withRep(l, reps)
      );
      return delay(leads);
    },

    create: async (
      data: Partial<Lead> & {
        buyerName?: string;
        buyerPhone?: string;
        requirements?: string;
        budget?: number;
        location?: string;
      }
    ): Promise<Lead> => {
      ensureSeed();
      const leads = read<Lead[]>(KEYS.leads, DEMO_LEADS);
      const reps = read<SalesRep[]>(KEYS.reps, DEMO_REPS);
      const now = new Date().toISOString();
      const lead: Lead = {
        id: uid("lead"),
        pdId: `PD-${1000 + leads.length + 1}`,
        buyerName: data.buyerName || "New Buyer",
        buyerPhone: data.buyerPhone || "",
        requirements: data.requirements || "",
        budget: data.budget ?? 0,
        status: data.status || "NEW",
        location: data.location || "",
        assignedRepId: data.assignedRepId,
        createdAt: now,
        updatedAt: now,
      };
      const next = [lead, ...leads];
      write(KEYS.leads, next);
      return delay(withRep(lead, reps));
    },

    update: async (id: string, data: Partial<Lead>): Promise<Lead> => {
      ensureSeed();
      const leads = read<Lead[]>(KEYS.leads, DEMO_LEADS);
      const reps = read<SalesRep[]>(KEYS.reps, DEMO_REPS);
      const idx = leads.findIndex((l) => l.id === id);
      if (idx === -1) throw new Error("Lead not found");
      const updated: Lead = {
        ...leads[idx],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      leads[idx] = updated;
      write(KEYS.leads, leads);
      return delay(withRep(updated, reps));
    },

    delete: async (id: string): Promise<void> => {
      ensureSeed();
      const leads = read<Lead[]>(KEYS.leads, DEMO_LEADS).filter(
        (l) => l.id !== id
      );
      write(KEYS.leads, leads);
      await delay(undefined);
    },
  },

  properties: {
    list: async (_page = 1, _limit = 20): Promise<Property[]> => {
      ensureSeed();
      return delay(read<Property[]>(KEYS.properties, DEMO_PROPERTIES));
    },

    create: async (data: Partial<Property>): Promise<Property> => {
      ensureSeed();
      const properties = read<Property[]>(KEYS.properties, DEMO_PROPERTIES);
      const now = new Date().toISOString();
      const property: Property = {
        id: uid("prop"),
        title: data.title || "Untitled Property",
        bhk: data.bhk,
        sqft: data.sqft,
        price: data.price ?? 0,
        location: data.location,
        category: data.category || (data.bhk ? `${data.bhk}BHK` : "Other"),
        reraNo: data.reraNo,
        amenities: data.amenities,
        images: data.images || (data.image ? [data.image] : []),
        image: data.image || data.images?.[0],
        available: data.available ?? true,
        description: data.description,
        possession: data.possession,
        createdAt: now,
        updatedAt: now,
      };
      write(KEYS.properties, [property, ...properties]);
      return delay(property);
    },

    update: async (id: string, data: Partial<Property>): Promise<Property> => {
      ensureSeed();
      const properties = read<Property[]>(KEYS.properties, DEMO_PROPERTIES);
      const idx = properties.findIndex((p) => p.id === id);
      if (idx === -1) throw new Error("Property not found");
      const updated: Property = {
        ...properties[idx],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      if (data.images?.[0]) updated.image = data.images[0];
      properties[idx] = updated;
      write(KEYS.properties, properties);
      return delay(updated);
    },

    delete: async (id: string): Promise<void> => {
      ensureSeed();
      write(
        KEYS.properties,
        read<Property[]>(KEYS.properties, DEMO_PROPERTIES).filter(
          (p) => p.id !== id
        )
      );
      await delay(undefined);
    },
  },

  salesReps: {
    list: async (): Promise<SalesRep[]> => {
      ensureSeed();
      return delay(read<SalesRep[]>(KEYS.reps, DEMO_REPS));
    },

    create: async (data: Partial<SalesRep>): Promise<SalesRep> => {
      ensureSeed();
      const reps = read<SalesRep[]>(KEYS.reps, DEMO_REPS);
      const rep: SalesRep = {
        id: uid("rep"),
        name: data.name || "New Rep",
        phone: data.phone || "",
        email: data.email,
        active: data.active ?? true,
        commission: data.commission ?? 2,
        monthlyTarget: data.monthlyTarget ?? 5,
        leadsHandled: 0,
        conversionRate: 0,
      };
      write(KEYS.reps, [rep, ...reps]);
      return delay(rep);
    },

    update: async (id: string, data: Partial<SalesRep>): Promise<SalesRep> => {
      ensureSeed();
      const reps = read<SalesRep[]>(KEYS.reps, DEMO_REPS);
      const idx = reps.findIndex((r) => r.id === id);
      if (idx === -1) throw new Error("Sales rep not found");
      const updated = { ...reps[idx], ...data };
      reps[idx] = updated;
      write(KEYS.reps, reps);
      return delay(updated);
    },

    delete: async (id: string): Promise<void> => {
      ensureSeed();
      write(
        KEYS.reps,
        read<SalesRep[]>(KEYS.reps, DEMO_REPS).filter((r) => r.id !== id)
      );
      await delay(undefined);
    },
  },

  referrals: {
    list: async (): Promise<ReferralDiscount[]> => {
      ensureSeed();
      return delay(read<ReferralDiscount[]>(KEYS.referrals, DEMO_REFERRALS));
    },

    create: async (
      data: Partial<ReferralDiscount>
    ): Promise<ReferralDiscount> => {
      ensureSeed();
      const list = read<ReferralDiscount[]>(KEYS.referrals, DEMO_REFERRALS);
      const item: ReferralDiscount = {
        id: uid("ref"),
        code: data.code || "CODE",
        discount: data.discount ?? 0,
        type: data.type || "percentage",
        active: data.active ?? true,
        usageLimit: data.usageLimit ?? 100,
        usedCount: 0,
        expiresAt: data.expiresAt,
      };
      write(KEYS.referrals, [item, ...list]);
      return delay(item);
    },

    update: async (
      id: string,
      data: Partial<ReferralDiscount>
    ): Promise<ReferralDiscount> => {
      ensureSeed();
      const list = read<ReferralDiscount[]>(KEYS.referrals, DEMO_REFERRALS);
      const idx = list.findIndex((r) => r.id === id);
      if (idx === -1) throw new Error("Referral not found");
      list[idx] = { ...list[idx], ...data };
      write(KEYS.referrals, list);
      return delay(list[idx]);
    },

    delete: async (id: string): Promise<void> => {
      ensureSeed();
      write(
        KEYS.referrals,
        read<ReferralDiscount[]>(KEYS.referrals, DEMO_REFERRALS).filter(
          (r) => r.id !== id
        )
      );
      await delay(undefined);
    },
  },

  whatsapp: {
    status: async (): Promise<WhatsAppStatus> => {
      ensureSeed();
      return delay(read<WhatsAppStatus>(KEYS.whatsapp, DEMO_WHATSAPP_STATUS));
    },

    qr: async (): Promise<{ base64: string }> =>
      delay({
        base64:
          "data:image/svg+xml;base64," +
          btoa(
            `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect fill="#fff" width="200" height="200"/><text x="100" y="100" text-anchor="middle" fill="#111" font-size="14">Demo QR</text></svg>`
          ),
      }),

    restart: async (): Promise<void> => {
      ensureSeed();
      write(KEYS.whatsapp, {
        ...DEMO_WHATSAPP_STATUS,
        connected: true,
        status: "CONNECTED",
        state: "CONNECTED",
      });
      await delay(undefined);
    },

    logout: async (): Promise<void> => {
      ensureSeed();
      write(KEYS.whatsapp, {
        connected: false,
        connecting: false,
        status: "DISCONNECTED",
        state: "DISCONNECTED",
      });
      await delay(undefined);
    },

    getMetrics: async (): Promise<WhatsAppMetrics> =>
      delay({
        ...DEMO_WHATSAPP_METRICS,
        timestamp: new Date().toISOString(),
      }),
  },

  settings: {
    get: async (): Promise<AgencySettings> => {
      ensureSeed();
      return delay(read<AgencySettings>(KEYS.settings, DEMO_SETTINGS));
    },

    update: async (
      data: Partial<AgencySettings>
    ): Promise<AgencySettings> => {
      ensureSeed();
      const current = read<AgencySettings>(KEYS.settings, DEMO_SETTINGS);
      const next = { ...current, ...data };
      write(KEYS.settings, next);
      return delay(next);
    },
  },

  stats: {
    get: async (): Promise<DashboardStats> => {
      ensureSeed();
      const leads = read<Lead[]>(KEYS.leads, DEMO_LEADS);
      const properties = read<Property[]>(KEYS.properties, DEMO_PROPERTIES);
      const reps = read<SalesRep[]>(KEYS.reps, DEMO_REPS);
      const whatsapp = read<WhatsAppStatus>(KEYS.whatsapp, DEMO_WHATSAPP_STATUS);
      return delay(computeDemoStats(leads, properties, reps, whatsapp));
    },
  },

  company: {
    updateProfile: async (data: Record<string, unknown>) => {
      const userRaw = localStorage.getItem("user_data");
      const user: User = userRaw ? JSON.parse(userRaw) : { ...DEMO_USER };
      const updated: User = {
        ...user,
        companyProfile: {
          ...user.companyProfile,
          companyName: (data.companyName as string) || user.companyProfile?.companyName,
          companyType: (data.companyType as string) || user.companyProfile?.companyType,
          botName: (data.botName as string) || user.companyProfile?.botName,
          botTone: (data.botTone as string) || user.companyProfile?.botTone,
          address: (data.address as string) || user.companyProfile?.address,
        },
      };
      localStorage.setItem("user_data", JSON.stringify(updated));
      return delay(updated);
    },
  },
};

export default api;

export { DEMO_USER };
