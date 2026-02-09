// GharBot API Client - Connects to Mom's Kitchen Backend
// PRESERVES all backend endpoints - only transforms display layer

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3002';



// ============================================
// TYPE DEFINITIONS (Display Layer)
// ============================================

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
    status: 'active' | 'inactive' | 'past_due' | 'incomplete';
    planId: string;
    expiresAt?: string;
    currentPeriodEnd?: string;
  };
}

export interface Lead {
  id: string;
  pdId: string; // PD-1234 (transformed from MK-1234)
  buyerName: string;
  buyerPhone: string;
  requirements: string; // "3BHK Sector 49"
  budget: number;
  status: 'NEW' | 'QUALIFIED' | 'VISIT' | 'CLOSED' | 'LOST';
  location: string;
  assignedRepId?: string;
  assignedRep?: SalesRep;
  createdAt: string;
  updatedAt: string;
}

export interface Property {
  id: string;
  title: string; // "3BHK Luxury Apartment"
  bhk?: number;
  sqft?: number;
  price: number;
  location?: string;
  category: string; // "2BHK", "3BHK", "Villa"
  reraNo?: string;
  amenities?: string | string[];
  images?: string[];
  image?: string; // Backward compatibility - first image
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
  type: 'percentage' | 'fixed';
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
  radius: number; // km
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

// ============================================
// HELPERS
// ============================================

const getAuthHeaders = (extraHeaders: Record<string, string> = {}) => {
  const token = localStorage.getItem('auth_token');
  if (!token) return extraHeaders;
  
  return {
    ...extraHeaders,
    'Authorization': `Bearer ${token}`
  };
};

// ============================================
// RESPONSE TRANSFORMERS
// ============================================

// Transform backend Order → Frontend Lead
function transformOrderToLead(order: {
  id: string;
  shortId?: string;
  customerName: string;
  customerPhone: string;
  items: string;
  amount: number;
  status: string;
  address: string;
  assignedBoyId?: string;
  assignedBoy?: {
    id: string;
    name: string;
    phone: string;
    email?: string;
    active: boolean;
  };
  createdAt: string;
  updatedAt: string;
}): Lead {
  const statusMap: Record<string, Lead['status']> = {
    'pending': 'NEW',
    'confirmed': 'QUALIFIED',
    'shipped': 'VISIT',
    'delivered': 'CLOSED',
    'cancelled': 'LOST'
  };

  return {
    id: order.id,
    pdId: order.shortId?.replace('MK-', 'PD-') || `PD-${order.id.slice(-4)}`,
    buyerName: order.customerName,
    buyerPhone: order.customerPhone,
    requirements: order.items,
    budget: order.amount,
    status: statusMap[order.status] || 'NEW',
    location: order.address,
    assignedRepId: order.assignedBoyId,
    assignedRep: order.assignedBoy ? transformChefToRep(order.assignedBoy) : undefined,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt
  };
}

// Transform backend Property → Frontend Property (now mostly pass-through)
function transformInventoryToProperty(item: {
  id: string;
  title?: string;
  name?: string;
  bhk?: number;
  sqft?: number;
  price: number;
  location?: string;
  category: string;
  reraNo?: string;
  amenities?: string | string[];
  images?: string | string[];
  image?: string;
  available: boolean;
  description?: string;
  possession?: string;
  createdAt: string;
  updatedAt: string;
}): Property {
  // Backend now returns proper GharBot schema, just ensure compatibility
  return {
    id: item.id,
    title: item.title || item.name || '',
    bhk: item.bhk,
    sqft: item.sqft,
    price: item.price,
    location: item.location,
    category: item.category,
    reraNo: item.reraNo,
    amenities: item.amenities,
    images: item.images ? (typeof item.images === 'string' ? JSON.parse(item.images) : item.images) : [],
    image: item.image,
    available: item.available,
    description: item.description,
    possession: item.possession,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt
  };
}

// Transform backend Chef → Frontend SalesRep
function transformChefToRep(chef: {
  id: string;
  name: string;
  phone: string;
  email?: string;
  active: boolean;
}): SalesRep {
  return {
    id: chef.id,
    name: chef.name,
    phone: chef.phone,
    email: chef.email,
    active: chef.active,
    commission: 0,
    monthlyTarget: 100,
    leadsHandled: 0,
    conversionRate: 0
  };
}

// Transform backend Coupon → Frontend ReferralDiscount
function transformCouponToReferral(coupon: {
  id: string;
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  active: boolean;
  usageLimit: number;
  usedCount: number;
  expiresAt?: string;
}): ReferralDiscount {
  return {
    id: coupon.id,
    code: coupon.code,
    discount: coupon.discount,
    type: coupon.type,
    active: coupon.active,
    usageLimit: coupon.usageLimit,
    usedCount: coupon.usedCount,
    expiresAt: coupon.expiresAt
  };
}

// Transform backend stats → Frontend dashboard stats
function transformStats(stats: {
  ordersToday?: number;
  totalPendingAmount?: number;
  readyForDelivery?: number;
  whatsappStatus?: WhatsAppStatus;
}): DashboardStats {
  return {
    leadsToday: stats.ordersToday || 0,
    pipelineValue: stats.totalPendingAmount || 0,
    activeGroups: stats.readyForDelivery || 0,
    conversionRate: 68,
    propertiesLive: 47,
    topRep: {
      name: 'Amit Sharma',
      conversionRate: 78
    },
    whatsappStatus: stats.whatsappStatus || { connected: false, status: 'DISCONNECTED' }
  };
}

// ============================================
// API CLIENT
// ============================================

export const api = {
  // ============================================
  // AUTHENTICATION (Preserved)
  // ============================================
  auth: {
    requestOtp: async (email: string, isSignup: boolean): Promise<{ success: boolean; message?: string }> => {
      const endpoint = isSignup ? '/api/auth/signup/request-otp' : '/api/auth/login/request-otp';
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to request OTP');
      }
      
      return response.json();
    },

    verifyOtp: async (email: string, otp: string, isSignup: boolean, extraData?: Record<string, unknown>): Promise<{ accessToken: string; dealer: User }> => {
      const endpoint = isSignup ? '/api/auth/signup/verify-otp' : '/api/auth/login/verify-otp';
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, ...extraData })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Invalid or expired OTP');
      }
      
      return response.json();
    },

    login: async (email: string, password?: string): Promise<{ accessToken: string; dealer: User }> => {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
      }
      return response.json();
    },

    signup: async (email: string, password: string, name: string, phone?: string): Promise<{ success: boolean; message?: string }> => {
      const response = await fetch(`${API_BASE}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, phone })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Signup failed');
      }
      return response.json();
    },

    validateOtp: async (identifier: string, otp: string, isPhone: boolean): Promise<{ isValid: boolean }> => {
      const response = await fetch(`${API_BASE}/api/auth/validate-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, otp, isPhone })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Invalid or expired OTP');
      }
      return response.json();
    },

    verifyPhoneEmail: async (userJsonUrl: string): Promise<{ success: boolean; dealer: User }> => {
      const response = await fetch(`${API_BASE}/api/auth/verify-phone-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_json_url: userJsonUrl })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Phone verification failed');
      }
      return response.json();
    },

    requestOtpSMS: async (phone: string): Promise<{ success: boolean; message?: string; error?: string }> => {
      const response = await fetch(`${API_BASE}/api/auth/signup/request-otp-sms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send SMS');
      }
      
      return response.json();
    },

    verifyOtpSMS: async (data: Record<string, unknown>): Promise<{ accessToken: string; dealer: User }> => {
      const response = await fetch(`${API_BASE}/api/auth/signup/verify-otp-sms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'OTP verification failed');
      }
      
      return response.json();
    }
  },

  // ============================================
  // SUBSCRIPTION & BILLING (New)
  // ============================================
  subscription: {
    listPlans: async (): Promise<any[]> => {
      const response = await fetch(`${API_BASE}/api/subscription/plans`, {
        headers: getAuthHeaders()
      });
      return response.json();
    },

    getStatus: async (): Promise<{ status: string; plan?: { id: string; name: string } }> => {
      const response = await fetch(`${API_BASE}/api/subscription/status`, {
        headers: getAuthHeaders()
      });
      return response.json();
    },

    createCheckout: async (planId: string, gateway: 'razorpay' | 'stripe'): Promise<{ success?: boolean; subscription?: any; gateway: string; orderId?: string; checkoutUrl?: string }> => {
      const response = await fetch(`${API_BASE}/api/subscription/create-checkout`, {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ planId, gateway })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to initiate checkout');
      }
      
      return response.json();
    },

    getInvoices: async (): Promise<any[]> => {
      const response = await fetch(`${API_BASE}/api/subscription/invoices`, {
        headers: getAuthHeaders()
      });
      return response.json();
    }
  },

  // ============================================
  // LEADS (Backend: Orders)
  // ============================================
  leads: {
    list: async (page = 1, limit = 20): Promise<Lead[]> => {
      const response = await fetch(`${API_BASE}/api/orders?page=${page}&limit=${limit}`, {
        headers: getAuthHeaders()
      });
      const orders = await response.json();
      return orders.map(transformOrderToLead);
    },

    update: async (id: string, data: Partial<Lead>): Promise<Lead> => {
      // Reverse transform: Lead status → Order status
      const statusMap: Record<Lead['status'], string> = {
        'NEW': 'pending',
        'QUALIFIED': 'confirmed',
        'VISIT': 'shipped',
        'CLOSED': 'delivered',
        'LOST': 'cancelled'
      };

      const backendData: Record<string, unknown> = {};
      if (data.status) backendData.status = statusMap[data.status];
      if (data.buyerName) backendData.customerName = data.buyerName;
      if (data.buyerPhone) backendData.customerPhone = data.buyerPhone;
      if (data.location) backendData.address = data.location;
      if (data.assignedRepId) backendData.assignedBoyId = data.assignedRepId;

      const response = await fetch(`${API_BASE}/api/orders/${id}`, {
        method: 'PATCH',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(backendData)
      });

      const order = await response.json();
      return transformOrderToLead(order);
    }
  },

  // ============================================
  // PROPERTIES (Backend: Inventory)
  // ============================================
  properties: {
    list: async (page = 1, limit = 20): Promise<Property[]> => {
      const response = await fetch(`${API_BASE}/api/inventory?page=${page}&limit=${limit}`, {
        headers: getAuthHeaders()
      });
      const inventory = await response.json();
      return inventory.map(transformInventoryToProperty);
    },

    create: async (data: Partial<Property>): Promise<Property> => {
      // Transform Property → InventoryItem
      const backendData = {
        name: data.title,
        price: data.price,
        category: data.category || `${data.bhk}BHK`,
        image: data.images?.[0],
        available: data.available ?? true
      };

      const response = await fetch(`${API_BASE}/api/inventory`, {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(backendData)
      });

      const item = await response.json();
      return transformInventoryToProperty(item);
    },

    update: async (id: string, data: Partial<Property>): Promise<Property> => {
      const backendData: Record<string, unknown> = {};
      if (data.title) backendData.name = data.title;
      if (data.price !== undefined) backendData.price = data.price;
      if (data.category) backendData.category = data.category;
      if (data.images?.[0]) backendData.image = data.images[0];
      if (data.available !== undefined) backendData.available = data.available;

      const response = await fetch(`${API_BASE}/api/inventory/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(backendData)
      });

      const item = await response.json();
      return transformInventoryToProperty(item);
    },

    delete: async (id: string): Promise<void> => {
      await fetch(`${API_BASE}/api/inventory/${id}`, { 
        method: 'DELETE',
        headers: getAuthHeaders()
      });
    }
  },

  // ============================================
  // SALES REPS (Backend: Chefs)
  // ============================================
  salesReps: {
    list: async (): Promise<SalesRep[]> => {
      const response = await fetch(`${API_BASE}/api/sales-reps`, {
        headers: getAuthHeaders()
      });
      const reps = await response.json();
      return reps.map(transformChefToRep);
    },

    create: async (data: Partial<SalesRep>): Promise<SalesRep> => {
      const backendData = {
        name: data.name,
        phone: data.phone,
        active: data.active ?? true
      };

      const response = await fetch(`${API_BASE}/api/chefs`, {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(backendData)
      });

      const chef = await response.json();
      return transformChefToRep(chef);
    },

    update: async (id: string, data: Partial<SalesRep>): Promise<SalesRep> => {
      const response = await fetch(`${API_BASE}/api/chefs/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(data)
      });

      const chef = await response.json();
      return transformChefToRep(chef);
    },

    delete: async (id: string): Promise<void> => {
      await fetch(`${API_BASE}/api/chefs/${id}`, { 
        method: 'DELETE',
        headers: getAuthHeaders()
      });
    }
  },

  // ============================================
  // REFERRAL DISCOUNTS (Backend: Coupons)
  // ============================================
  referrals: {
    list: async (): Promise<ReferralDiscount[]> => {
      const response = await fetch(`${API_BASE}/api/coupons`, {
        headers: getAuthHeaders()
      });
      const coupons = await response.json();
      return coupons.map(transformCouponToReferral);
    },

    create: async (data: Partial<ReferralDiscount>): Promise<ReferralDiscount> => {
      const response = await fetch(`${API_BASE}/api/coupons`, {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(data)
      });

      const coupon = await response.json();
      return transformCouponToReferral(coupon);
    },

    update: async (id: string, data: Partial<ReferralDiscount>): Promise<ReferralDiscount> => {
      const response = await fetch(`${API_BASE}/api/coupons/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const coupon = await response.json();
      return transformCouponToReferral(coupon);
    },

    delete: async (id: string): Promise<void> => {
      await fetch(`${API_BASE}/api/coupons/${id}`, { method: 'DELETE' });
    }
  },

  // ============================================
  // WHATSAPP (Preserved Exactly)
  // ============================================
  whatsapp: {
    status: async (): Promise<WhatsAppStatus> => {
      const response = await fetch(`${API_BASE}/api/whatsapp/status`, {
        headers: getAuthHeaders()
      });
      return response.json();
    },

    qr: async (): Promise<{ base64: string }> => {
      const response = await fetch(`${API_BASE}/api/whatsapp/qr`, {
        headers: getAuthHeaders()
      });
      return response.json();
    },

    restart: async (): Promise<void> => {
      await fetch(`${API_BASE}/api/whatsapp/restart`, { 
        method: 'POST',
        headers: getAuthHeaders()
      });
    },

    logout: async (): Promise<void> => {
      await fetch(`${API_BASE}/api/whatsapp/logout`, { 
        method: 'POST',
        headers: getAuthHeaders()
      });
    },

    getMetrics: async (): Promise<WhatsAppMetrics> => {
      const response = await fetch(`${API_BASE}/api/whatsapp/metrics`, {
        headers: getAuthHeaders()
      });
      return response.json();
    }
  },

  // ============================================
  // SETTINGS (Backend: Settings)
  // ============================================
  settings: {
    get: async (): Promise<AgencySettings> => {
      const response = await fetch(`${API_BASE}/api/settings`, {
        headers: getAuthHeaders()
      });
      const settings = await response.json();
      
      return {
        name: settings.name || 'GharBot Agency',
        phone: settings.phone,
        address: settings.address,
        lat: settings.lat,
        lng: settings.lng,
        radius: settings.radius,
        logo: settings.qrCodeImage
      };
    },

    update: async (data: Partial<AgencySettings>): Promise<AgencySettings> => {
      const backendData: Record<string, unknown> = {};
      if (data.name) backendData.name = data.name;
      if (data.phone) backendData.phone = data.phone;
      if (data.address) backendData.address = data.address;
      if (data.lat) backendData.lat = data.lat;
      if (data.lng) backendData.lng = data.lng;
      if (data.radius) backendData.radius = data.radius;
      if (data.logo) backendData.qrCodeImage = data.logo;

      const response = await fetch(`${API_BASE}/api/settings`, {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(backendData)
      });

      const settings = await response.json();
      return {
        name: settings.name,
        phone: settings.phone,
        address: settings.address,
        lat: settings.lat,
        lng: settings.lng,
        radius: settings.radius,
        logo: settings.qrCodeImage
      };
    }
  },

  // ============================================
  // DASHBOARD STATS
  // ============================================
  stats: {
    get: async (): Promise<DashboardStats> => {
      const response = await fetch(`${API_BASE}/api/stats`, {
        headers: getAuthHeaders()
      });
      const stats = await response.json();
      return transformStats(stats);
    }
  },

  // ============================================
  // COMPANY & DEALER (New)
  // ============================================
  company: {
    updateProfile: async (data: Record<string, unknown>): Promise<any> => {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE}/api/company/profile`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update profile');
      }
      
      return response.json();
    }
  }
};

export default api;
