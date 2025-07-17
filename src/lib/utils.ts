import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility functions for the restaurant application

// Format currency
export const formatCurrency = (amount: number): string => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

// Format date and time
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatDateTime = (date: Date): string => {
  return date.toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Calculate estimated delivery time
export const calculateDeliveryTime = (preparationTime: number): Date => {
  const now = new Date();
  const deliveryTime = new Date(now.getTime() + (preparationTime + 30) * 60000); // prep time + 30 min delivery
  return deliveryTime;
};

// Generate order ID
export const generateOrderId = (): string => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `FD${timestamp.slice(-6)}${random}`;
};

// Calculate loyalty points (1 point per ₹10 spent)
export const calculateLoyaltyPoints = (amount: number): number => {
  return Math.floor(amount / 10);
};

// Determine customer status based on orders and spending
export const determineCustomerStatus = (totalOrders: number, totalSpent: number): 'new' | 'active' | 'vip' | 'inactive' => {
  if (totalOrders === 0) return 'new';
  if (totalSpent >= 10000 || totalOrders >= 20) return 'vip';
  if (totalOrders >= 3) return 'active';
  return 'inactive';
};

// Get order status color
export const getOrderStatusColor = (status: string): string => {
  switch (status) {
    case 'pending': return 'text-yellow-600 bg-yellow-100';
    case 'confirmed': return 'text-blue-600 bg-blue-100';
    case 'preparing': return 'text-orange-600 bg-orange-100';
    case 'ready': return 'text-purple-600 bg-purple-100';
    case 'out-for-delivery': return 'text-indigo-600 bg-indigo-100';
    case 'delivered': return 'text-green-600 bg-green-100';
    case 'cancelled': return 'text-red-600 bg-red-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

// Get payment status color
export const getPaymentStatusColor = (status: string): string => {
  switch (status) {
    case 'pending': return 'text-yellow-600 bg-yellow-100';
    case 'paid': return 'text-green-600 bg-green-100';
    case 'failed': return 'text-red-600 bg-red-100';
    case 'refunded': return 'text-gray-600 bg-gray-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

// Validate email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number (Indian format)
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[91]?[0-9]{10}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Format phone number
export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  return phone;
};

// Calculate order total with tax
export const calculateOrderTotal = (subtotal: number, taxRate: number = 0.18): { subtotal: number; tax: number; total: number } => {
  const tax = Math.round(subtotal * taxRate);
  const total = subtotal + tax;
  return { subtotal, tax, total };
};

// Truncate text
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength - 3) + '...';
};

// Group items by property
export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce((groups, item) => {
    const value = String(item[key]);
    groups[value] = groups[value] || [];
    groups[value].push(item);
    return groups;
  }, {} as Record<string, T[]>);
};

// Debounce function
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Generate random color for avatars
export const getRandomColor = (seed: string): string => {
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500'
  ];
  
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};
