import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Search, Loader2 } from "lucide-react";
import { useMenu } from "@/hooks/useMenu";
import { formatCurrency } from "@/lib/utils";
import { AddMenuItemDialog } from "@/components/admin/AddMenuItemDialog";

const MenuManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { menuItems, loading, getCategories } = useMenu();

  const categories = ["All", ...getCategories()];

  const getStatusColor = (available: boolean) => {
    return available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  const filteredItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Menu Management</h1>
          <p className="text-muted-foreground font-body">Manage your restaurant's menu items and categories.</p>
        </div>
        <Button className="flex items-center space-x-2" onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4" />
          <span>Add New Dish</span>
        </Button>
      </div>

      {/* Search and Filter */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search dishes or categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button key={category} variant="outline" size="sm">
                {category}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Menu Items Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading menu items...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground text-lg">
                {menuItems.length === 0 ? 'No menu items yet' : 'No items match your search criteria'}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {menuItems.length === 0 ? 'Add your first dish to get started' : 'Try adjusting your search terms'}
              </p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="aspect-video bg-muted flex items-center justify-center">
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-muted-foreground">No Image</span>
                  )}
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading font-semibold text-foreground">{item.name}</h3>
                    <Badge className={getStatusColor(item.available)}>
                      {item.available ? 'Available' : 'Out of Stock'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{item.category}</span>
                    <span className="font-heading font-bold text-primary">
                      {formatCurrency(item.price)}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      <AddMenuItemDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
    </div>
  );
};

export default MenuManagement;