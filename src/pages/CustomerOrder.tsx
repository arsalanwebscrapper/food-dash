import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MenuDisplay } from '@/components/ordering/MenuDisplay';
import { Cart } from '@/components/ordering/Cart';
import { useAuth } from '@/contexts/AuthContext';
import { ShoppingCart, User, LogOut, UtensilsCrossed } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

export const CustomerOrder: React.FC = () => {
  const { user, signOut } = useAuth();
  const { items } = useCart();
  
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UtensilsCrossed className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">Food Dash</h1>
            </div>
            
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="font-medium">{user.name}</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={signOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <Badge variant="secondary">Guest User</Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="menu" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="menu" className="flex items-center gap-2">
              <UtensilsCrossed className="h-4 w-4" />
              Menu
            </TabsTrigger>
            <TabsTrigger value="cart" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Cart
              {totalItems > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 min-w-[20px] px-1">
                  {totalItems}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="menu">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-2">Our Delicious Menu</h2>
                <p className="text-muted-foreground">
                  Choose from our wide variety of fresh, delicious dishes
                </p>
              </div>
              <MenuDisplay />
            </div>
          </TabsContent>

          <TabsContent value="cart">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-2">Your Order</h2>
                <p className="text-muted-foreground">
                  Review your items and complete your order
                </p>
              </div>
              <div className="max-w-2xl mx-auto">
                <Cart />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};