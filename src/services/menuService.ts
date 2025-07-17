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
import { MenuItem } from '@/types';

const COLLECTION_NAME = 'menuItems';

export const menuService = {
  // Create a new menu item
  async createMenuItem(menuItem: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      console.log('Creating menu item:', menuItem);
      const menuItemsRef = ref(realtimeDb, COLLECTION_NAME);
      const newItemRef = push(menuItemsRef);
      
      const itemData = {
        ...menuItem,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      
      console.log('Saving to Firebase:', itemData);
      await set(newItemRef, itemData);
      console.log('Successfully saved with ID:', newItemRef.key);
      
      return newItemRef.key!;
    } catch (error) {
      console.error('Error creating menu item:', error);
      throw error;
    }
  },

  // Get all menu items
  async getAllMenuItems(): Promise<MenuItem[]> {
    try {
      const menuItemsRef = ref(realtimeDb, COLLECTION_NAME);
      const snapshot = await get(menuItemsRef);
      
      if (!snapshot.exists()) {
        return [];
      }
      
      const data = snapshot.val();
      return Object.keys(data).map(key => ({
        id: key,
        ...data[key],
        createdAt: data[key].createdAt ? new Date(data[key].createdAt) : new Date(),
        updatedAt: data[key].updatedAt ? new Date(data[key].updatedAt) : new Date()
      })) as MenuItem[];
    } catch (error) {
      console.error('Error fetching menu items:', error);
      throw error;
    }
  },

  // Get available menu items only
  async getAvailableMenuItems(): Promise<MenuItem[]> {
    try {
      const menuItemsRef = ref(realtimeDb, COLLECTION_NAME);
      const snapshot = await get(menuItemsRef);
      
      if (!snapshot.exists()) {
        return [];
      }
      
      const data = snapshot.val();
      return Object.keys(data)
        .map(key => ({
          id: key,
          ...data[key],
          createdAt: data[key].createdAt ? new Date(data[key].createdAt) : new Date(),
          updatedAt: data[key].updatedAt ? new Date(data[key].updatedAt) : new Date()
        }))
        .filter(item => item.available) as MenuItem[];
    } catch (error) {
      console.error('Error fetching available menu items:', error);
      throw error;
    }
  },

  // Get menu items by category
  async getMenuItemsByCategory(category: string): Promise<MenuItem[]> {
    try {
      const menuItemsRef = ref(realtimeDb, COLLECTION_NAME);
      const snapshot = await get(menuItemsRef);
      
      if (!snapshot.exists()) {
        return [];
      }
      
      const data = snapshot.val();
      return Object.keys(data)
        .map(key => ({
          id: key,
          ...data[key],
          createdAt: data[key].createdAt ? new Date(data[key].createdAt) : new Date(),
          updatedAt: data[key].updatedAt ? new Date(data[key].updatedAt) : new Date()
        }))
        .filter(item => item.category === category && item.available) as MenuItem[];
    } catch (error) {
      console.error('Error fetching menu items by category:', error);
      throw error;
    }
  },

  // Get a single menu item
  async getMenuItem(id: string): Promise<MenuItem | null> {
    try {
      const itemRef = ref(realtimeDb, `${COLLECTION_NAME}/${id}`);
      const snapshot = await get(itemRef);
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        return {
          id,
          ...data,
          createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
          updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date()
        } as MenuItem;
      }
      return null;
    } catch (error) {
      console.error('Error fetching menu item:', error);
      throw error;
    }
  },

  // Update a menu item
  async updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<void> {
    try {
      const itemRef = ref(realtimeDb, `${COLLECTION_NAME}/${id}`);
      await update(itemRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating menu item:', error);
      throw error;
    }
  },

  // Delete a menu item
  async deleteMenuItem(id: string): Promise<void> {
    try {
      const itemRef = ref(realtimeDb, `${COLLECTION_NAME}/${id}`);
      await remove(itemRef);
    } catch (error) {
      console.error('Error deleting menu item:', error);
      throw error;
    }
  },

  // Toggle menu item availability
  async toggleAvailability(id: string, available: boolean): Promise<void> {
    try {
      const itemRef = ref(realtimeDb, `${COLLECTION_NAME}/${id}`);
      await update(itemRef, {
        available,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error toggling menu item availability:', error);
      throw error;
    }
  },

  // Subscribe to menu items changes (real-time)
  subscribeToMenuItems(callback: (menuItems: MenuItem[]) => void): () => void {
    const menuItemsRef = ref(realtimeDb, COLLECTION_NAME);
    
    const unsubscribe = onValue(menuItemsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const menuItems = Object.keys(data).map(key => ({
          id: key,
          ...data[key],
          createdAt: data[key].createdAt ? new Date(data[key].createdAt) : new Date(),
          updatedAt: data[key].updatedAt ? new Date(data[key].updatedAt) : new Date()
        })) as MenuItem[];
        
        callback(menuItems);
      } else {
        callback([]);
      }
    });

    return () => off(menuItemsRef, 'value', unsubscribe);
  }
};