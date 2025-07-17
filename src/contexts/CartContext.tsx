import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { MenuItem, OrderItem } from '@/types';

interface CartItem extends OrderItem {
  id: string;
  name: string;
  image: string;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}

type CartAction = 
  | { type: 'ADD_ITEM'; payload: { menuItem: MenuItem; quantity: number; specialInstructions?: string } }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'UPDATE_INSTRUCTIONS'; payload: { id: string; specialInstructions: string } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartState };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { menuItem, quantity, specialInstructions } = action.payload;
      const existingItemIndex = state.items.findIndex(
        item => item.menuItemId === menuItem.id && item.specialInstructions === specialInstructions
      );

      let newItems: CartItem[];
      
      if (existingItemIndex >= 0) {
        // Update existing item quantity
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        const newItem: CartItem = {
          id: `${menuItem.id}-${Date.now()}`,
          menuItemId: menuItem.id,
          menuItem,
          name: menuItem.name,
          image: menuItem.image,
          quantity,
          specialInstructions,
          price: menuItem.price
        };
        newItems = [...state.items, newItem];
      }

      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      return { items: newItems, totalItems, totalAmount };
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload.id);
      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      return { items: newItems, totalItems, totalAmount };
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      
      if (quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: { id } });
      }

      const newItems = state.items.map(item =>
        item.id === id ? { ...item, quantity } : item
      );

      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      return { items: newItems, totalItems, totalAmount };
    }

    case 'UPDATE_INSTRUCTIONS': {
      const { id, specialInstructions } = action.payload;
      const newItems = state.items.map(item =>
        item.id === id ? { ...item, specialInstructions } : item
      );

      return { ...state, items: newItems };
    }

    case 'CLEAR_CART': {
      return { items: [], totalItems: 0, totalAmount: 0 };
    }

    case 'LOAD_CART': {
      return action.payload;
    }

    default:
      return state;
  }
};

interface CartContextType {
  cart: CartState;
  items: CartItem[];
  addToCart: (menuItem: MenuItem, quantity: number, specialInstructions?: string) => void;
  addItem: (menuItem: MenuItem, quantity: number, specialInstructions?: string) => void;
  removeFromCart: (id: string) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateInstructions: (id: string, specialInstructions: string) => void;
  clearCart: () => void;
  getCartForOrder: () => OrderItem[];
  getItemQuantity: (menuItemId: string) => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: React.ReactNode;
}

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalAmount: 0
};

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('fooddash_cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: parsedCart });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('fooddash_cart', JSON.stringify(cart));
  }, [cart]);

  const addItem = (menuItem: MenuItem, quantity: number, specialInstructions?: string) => {
    dispatch({ type: 'ADD_ITEM', payload: { menuItem, quantity, specialInstructions } });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const updateInstructions = (id: string, specialInstructions: string) => {
    dispatch({ type: 'UPDATE_INSTRUCTIONS', payload: { id, specialInstructions } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getCartForOrder = (): OrderItem[] => {
    return cart.items.map(item => ({
      menuItemId: item.menuItemId,
      menuItem: item.menuItem,
      quantity: item.quantity,
      specialInstructions: item.specialInstructions,
      price: item.price
    }));
  };

  const getItemQuantity = (menuItemId: string): number => {
    const item = cart.items.find(item => item.menuItemId === menuItemId);
    return item ? item.quantity : 0;
  };

  const getTotalPrice = (): number => {
    return cart.totalAmount;
  };

  const value: CartContextType = {
    cart,
    items: cart.items,
    addToCart: addItem,
    addItem,
    removeFromCart: removeItem,
    removeItem,
    updateQuantity,
    updateInstructions,
    clearCart,
    getCartForOrder,
    getItemQuantity,
    getTotalPrice
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};