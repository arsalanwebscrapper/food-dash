import { useState, useEffect } from 'react';
import { Order } from '@/types';
import { orderService } from '@/services/orderService';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedOrders = await orderService.getAllOrders();
        setOrders(fetchedOrders);
      } catch (err) {
        setError('Failed to fetch orders');
        console.error('Orders fetch error:', err);
        setOrders([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const createOrder = async (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null);
      const id = await orderService.createOrder(order);
      const newOrder = { 
        ...order, 
        id, 
        createdAt: new Date(), 
        updatedAt: new Date() 
      };
      setOrders(prev => [newOrder, ...prev]);
      return id;
    } catch (err) {
      setError('Failed to create order');
      console.error('Create order error:', err);
      throw err;
    }
  };

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    try {
      setError(null);
      await orderService.updateOrderStatus(id, status);
      setOrders(prev =>
        prev.map(order =>
          order.id === id ? { ...order, status, updatedAt: new Date() } : order
        )
      );
    } catch (err) {
      setError('Failed to update order status');
      console.error('Update order status error:', err);
      throw err;
    }
  };

  const updatePaymentStatus = async (id: string, paymentStatus: Order['paymentStatus']) => {
    try {
      setError(null);
      await orderService.updatePaymentStatus(id, paymentStatus);
      setOrders(prev =>
        prev.map(order =>
          order.id === id ? { ...order, paymentStatus, updatedAt: new Date() } : order
        )
      );
    } catch (err) {
      setError('Failed to update payment status');
      console.error('Update payment status error:', err);
      throw err;
    }
  };

  const cancelOrder = async (id: string) => {
    try {
      setError(null);
      await orderService.cancelOrder(id);
      setOrders(prev =>
        prev.map(order =>
          order.id === id ? { ...order, status: 'cancelled' as Order['status'], updatedAt: new Date() } : order
        )
      );
    } catch (err) {
      setError('Failed to cancel order');
      console.error('Cancel order error:', err);
      throw err;
    }
  };

  const getOrdersByStatus = (status: Order['status']) => 
    orders.filter(order => order.status === status);

  const getTodaysOrders = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      orderDate.setHours(0, 0, 0, 0);
      return orderDate.getTime() === today.getTime();
    });
  };

  const getOrderStats = () => {
    const totalOrders = orders.length;
    const totalRevenue = orders
      .filter(order => order.paymentStatus === 'paid')
      .reduce((sum, order) => sum + order.totalAmount, 0);
    
    const todaysOrders = getTodaysOrders();
    const todaysRevenue = todaysOrders
      .filter(order => order.paymentStatus === 'paid')
      .reduce((sum, order) => sum + order.totalAmount, 0);

    const statusCounts = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<Order['status'], number>);

    return {
      totalOrders,
      totalRevenue,
      todaysOrders: todaysOrders.length,
      todaysRevenue,
      statusCounts
    };
  };

  return {
    orders,
    loading,
    error,
    createOrder,
    updateOrderStatus,
    updatePaymentStatus,
    cancelOrder,
    getOrdersByStatus,
    getTodaysOrders,
    getOrderStats
  };
};

export const useOrdersRealtime = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const unsubscribe = orderService.subscribeToOrders((fetchedOrders) => {
        setOrders(fetchedOrders);
        setLoading(false);
        setError(null);
      });

      return unsubscribe;
    } catch (err) {
      setError('Failed to subscribe to orders');
      setLoading(false);
      console.error('Orders subscription error:', err);
    }
  }, []);

  return { orders, loading, error };
};

export const useOrdersByStatus = (status: Order['status']) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const unsubscribe = orderService.subscribeToOrdersByStatus(status, (fetchedOrders) => {
        setOrders(fetchedOrders);
        setLoading(false);
        setError(null);
      });

      return unsubscribe;
    } catch (err) {
      setError('Failed to subscribe to orders by status');
      setLoading(false);
      console.error('Orders by status subscription error:', err);
    }
  }, [status]);

  return { orders, loading, error };
};