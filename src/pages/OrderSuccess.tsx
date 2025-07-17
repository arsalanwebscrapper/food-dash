
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, MapPin, Phone } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export const OrderSuccess: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <Card>
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
            
            <h1 className="text-2xl font-bold mb-2">Order Placed Successfully!</h1>
            <p className="text-muted-foreground mb-6">
              Thank you for your order. We're preparing your delicious meal.
            </p>

            {orderId && (
              <div className="bg-muted/50 rounded-lg p-4 mb-6">
                <p className="text-sm text-muted-foreground">Order ID</p>
                <p className="font-mono font-semibold">#{orderId.slice(-6)}</p>
              </div>
            )}

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-sm">
                <Clock className="h-5 w-5 text-primary" />
                <span>Estimated delivery: 30-45 minutes</span>
              </div>
              
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-5 w-5 text-primary" />
                <span>We'll deliver to your specified address</span>
              </div>
              
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-5 w-5 text-primary" />
                <span>We'll call you if needed</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button onClick={() => navigate('/profile')} className="w-full">
                Track Your Order
              </Button>
              <Button variant="outline" onClick={() => navigate('/order')} className="w-full">
                Order Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
