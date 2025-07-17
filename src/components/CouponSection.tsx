
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Percent, Gift, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Coupon {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minimumOrderValue?: number;
  validUntil: Date;
  active: boolean;
}

const availableCoupons: Coupon[] = [
  {
    id: '1',
    code: 'WELCOME20',
    title: '20% Off First Order',
    description: 'Get 20% off on your first order above ₹500',
    discountType: 'percentage',
    discountValue: 20,
    minimumOrderValue: 500,
    validUntil: new Date('2024-12-31'),
    active: true
  },
  {
    id: '2',
    code: 'FLAT100',
    title: '₹100 Off',
    description: 'Flat ₹100 off on orders above ₹800',
    discountType: 'fixed',
    discountValue: 100,
    minimumOrderValue: 800,
    validUntil: new Date('2024-12-31'),
    active: true
  },
  {
    id: '3',
    code: 'FOODIE15',
    title: '15% Off Weekend',
    description: 'Weekend special - 15% off on all orders',
    discountType: 'percentage',
    discountValue: 15,
    minimumOrderValue: 300,
    validUntil: new Date('2024-12-31'),
    active: true
  }
];

export const CouponSection: React.FC = () => {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const { toast } = useToast();

  const applyCoupon = () => {
    const coupon = availableCoupons.find(
      c => c.code.toLowerCase() === couponCode.toLowerCase() && c.active
    );

    if (coupon) {
      setAppliedCoupon(coupon);
      toast({
        title: "Coupon Applied!",
        description: `${coupon.title} has been applied to your next order.`,
      });
      
      // Store in localStorage for cart to use
      localStorage.setItem('appliedCoupon', JSON.stringify(coupon));
    } else {
      toast({
        title: "Invalid Coupon",
        description: "Please check the coupon code and try again.",
        variant: "destructive",
      });
    }
    
    setCouponCode('');
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    localStorage.removeItem('appliedCoupon');
    toast({
      title: "Coupon Removed",
      description: "Coupon has been removed from your order.",
    });
  };

  return (
    <section id="coupons" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Special Offers & Coupons</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Save more on your favorite meals with our exclusive discount coupons
          </p>
        </div>

        {/* Apply Coupon Section */}
        <div className="max-w-md mx-auto mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-primary" />
                Apply Coupon
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800 mb-1">
                      {appliedCoupon.code}
                    </Badge>
                    <p className="text-sm text-green-700">{appliedCoupon.title}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={removeCoupon}>
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    onKeyPress={(e) => e.key === 'Enter' && applyCoupon()}
                  />
                  <Button onClick={applyCoupon} disabled={!couponCode.trim()}>
                    Apply
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Available Coupons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {availableCoupons.map((coupon) => (
            <Card key={coupon.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="outline" className="text-primary border-primary">
                    {coupon.code}
                  </Badge>
                  <Percent className="h-5 w-5 text-primary" />
                </div>
                
                <h3 className="font-semibold text-lg mb-2">{coupon.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{coupon.description}</p>
                
                <div className="space-y-2 text-xs text-muted-foreground">
                  {coupon.minimumOrderValue && (
                    <p>• Minimum order: ₹{coupon.minimumOrderValue}</p>
                  )}
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>Valid till {coupon.validUntil.toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
