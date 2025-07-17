
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, ShoppingCart, Star } from 'lucide-react';
import { MenuItem } from '@/types';
import { useMenu } from '@/hooks/useMenu';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export const MenuDisplay: React.FC = () => {
  const { menuItems, loading, getAvailableItems, getCategories } = useMenu();
  const { addToCart, getItemQuantity, updateQuantity, removeFromCart, items } = useCart();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...getCategories()];
  const availableItems = getAvailableItems();
  const displayItems = selectedCategory === 'All' 
    ? availableItems 
    : availableItems.filter(item => item.category === selectedCategory);

  const handleAddToCart = (item: MenuItem) => {
    addToCart(item, 1);
    
    toast({
      title: "Added to Cart",
      description: `${item.name} has been added to your cart`,
    });
  };

  const handleQuantityChange = (item: MenuItem, newQuantity: number) => {
    const cartItem = items.find(cartItem => cartItem.menuItemId === item.id);
    
    if (cartItem) {
      if (newQuantity <= 0) {
        removeFromCart(cartItem.id);
        toast({
          title: "Removed from Cart",
          description: `${item.name} has been removed from your cart`,
        });
      } else {
        updateQuantity(cartItem.id, newQuantity);
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-10 w-20 flex-shrink-0" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="h-80">
              <CardHeader>
                <Skeleton className="h-32 w-full" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!availableItems.length) {
    return (
      <div className="text-center py-12">
        <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No menu items available</h3>
        <p className="text-muted-foreground">Check back later for delicious food options!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(category)}
            className="flex-shrink-0"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayItems.map((item) => {
          const quantity = getItemQuantity(item.id);
          
          return (
            <Card key={item.id} className="group hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      No Image
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  {item.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold">₹{item.price}</span>
                    <Badge variant="secondary">{item.category}</Badge>
                  </div>
                  
                  {item.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{item.rating}</span>
                    </div>
                  )}
                </div>

                {quantity > 0 ? (
                  <div className="flex items-center justify-center gap-3 bg-primary/10 rounded-lg p-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuantityChange(item, quantity - 1)}
                      className="h-8 w-8 p-0"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="font-medium min-w-[20px] text-center">{quantity}</span>
                    <Button
                      size="sm"
                      onClick={() => handleQuantityChange(item, quantity + 1)}
                      className="h-8 w-8 p-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => handleAddToCart(item)}
                    className="w-full"
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {displayItems.length === 0 && selectedCategory !== 'All' && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No items found in "{selectedCategory}" category.</p>
          <Button 
            variant="outline" 
            onClick={() => setSelectedCategory('All')}
            className="mt-2"
          >
            View All Items
          </Button>
        </div>
      )}
    </div>
  );
};
