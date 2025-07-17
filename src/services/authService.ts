import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { User } from '@/types';
import { customerService } from './customerService';

export const authService = {
  // Sign up new user
  async signUp(email: string, password: string, name: string, phone?: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Update display name
      await updateProfile(firebaseUser, { displayName: name });
      
      // Create customer record (non-blocking)
      try {
        await customerService.createCustomer({
          email,
          name,
          phone: phone || '',
          addresses: [],
          totalOrders: 0,
          totalSpent: 0,
          loyaltyPoints: 0,
          status: 'new'
        });
      } catch (customerError) {
        console.warn('Customer creation failed but user was created:', customerError);
      }
      
      return {
        id: firebaseUser.uid,
        email: firebaseUser.email!,
        name,
        phone,
        role: 'customer',
        createdAt: new Date()
      };
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  },

  // Sign in user
  async signIn(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // For now, any authenticated user accessing admin panel is considered admin
      const role = 'admin';
      
      return {
        id: firebaseUser.uid,
        email: firebaseUser.email!,
        name: firebaseUser.displayName || '',
        role,
        createdAt: new Date(),
        lastLogin: new Date()
      };
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  },

  // Sign out user
  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  },

  // Reset password
  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  },

  // Get current user
  getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  },

  // Subscribe to auth state changes
  onAuthStateChange(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // For now, any authenticated user accessing admin panel is considered admin
        const role = 'admin';
        
        const user: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email!,
          name: firebaseUser.displayName || '',
          role,
          createdAt: new Date(),
          lastLogin: new Date()
        };
        
        callback(user);
      } else {
        callback(null);
      }
    });
  }
};