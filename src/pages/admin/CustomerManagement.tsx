import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Eye, Mail, Phone, Search, Loader2 } from "lucide-react";
import { useCustomersRealtime } from "@/hooks/useCustomers";
import { formatCurrency } from "@/lib/utils";

const CustomerManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { customers, loading } = useCustomersRealtime();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "vip": return "bg-purple-100 text-purple-800";
      case "active": return "bg-green-100 text-green-800";
      case "new": return "bg-blue-100 text-blue-800";
      case "inactive": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatDate = (date?: Date) => {
    if (!date) return 'Never';
    return date.toLocaleDateString('en-IN');
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground">Customer Management</h1>
        <p className="text-muted-foreground font-body">Manage and view customer information and order history.</p>
      </div>

      {/* Search */}
      <Card className="p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Customer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="text-center">
            <p className="text-2xl font-heading font-bold text-foreground">{customers.length}</p>
            <p className="text-sm text-muted-foreground">Total Customers</p>
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-center">
            <p className="text-2xl font-heading font-bold text-fresh-green">
              {customers.filter(c => c.status === 'new').length}
            </p>
            <p className="text-sm text-muted-foreground">New Customers</p>
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-center">
            <p className="text-2xl font-heading font-bold text-purple-600">
              {customers.filter(c => c.status === 'vip').length}
            </p>
            <p className="text-sm text-muted-foreground">VIP Customers</p>
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-center">
            <p className="text-2xl font-heading font-bold text-primary">
              {formatCurrency(customers.reduce((sum, c) => sum + c.totalSpent, 0))}
            </p>
            <p className="text-sm text-muted-foreground">Total Revenue</p>
          </div>
        </Card>
      </div>

      {/* Customers Table */}
      <Card className="p-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading customers...</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-heading font-medium text-foreground">Customer</th>
                  <th className="text-left py-3 px-4 font-heading font-medium text-foreground">Contact</th>
                  <th className="text-left py-3 px-4 font-heading font-medium text-foreground">Total Orders</th>
                  <th className="text-left py-3 px-4 font-heading font-medium text-foreground">Total Spent</th>
                  <th className="text-left py-3 px-4 font-heading font-medium text-foreground">Last Order</th>
                  <th className="text-left py-3 px-4 font-heading font-medium text-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-heading font-medium text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-muted-foreground">
                      {customers.length === 0 ? 'No customers yet' : 'No customers match your search criteria'}
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-primary font-medium text-sm">
                              {customer.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-body font-medium text-foreground">{customer.name}</p>
                            <p className="text-sm text-muted-foreground">ID: {customer.id.slice(-6)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-body">{customer.email}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-body">{customer.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-body text-foreground">{customer.totalOrders}</td>
                      <td className="py-3 px-4 font-body font-medium text-foreground">
                        {formatCurrency(customer.totalSpent)}
                      </td>
                      <td className="py-3 px-4 font-body text-foreground">
                        {formatDate(customer.lastOrderDate)}
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(customer.status)}>
                          {formatStatus(customer.status)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Button size="xs" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default CustomerManagement;