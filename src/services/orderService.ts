import { 
  ref, 
  push, 
  set, 
  update, 
  remove, 
  get, 
  onValue,
  off,
  serverTimestamp
} from 'firebase/database';
import { realtimeDb } from '@/lib/firebase';
import { Order, OrderItem } from '@/types';

const COLLECTION_NAME = 'orders';

export const orderService = {
  // Create a new order
  async createOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      console.log('Creating order:', order);
      const ordersRef = ref(realtimeDb, COLLECTION_NAME);
      const newOrderRef = push(ordersRef);
      
      const orderData = {
        ...order,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      
      await set(newOrderRef, orderData);
      console.log('Order created successfully with ID:', newOrderRef.key);
      return newOrderRef.key!;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  // Get all orders (admin)
  async getAllOrders(): Promise<Order[]> {
    try {
      const ordersRef = ref(realtimeDb, COLLECTION_NAME);
      const snapshot = await get(ordersRef);
      
      if (!snapshot.exists()) {
        return [];
      }
      
      const data = snapshot.val();
      return Object.keys(data)
        .map(key => ({
          id: key,
          ...data[key],
          createdAt: data[key].createdAt ? new Date(data[key].createdAt) : new Date(),
          updatedAt: data[key].updatedAt ? new Date(data[key].updatedAt) : new Date(),
          estimatedDeliveryTime: data[key].estimatedDeliveryTime ? new Date(data[key].estimatedDeliveryTime) : new Date()
        }))
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()) as Order[];
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  // Get orders by customer
  async getOrdersByCustomer(customerId: string): Promise<Order[]> {
    try {
      const ordersRef = ref(realtimeDb, COLLECTION_NAME);
      const snapshot = await get(ordersRef);
      
      if (!snapshot.exists()) {
        return [];
      }
      
      const data = snapshot.val();
      return Object.keys(data)
        .map(key => ({
          id: key,
          ...data[key],
          createdAt: data[key].createdAt ? new Date(data[key].createdAt) : new Date(),
          updatedAt: data[key].updatedAt ? new Date(data[key].updatedAt) : new Date(),
          estimatedDeliveryTime: data[key].estimatedDeliveryTime ? new Date(data[key].estimatedDeliveryTime) : new Date()
        }))
        .filter(order => order.customerId === customerId)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()) as Order[];
    } catch (error) {
      console.error('Error fetching customer orders:', error);
      throw error;
    }
  },

  // Get orders by status
  async getOrdersByStatus(status: Order['status']): Promise<Order[]> {
    try {
      const ordersRef = ref(realtimeDb, COLLECTION_NAME);
      const snapshot = await get(ordersRef);
      
      if (!snapshot.exists()) {
        return [];
      }
      
      const data = snapshot.val();
      return Object.keys(data)
        .map(key => ({
          id: key,
          ...data[key],
          createdAt: data[key].createdAt ? new Date(data[key].createdAt) : new Date(),
          updatedAt: data[key].updatedAt ? new Date(data[key].updatedAt) : new Date(),
          estimatedDeliveryTime: data[key].estimatedDeliveryTime ? new Date(data[key].estimatedDeliveryTime) : new Date()
        }))
        .filter(order => order.status === status)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()) as Order[];
    } catch (error) {
      console.error('Error fetching orders by status:', error);
      throw error;
    }
  },

  // Get today's orders
  async getTodaysOrders(): Promise<Order[]> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayTime = today.getTime();
      
      const ordersRef = ref(realtimeDb, COLLECTION_NAME);
      const snapshot = await get(ordersRef);
      
      if (!snapshot.exists()) {
        return [];
      }
      
      const data = snapshot.val();
      return Object.keys(data)
        .map(key => ({
          id: key,
          ...data[key],
          createdAt: data[key].createdAt ? new Date(data[key].createdAt) : new Date(),
          updatedAt: data[key].updatedAt ? new Date(data[key].updatedAt) : new Date(),
          estimatedDeliveryTime: data[key].estimatedDeliveryTime ? new Date(data[key].estimatedDeliveryTime) : new Date()
        }))
        .filter(order => new Date(order.createdAt).getTime() >= todayTime)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()) as Order[];
    } catch (error) {
      console.error('Error fetching today\'s orders:', error);
      throw error;
    }
  },

  // Get a single order
  async getOrder(id: string): Promise<Order | null> {
    try {
      const orderRef = ref(realtimeDb, `${COLLECTION_NAME}/${id}`);
      const snapshot = await get(orderRef);
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        return {
          id,
          ...data,
          createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
          updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
          estimatedDeliveryTime: data.estimatedDeliveryTime ? new Date(data.estimatedDeliveryTime) : new Date()
        } as Order;
      }
      return null;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  },

  // Update order status
  async updateOrderStatus(id: string, status: Order['status']): Promise<void> {
    try {
      const orderRef = ref(realtimeDb, `${COLLECTION_NAME}/${id}`);
      await update(orderRef, {
        status,
        updatedAt: Date.now()
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  // Update payment status
  async updatePaymentStatus(id: string, paymentStatus: Order['paymentStatus']): Promise<void> {
    try {
      const orderRef = ref(realtimeDb, `${COLLECTION_NAME}/${id}`);
      await update(orderRef, {
        paymentStatus,
        updatedAt: Date.now()
      });
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  },

  // Update order
  async updateOrder(id: string, updates: Partial<Order>): Promise<void> {
    try {
      const orderRef = ref(realtimeDb, `${COLLECTION_NAME}/${id}`);
      await update(orderRef, {
        ...updates,
        updatedAt: Date.now()
      });
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  },

  // Cancel order
  async cancelOrder(id: string): Promise<void> {
    try {
      const orderRef = ref(realtimeDb, `${COLLECTION_NAME}/${id}`);
      await update(orderRef, {
        status: 'cancelled' as Order['status'],
        updatedAt: Date.now()
      });
    } catch (error) {
      console.error('Error cancelling order:', error);
      throw error;
    }
  },

  // Subscribe to orders changes (real-time)
  subscribeToOrders(callback: (orders: Order[]) => void): () => void {
    const ordersRef = ref(realtimeDb, COLLECTION_NAME);
    
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const orders = Object.keys(data)
          .map(key => ({
            id: key,
            ...data[key],
            createdAt: data[key].createdAt ? new Date(data[key].createdAt) : new Date(),
            updatedAt: data[key].updatedAt ? new Date(data[key].updatedAt) : new Date(),
            estimatedDeliveryTime: data[key].estimatedDeliveryTime ? new Date(data[key].estimatedDeliveryTime) : new Date()
          }))
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()) as Order[];
        
        callback(orders);
      } else {
        callback([]);
      }
    });

    return () => off(ordersRef, 'value', unsubscribe);
  },

  // Subscribe to orders by status (real-time)
  subscribeToOrdersByStatus(status: Order['status'], callback: (orders: Order[]) => void): () => void {
    const ordersRef = ref(realtimeDb, COLLECTION_NAME);
    
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const orders = Object.keys(data)
          .map(key => ({
            id: key,
            ...data[key],
            createdAt: data[key].createdAt ? new Date(data[key].createdAt) : new Date(),
            updatedAt: data[key].updatedAt ? new Date(data[key].updatedAt) : new Date(),
            estimatedDeliveryTime: data[key].estimatedDeliveryTime ? new Date(data[key].estimatedDeliveryTime) : new Date()
          }))
          .filter(order => order.status === status)
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()) as Order[];
        
        callback(orders);
      } else {
        callback([]);
      }
    });

    return () => off(ordersRef, 'value', unsubscribe);
  }
};