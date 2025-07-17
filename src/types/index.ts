// Types for the restaurant application
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  role: 'customer' | 'admin';
  createdAt: Date;
  lastLogin?: Date;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
  ingredients?: string[];
  preparationTime: number; // in minutes
  spiceLevel?: 'mild' | 'medium' | 'hot' | 'very-hot' | 'none';
  dietary?: ('vegetarian' | 'vegan' | 'gluten-free')[];
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  menuItemId: string;
  menuItem: MenuItem;
  quantity: number;
  specialInstructions?: string;
  price: number;
}

export interface Order {
  id: string;
  customerId: string;
  customer: User;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out-for-delivery' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'cash' | 'card' | 'upi';
  deliveryAddress: string;
  phone: string;
  estimatedDeliveryTime: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Promotion {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minimumOrderValue?: number;
  validFrom: Date;
  validUntil: Date;
  usageLimit?: number;
  usedCount: number;
  active: boolean;
  createdAt: Date;
}

export interface Customer {
  id: string;
  email: string;
  name: string;
  phone: string;
  addresses: string[];
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: Date;
  loyaltyPoints: number;
  status: 'new' | 'active' | 'vip' | 'inactive';
  createdAt: Date;
}