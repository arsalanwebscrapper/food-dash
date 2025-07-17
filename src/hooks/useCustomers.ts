import { useState, useEffect } from 'react';
import { Customer } from '@/types';
import { customerService } from '@/services/customerService';

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedCustomers = await customerService.getAllCustomers();
        setCustomers(fetchedCustomers);
      } catch (err) {
        setError('Failed to fetch customers');
        console.error('Customers fetch error:', err);
        setCustomers([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const createCustomer = async (customer: Omit<Customer, 'id' | 'createdAt'>) => {
    try {
      setError(null);
      const id = await customerService.createCustomer(customer);
      const newCustomer = { ...customer, id, createdAt: new Date() };
      setCustomers(prev => [newCustomer, ...prev]);
      return id;
    } catch (err) {
      setError('Failed to create customer');
      console.error('Create customer error:', err);
      throw err;
    }
  };

  const updateCustomer = async (id: string, updates: Partial<Customer>) => {
    try {
      setError(null);
      await customerService.updateCustomer(id, updates);
      setCustomers(prev =>
        prev.map(customer =>
          customer.id === id ? { ...customer, ...updates } : customer
        )
      );
    } catch (err) {
      setError('Failed to update customer');
      console.error('Update customer error:', err);
      throw err;
    }
  };

  const updateOrderStats = async (
    customerId: string,
    orderValue: number
  ) => {
    try {
      setError(null);
      await customerService.updateOrderStats(customerId, orderValue);
      
      // Refresh the customer data since the stats are calculated on the server
      const updatedCustomer = await customerService.getCustomer(customerId);
      if (updatedCustomer) {
        setCustomers(prev =>
          prev.map(customer =>
            customer.id === customerId ? updatedCustomer : customer
          )
        );
      }
    } catch (err) {
      setError('Failed to update customer order stats');
      console.error('Update customer order stats error:', err);
      throw err;
    }
  };

  const addLoyaltyPoints = async (customerId: string, points: number) => {
    try {
      setError(null);
      await customerService.addLoyaltyPoints(customerId, points);
      setCustomers(prev =>
        prev.map(customer =>
          customer.id === customerId
            ? { ...customer, loyaltyPoints: customer.loyaltyPoints + points }
            : customer
        )
      );
    } catch (err) {
      setError('Failed to add loyalty points');
      console.error('Add loyalty points error:', err);
      throw err;
    }
  };

  const getCustomerStats = () => {
    const totalCustomers = customers.length;
    const newCustomers = customers.filter(customer => customer.status === 'new').length;
    const vipCustomers = customers.filter(customer => customer.status === 'vip').length;
    const activeCustomers = customers.filter(customer => customer.status === 'active').length;
    
    const totalRevenue = customers.reduce((sum, customer) => sum + customer.totalSpent, 0);
    const averageOrderValue = totalCustomers > 0 
      ? customers.reduce((sum, customer) => sum + customer.totalSpent, 0) / 
        customers.reduce((sum, customer) => sum + customer.totalOrders, 0) 
      : 0;

    return {
      totalCustomers,
      newCustomers,
      vipCustomers,
      activeCustomers,
      totalRevenue,
      averageOrderValue: Math.round(averageOrderValue * 100) / 100
    };
  };

  const getTopCustomers = (limit: number = 10) => {
    return [...customers]
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, limit);
  };

  const searchCustomers = (searchTerm: string) => {
    const term = searchTerm.toLowerCase();
    return customers.filter(customer =>
      customer.name.toLowerCase().includes(term) ||
      customer.email.toLowerCase().includes(term) ||
      customer.phone.includes(term)
    );
  };

  return {
    customers,
    loading,
    error,
    createCustomer,
    updateCustomer,
    updateOrderStats,
    addLoyaltyPoints,
    getCustomerStats,
    getTopCustomers,
    searchCustomers
  };
};

export const useCustomersRealtime = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const unsubscribe = customerService.subscribeToCustomers((fetchedCustomers) => {
        setCustomers(fetchedCustomers);
        setLoading(false);
        setError(null);
      });

      return unsubscribe;
    } catch (err) {
      setError('Failed to subscribe to customers');
      setLoading(false);
      console.error('Customers subscription error:', err);
    }
  }, []);

  return { customers, loading, error };
};

export const useCustomerById = (customerId: string | null) => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!customerId) {
      setCustomer(null);
      setLoading(false);
      return;
    }

    const fetchCustomer = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedCustomer = await customerService.getCustomer(customerId);
        setCustomer(fetchedCustomer);
      } catch (err) {
        setError('Failed to fetch customer');
        console.error('Fetch customer error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [customerId]);

  return { customer, loading, error };
};