import { useState } from "react";
import { Order } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useOrders } from "@/hooks/useOrders";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface OrderStatusUpdateProps {
  order: Order;
}

export const OrderStatusUpdate = ({ order }: OrderStatusUpdateProps) => {
  const [selectedStatus, setSelectedStatus] = useState<Order['status']>(order.status);
  const [isUpdating, setIsUpdating] = useState(false);
  const { updateOrderStatus } = useOrders();
  const { toast } = useToast();

  const statusOptions: { value: Order['status']; label: string; color: string }[] = [
    { value: 'pending', label: 'Pending', color: 'text-gray-600' },
    { value: 'confirmed', label: 'Confirmed', color: 'text-purple-600' },
    { value: 'preparing', label: 'Preparing', color: 'text-yellow-600' },
    { value: 'out-for-delivery', label: 'Out for Delivery', color: 'text-blue-600' },
    { value: 'delivered', label: 'Delivered', color: 'text-green-600' },
    { value: 'cancelled', label: 'Cancelled', color: 'text-red-600' },
  ];

  const handleStatusUpdate = async () => {
    if (selectedStatus === order.status) return;

    setIsUpdating(true);
    try {
      await updateOrderStatus(order.id, selectedStatus);
      toast({
        title: "Order Status Updated",
        description: `Order #${order.id.slice(-6)} status updated to ${selectedStatus}`,
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update order status. Please try again.",
        variant: "destructive",
      });
      setSelectedStatus(order.status); // Reset to original status
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Select value={selectedStatus} onValueChange={(value: Order['status']) => setSelectedStatus(value)}>
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <span className={option.color}>{option.label}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {selectedStatus !== order.status && (
        <Button 
          size="sm" 
          onClick={handleStatusUpdate}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            'Update'
          )}
        </Button>
      )}
    </div>
  );
};