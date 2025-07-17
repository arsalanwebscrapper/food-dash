
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Minus, Trash2, ShoppingCart, User } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CustomerAuth } from '@/components/auth/CustomerAuth';
import { useNavigate } from 'react-router-dom';

export const Cart: React.FC = () => {
  const { items, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(false);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const proceedToCheckout = () => {
    if (!user) {
      setShowAuth(true);
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
          <p className="text-muted-foreground text-center">
            Add some delicious items from our menu to get started!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Your Order ({items.length} items)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 py-3 border-b last:border-b-0">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                    No Image
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-medium truncate">{item.name}</h4>
                <p className="text-sm text-muted-foreground">₹{item.price} each</p>
                {item.specialInstructions && (
                  <p className="text-xs text-muted-foreground italic">Note: {item.specialInstructions}</p>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                  className="h-8 w-8 p-0"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="font-medium min-w-[30px] text-center">{item.quantity}</span>
                <Button
                  size="sm"
                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  className="h-8 w-8 p-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="text-right">
                <div className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeFromCart(item.id)}
                  className="text-destructive hover:text-destructive h-6 w-6 p-0 mt-1"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          
          <div className="pt-4 border-t">
            <div className="flex justify-between items-center text-lg font-semibold mb-4">
              <span>Total:</span>
              <span>₹{getTotalPrice().toFixed(2)}</span>
            </div>
            
            <div className="flex gap-3">
              {user ? (
                <Button 
                  onClick={proceedToCheckout} 
                  className="flex-1" 
                  size="lg"
                >
                  Proceed to Checkout - ₹{getTotalPrice().toFixed(2)}
                </Button>
              ) : (
                <Dialog open={showAuth} onOpenChange={setShowAuth}>
                  <DialogTrigger asChild>
                    <Button className="flex-1" size="lg">
                      <User className="h-4 w-4 mr-2" />
                      Login to Order - ₹{getTotalPrice().toFixed(2)}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Login to Continue</DialogTitle>
                    </DialogHeader>
                    <CustomerAuth onClose={() => setShowAuth(false)} />
                  </DialogContent>
                </Dialog>
              )}
              
              <Button 
                variant="outline" 
                onClick={clearCart}
              >
                Clear Cart
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
