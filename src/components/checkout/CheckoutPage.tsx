
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { MapPin, CreditCard, Wallet, Banknote, Percent } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/hooks/useOrders';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface Coupon {
  id: string;
  code: string;
  title: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minimumOrderValue?: number;
}

export const CheckoutPage: React.FC = () => {
  const { items, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { createOrder } = useOrders();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [orderDetails, setOrderDetails] = useState({
    deliveryAddress: user?.address || '',
    phone: user?.phone || '',
    notes: '',
    paymentMethod: 'cash' as 'cash' | 'card' | 'upi'
  });

  React.useEffect(() => {
    // Check for applied coupon from localStorage
    const savedCoupon = localStorage.getItem('appliedCoupon');
    if (savedCoupon) {
      try {
        setAppliedCoupon(JSON.parse(savedCoupon));
      } catch (error) {
        console.error('Error parsing saved coupon:', error);
      }
    }
  }, []);

  const subtotal = getTotalPrice();
  const deliveryFee = subtotal > 500 ? 0 : 50;
  const discount = appliedCoupon ? 
    (appliedCoupon.discountType === 'percentage' 
      ? Math.round(subtotal * appliedCoupon.discountValue / 100)
      : appliedCoupon.discountValue) : 0;
  const total = subtotal + deliveryFee - discount;

  const handlePlaceOrder = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to place an order",
        variant: "destructive",
      });
      return;
    }

    if (!orderDetails.deliveryAddress.trim()) {
      toast({
        title: "Address Required",
        description: "Please enter your delivery address",
        variant: "destructive",
      });
      return;
    }

    if (!orderDetails.phone.trim()) {
      toast({
        title: "Phone Required",
        description: "Please enter your phone number",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      console.log('Starting order creation process...');
      console.log('User:', user);
      console.log('Cart items:', items);
      
      const orderData = {
        customerId: user.id,
        customer: user,
        customerName: user.name,
        customerEmail: user.email,
        customerPhone: orderDetails.phone,
        items: items.map(item => ({
          menuItemId: item.menuItemId,
          menuItem: item.menuItem,
          price: item.price,
          quantity: item.quantity,
          specialInstructions: item.specialInstructions || ''
        })),
        totalAmount: total,
        deliveryAddress: orderDetails.deliveryAddress,
        phone: orderDetails.phone,
        paymentMethod: orderDetails.paymentMethod,
        paymentStatus: 'pending' as const,
        status: 'pending' as const,
        notes: orderDetails.notes,
        estimatedDeliveryTime: new Date(Date.now() + 45 * 60 * 1000), // 45 minutes from now
        appliedCoupon: appliedCoupon?.code || null,
        discount: discount,
        deliveryFee: deliveryFee
      };

      console.log('Order data to be created:', orderData);
      
      const orderId = await createOrder(orderData);
      console.log('Order created successfully with ID:', orderId);
      
      toast({
        title: "Order Placed Successfully!",
        description: `Your order #${orderId.slice(-6)} will be delivered in 30-45 minutes`,
      });
      
      clearCart();
      localStorage.removeItem('appliedCoupon');
      navigate('/order-success', { state: { orderId } });
      
    } catch (error) {
      console.error('Order creation failed:', error);
      toast({
        title: "Order Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    localStorage.removeItem('appliedCoupon');
    toast({
      title: "Coupon Removed",
      description: "Coupon has been removed from your order.",
    });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">No Items in Cart</h2>
            <p className="text-muted-foreground mb-4">Add some items to your cart to proceed with checkout.</p>
            <Button onClick={() => navigate('/order')}>Browse Menu</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Details Form */}
            <div className="space-y-6">
              {/* Delivery Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Delivery Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Complete Address *</Label>
                    <Textarea
                      id="address"
                      placeholder="Enter your complete delivery address"
                      value={orderDetails.deliveryAddress}
                      onChange={(e) => setOrderDetails({ ...orderDetails, deliveryAddress: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Your contact number"
                      value={orderDetails.phone}
                      onChange={(e) => setOrderDetails({ ...orderDetails, phone: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Special Instructions (Optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Any special requests or notes"
                      value={orderDetails.notes}
                      onChange={(e) => setOrderDetails({ ...orderDetails, notes: e.target.value })}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { value: 'cash', label: 'Cash on Delivery', icon: Banknote },
                      { value: 'upi', label: 'UPI Payment', icon: Wallet },
                      { value: 'card', label: 'Card Payment', icon: CreditCard }
                    ].map((method) => (
                      <label
                        key={method.value}
                        className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                          orderDetails.paymentMethod === method.value 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:bg-muted/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.value}
                          checked={orderDetails.paymentMethod === method.value}
                          onChange={(e) => setOrderDetails({ ...orderDetails, paymentMethod: e.target.value as any })}
                          className="sr-only"
                        />
                        <method.icon className="h-5 w-5" />
                        <span className="font-medium">{method.label}</span>
                      </label>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            ₹{item.price} × {item.quantity}
                          </p>
                        </div>
                        <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Applied Coupon */}
                  {appliedCoupon && (
                    <>
                      <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Percent className="h-4 w-4 text-green-600" />
                          <div>
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              {appliedCoupon.code}
                            </Badge>
                            <p className="text-sm text-green-700 mt-1">{appliedCoupon.title}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={removeCoupon}>
                          Remove
                        </Button>
                      </div>
                      <Separator />
                    </>
                  )}

                  {/* Price Breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>{deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)}</span>
                    </div>
                    
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-{formatCurrency(discount)}</span>
                      </div>
                    )}
                    
                    <Separator />
                    
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                  </div>

                  <Button 
                    onClick={handlePlaceOrder} 
                    className="w-full" 
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? "Placing Order..." : `Place Order - ${formatCurrency(total)}`}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    By placing this order, you agree to our terms and conditions.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
