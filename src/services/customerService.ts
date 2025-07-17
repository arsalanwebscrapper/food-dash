import { 
  ref, 
  push, 
  set, 
  update, 
  remove, 
  get, 
  onValue,
  off
} from 'firebase/database';
import { realtimeDb } from '@/lib/firebase';
import { Customer } from '@/types';

const COLLECTION_NAME = 'customers';

export const customerService = {
  // Create a new customer
  async createCustomer(customer: Omit<Customer, 'id' | 'createdAt'>): Promise<string> {
    try {
      console.log('Creating customer:', customer);
      const customersRef = ref(realtimeDb, COLLECTION_NAME);
      const newCustomerRef = push(customersRef);
      
      const customerData = {
        ...customer,
        createdAt: Date.now()
      };
      
      await set(newCustomerRef, customerData);
      console.log('Customer created successfully with ID:', newCustomerRef.key);
      return newCustomerRef.key!;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  },

  // Get all customers
  async getAllCustomers(): Promise<Customer[]> {
    try {
      const customersRef = ref(realtimeDb, COLLECTION_NAME);
      const snapshot = await get(customersRef);
      
      if (!snapshot.exists()) {
        return [];
      }
      
      const data = snapshot.val();
      return Object.keys(data)
        .map(key => ({
          id: key,
          ...data[key],
          createdAt: data[key].createdAt ? new Date(data[key].createdAt) : new Date(),
          lastOrderDate: data[key].lastOrderDate ? new Date(data[key].lastOrderDate) : undefined
        }))
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()) as Customer[];
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  },

  // Get customer by email
  async getCustomerByEmail(email: string): Promise<Customer | null> {
    try {
      const customersRef = ref(realtimeDb, COLLECTION_NAME);
      const snapshot = await get(customersRef);
      
      if (!snapshot.exists()) {
        return null;
      }
      
      const data = snapshot.val();
      const customerEntry = Object.keys(data).find(key => data[key].email === email);
      
      if (customerEntry) {
        const customerData = data[customerEntry];
        return {
          id: customerEntry,
          ...customerData,
          createdAt: customerData.createdAt ? new Date(customerData.createdAt) : new Date(),
          lastOrderDate: customerData.lastOrderDate ? new Date(customerData.lastOrderDate) : undefined
        } as Customer;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching customer by email:', error);
      throw error;
    }
  },

  // Get customer by phone
  async getCustomerByPhone(phone: string): Promise<Customer | null> {
    try {
      const customersRef = ref(realtimeDb, COLLECTION_NAME);
      const snapshot = await get(customersRef);
      
      if (!snapshot.exists()) {
        return null;
      }
      
      const data = snapshot.val();
      const customerEntry = Object.keys(data).find(key => data[key].phone === phone);
      
      if (customerEntry) {
        const customerData = data[customerEntry];
        return {
          id: customerEntry,
          ...customerData,
          createdAt: customerData.createdAt ? new Date(customerData.createdAt) : new Date(),
          lastOrderDate: customerData.lastOrderDate ? new Date(customerData.lastOrderDate) : undefined
        } as Customer;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching customer by phone:', error);
      throw error;
    }
  },

  // Get a single customer
  async getCustomer(id: string): Promise<Customer | null> {
    try {
      const customerRef = ref(realtimeDb, `${COLLECTION_NAME}/${id}`);
      const snapshot = await get(customerRef);
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        return {
          id,
          ...data,
          createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
          lastOrderDate: data.lastOrderDate ? new Date(data.lastOrderDate) : undefined
        } as Customer;
      }
      return null;
    } catch (error) {
      console.error('Error fetching customer:', error);
      throw error;
    }
  },

  // Update a customer
  async updateCustomer(id: string, updates: Partial<Customer>): Promise<void> {
    try {
      const customerRef = ref(realtimeDb, `${COLLECTION_NAME}/${id}`);
      const updateData = { ...updates };
      
      // Convert dates to timestamps if they exist
      if (updateData.lastOrderDate) {
        updateData.lastOrderDate = updateData.lastOrderDate.getTime() as any;
      }
      
      await update(customerRef, updateData);
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  },

  // Delete a customer
  async deleteCustomer(id: string): Promise<void> {
    try {
      const customerRef = ref(realtimeDb, `${COLLECTION_NAME}/${id}`);
      await remove(customerRef);
    } catch (error) {
      console.error('Error deleting customer:', error);
      throw error;
    }
  },

  // Update customer's last order date
  async updateLastOrderDate(id: string, date: Date): Promise<void> {
    try {
      const customerRef = ref(realtimeDb, `${COLLECTION_NAME}/${id}`);
      await update(customerRef, {
        lastOrderDate: date.getTime()
      });
    } catch (error) {
      console.error('Error updating last order date:', error);
      throw error;
    }
  },

  // Get customers with recent orders (last 30 days)
  async getRecentCustomers(): Promise<Customer[]> {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const thirtyDaysAgoTime = thirtyDaysAgo.getTime();
      
      const customersRef = ref(realtimeDb, COLLECTION_NAME);
      const snapshot = await get(customersRef);
      
      if (!snapshot.exists()) {
        return [];
      }
      
      const data = snapshot.val();
      return Object.keys(data)
        .map(key => ({
          id: key,
          ...data[key],
          createdAt: data[key].createdAt ? new Date(data[key].createdAt) : new Date(),
          lastOrderDate: data[key].lastOrderDate ? new Date(data[key].lastOrderDate) : undefined
        }))
        .filter(customer => customer.lastOrderDate && customer.lastOrderDate.getTime() >= thirtyDaysAgoTime)
        .sort((a, b) => {
          if (!a.lastOrderDate || !b.lastOrderDate) return 0;
          return b.lastOrderDate.getTime() - a.lastOrderDate.getTime();
        }) as Customer[];
    } catch (error) {
      console.error('Error fetching recent customers:', error);
      throw error;
    }
  },

  // Search customers by name, email, or phone
  async searchCustomers(searchTerm: string): Promise<Customer[]> {
    try {
      const customersRef = ref(realtimeDb, COLLECTION_NAME);
      const snapshot = await get(customersRef);
      
      if (!snapshot.exists()) {
        return [];
      }
      
      const data = snapshot.val();
      const searchLower = searchTerm.toLowerCase();
      
      return Object.keys(data)
        .map(key => ({
          id: key,
          ...data[key],
          createdAt: data[key].createdAt ? new Date(data[key].createdAt) : new Date(),
          lastOrderDate: data[key].lastOrderDate ? new Date(data[key].lastOrderDate) : undefined
        }))
        .filter(customer => 
          customer.name?.toLowerCase().includes(searchLower) ||
          customer.email?.toLowerCase().includes(searchLower) ||
          customer.phone?.includes(searchTerm)
        )
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()) as Customer[];
    } catch (error) {
      console.error('Error searching customers:', error);
      throw error;
    }
  },

  // Subscribe to customers changes (real-time)
  subscribeToCustomers(callback: (customers: Customer[]) => void): () => void {
    const customersRef = ref(realtimeDb, COLLECTION_NAME);
    
    const unsubscribe = onValue(customersRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const customers = Object.keys(data)
          .map(key => ({
            id: key,
            ...data[key],
            createdAt: data[key].createdAt ? new Date(data[key].createdAt) : new Date(),
            lastOrderDate: data[key].lastOrderDate ? new Date(data[key].lastOrderDate) : undefined
          }))
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()) as Customer[];
        
        callback(customers);
      } else {
        callback([]);
      }
    });

    return () => off(customersRef, 'value', unsubscribe);
  },

  // Update order stats
  async updateOrderStats(id: string, orderValue: number): Promise<void> {
    try {
      const customerRef = ref(realtimeDb, `${COLLECTION_NAME}/${id}`);
      const snapshot = await get(customerRef);
      
      if (snapshot.exists()) {
        const customer = snapshot.val();
        await update(customerRef, {
          totalOrders: (customer.totalOrders || 0) + 1,
          totalSpent: (customer.totalSpent || 0) + orderValue,
          lastOrderDate: Date.now()
        });
      }
    } catch (error) {
      console.error('Error updating order stats:', error);
      throw error;
    }
  },

  // Add loyalty points
  async addLoyaltyPoints(id: string, points: number): Promise<void> {
    try {
      const customerRef = ref(realtimeDb, `${COLLECTION_NAME}/${id}`);
      const snapshot = await get(customerRef);
      
      if (snapshot.exists()) {
        const customer = snapshot.val();
        await update(customerRef, {
          loyaltyPoints: (customer.loyaltyPoints || 0) + points
        });
      }
    } catch (error) {
      console.error('Error adding loyalty points:', error);
      throw error;
    }
  }
};