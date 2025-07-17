import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { BarChart3, ShoppingCart, Users, TrendingUp, Eye, Edit, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOrders } from "@/hooks/useOrders";
import { useMenu } from "@/hooks/useMenu";
import { useCustomers } from "@/hooks/useCustomers";
import { formatCurrency } from "@/lib/utils";

const Dashboard = () => {
  const { orders, loading: ordersLoading } = useOrders();
  const { menuItems, loading: dishesLoading } = useMenu();
  const { customers, loading: customersLoading } = useCustomers();
  
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    activeOrders: 0
  });

  const loading = ordersLoading || dishesLoading || customersLoading;

  useEffect(() => {
    if (!loading) {
      // Calculate total revenue from delivered orders
      const totalRevenue = orders
        .filter(order => order.status === 'delivered')
        .reduce((sum, order) => sum + order.totalAmount, 0);

      // Count active orders (not delivered or cancelled)
      const activeOrders = orders.filter(order => 
        order.status !== 'delivered' && order.status !== 'cancelled'
      ).length;

      setStats({
        totalRevenue,
        totalOrders: orders.length,
        totalCustomers: customers.length,
        activeOrders
      });
    }
  }, [orders, customers, menuItems, loading]);

  // Get recent orders (last 5)
  const recentOrders = orders
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "text-fresh-green bg-green-100";
      case "preparing": return "text-yellow-600 bg-yellow-100";
      case "out_for_delivery": return "text-blue-600 bg-blue-100";
      case "confirmed": return "text-purple-600 bg-purple-100";
      case "pending": return "text-gray-600 bg-gray-100";
      case "cancelled": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const statsData = [
    {
      title: "Total Orders",
      value: stats.totalOrders.toString(),
      change: "+12%",
      icon: ShoppingCart,
      color: "text-primary"
    },
    {
      title: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      change: "+8.2%",
      icon: TrendingUp,
      color: "text-fresh-green"
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers.toString(),
      change: "+5.4%",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Active Orders",
      value: stats.activeOrders.toString(),
      change: "-2",
      icon: BarChart3,
      color: "text-yellow-600"
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground font-body">Welcome back! Here's what's happening with your restaurant.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground font-body">{stat.title}</p>
                  <p className="text-2xl font-heading font-bold text-foreground">{stat.value}</p>
                  <p className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-fresh-green' : 'text-red-600'}`}>
                    {stat.change} from yesterday
                  </p>
                </div>
                <div className={`p-3 rounded-lg bg-muted ${stat.color}`}>
                  <IconComponent className="h-6 w-6" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-xl font-heading font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="default">Add New Dish</Button>
          <Button variant="outline">View All Orders</Button>
          <Button variant="outline">Manage Menu</Button>
          <Button variant="outline">Create Offer</Button>
        </div>
      </Card>

      {/* Recent Orders */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-heading font-semibold text-foreground">Recent Orders</h2>
          <Button variant="outline" size="sm">View All</Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-heading font-medium text-foreground">Order ID</th>
                <th className="text-left py-3 px-4 font-heading font-medium text-foreground">Customer</th>
                <th className="text-left py-3 px-4 font-heading font-medium text-foreground">Amount</th>
                <th className="text-left py-3 px-4 font-heading font-medium text-foreground">Status</th>
                <th className="text-left py-3 px-4 font-heading font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted-foreground">
                    No orders yet. Orders will appear here once customers start ordering.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4 font-body font-medium text-foreground">#{order.id.slice(-6)}</td>
                    <td className="py-3 px-4 font-body text-foreground">{order.customer.name}</td>
                    <td className="py-3 px-4 font-body font-medium text-foreground">{formatCurrency(order.totalAmount)}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {formatStatus(order.status)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button size="xs" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="xs" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;