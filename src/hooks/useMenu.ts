import { useState, useEffect } from 'react';
import { MenuItem } from '@/types';
import { menuService } from '@/services/menuService';

export const useMenu = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try Firebase first
        try {
          const items = await menuService.getAllMenuItems();
          setMenuItems(items);
        } catch (firebaseError) {
          // If Firebase fails, use localStorage
          console.log('Firebase failed, using localStorage');
          const localItems = JSON.parse(localStorage.getItem('menuItems') || '[]');
          setMenuItems(localItems);
        }
      } catch (err) {
        setError('Failed to fetch menu items');
        console.error('Menu fetch error:', err);
        setMenuItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const createMenuItem = async (menuItem: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null);
      const id = await menuService.createMenuItem(menuItem);
      const newItem = { ...menuItem, id, createdAt: new Date(), updatedAt: new Date() };
      setMenuItems(prev => [...prev, newItem]);
      return id;
    } catch (err) {
      setError('Failed to create menu item');
      console.error('Create menu item error:', err);
      throw err;
    }
  };

  const updateMenuItem = async (id: string, updates: Partial<MenuItem>) => {
    try {
      setError(null);
      await menuService.updateMenuItem(id, updates);
      setMenuItems(prev => 
        prev.map(item => 
          item.id === id ? { ...item, ...updates, updatedAt: new Date() } : item
        )
      );
    } catch (err) {
      setError('Failed to update menu item');
      console.error('Update menu item error:', err);
      throw err;
    }
  };

  const deleteMenuItem = async (id: string) => {
    try {
      setError(null);
      await menuService.deleteMenuItem(id);
      setMenuItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError('Failed to delete menu item');
      console.error('Delete menu item error:', err);
      throw err;
    }
  };

  const toggleAvailability = async (id: string, available: boolean) => {
    try {
      setError(null);
      await menuService.toggleAvailability(id, available);
      setMenuItems(prev =>
        prev.map(item =>
          item.id === id ? { ...item, available, updatedAt: new Date() } : item
        )
      );
    } catch (err) {
      setError('Failed to toggle availability');
      console.error('Toggle availability error:', err);
      throw err;
    }
  };

  const getAvailableItems = () => menuItems.filter(item => item.available);

  const getItemsByCategory = (category: string) => 
    menuItems.filter(item => item.category === category && item.available);

  const getCategories = () => 
    [...new Set(menuItems.map(item => item.category))].sort();

  return {
    menuItems,
    loading,
    error,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleAvailability,
    getAvailableItems,
    getItemsByCategory,
    getCategories
  };
};

export const useMenuRealtime = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const unsubscribe = menuService.subscribeToMenuItems((items) => {
        setMenuItems(items);
        setLoading(false);
        setError(null);
      });

      return unsubscribe;
    } catch (err) {
      setError('Failed to subscribe to menu items');
      setLoading(false);
      console.error('Menu subscription error:', err);
    }
  }, []);

  return { menuItems, loading, error };
};