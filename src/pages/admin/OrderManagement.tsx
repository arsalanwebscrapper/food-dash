import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Edit, Filter, Search, Loader2 } from "lucide-react";
import { useOrdersRealtime } from "@/hooks/useOrders";
import { formatCurrency } from "@/lib/utils";
import { OrderDetailsDialog } from "@/components/admin/OrderDetailsDialog";
import { OrderStatusUpdate } from "@/components/admin/OrderStatusUpdate";
import { Order } from "@/types";

const OrderManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const { orders, loading } = useOrdersRealtime();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "text-fresh-green bg-green-100";
      case "preparing": return "text-yellow-600 bg-yellow-100";
      case "out-for-delivery": return "text-blue-600 bg-blue-100";
      case "confirmed": return "text-purple-600 bg-purple-100";
      case "pending": return "text-gray-600 bg-gray-100";
      case "cancelled": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const formatStatus = (status: string) => {
    return status.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN');
  };

  const getOrderItems = (order: any) => {
    return order.items?.map((item: any) => 
      `${item.menuItem?.name || 'Unknown'} x${item.quantity}`
    ).join(', ') || 'No items';
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setDetailsDialogOpen(true);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.phone?.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground">Order Management</h1>
        <p className="text-muted-foreground font-body">Manage and track all customer orders.</p>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by customer name or order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="preparing">Preparing</SelectItem>
              <SelectItem value="out-for-delivery">Out for Delivery</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Orders Table */}
      <Card className="p-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading orders...</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-heading font-medium text-foreground">Order ID</th>
                  <th className="text-left py-3 px-4 font-heading font-medium text-foreground">Customer</th>
                  <th className="text-left py-3 px-4 font-heading font-medium text-foreground">Items</th>
                  <th className="text-left py-3 px-4 font-heading font-medium text-foreground">Total</th>
                  <th className="text-left py-3 px-4 font-heading font-medium text-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-heading font-medium text-foreground">Time</th>
                  <th className="text-left py-3 px-4 font-heading font-medium text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-muted-foreground">
                      {orders.length === 0 ? 'No orders yet' : 'No orders match your search criteria'}
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order, index) => (
                    <tr key={index} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-body font-medium text-foreground">#{order.id.slice(-6)}</td>
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <p className="font-body font-medium text-foreground">{order.customer.name}</p>
                          <p className="text-sm text-muted-foreground">{order.phone}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-body text-foreground max-w-xs truncate">
                        {getOrderItems(order)}
                      </td>
                      <td className="py-3 px-4 font-body font-medium text-foreground">
                        {formatCurrency(order.totalAmount)}
                      </td>
                      <td className="py-3 px-4">
                        <OrderStatusUpdate order={order} />
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <p className="font-body text-sm text-foreground">{formatTime(order.createdAt)}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button size="sm" variant="ghost" onClick={() => handleViewOrder(order)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Order Details Dialog */}
      <OrderDetailsDialog 
        order={selectedOrder}
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
      />
    </div>
  );
};

export default OrderManagement;