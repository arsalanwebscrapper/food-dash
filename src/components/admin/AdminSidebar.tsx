import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  MenuSquare, 
  Users, 
  Tag, 
  BarChart3, 
  Settings,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: ShoppingCart, label: "Orders", path: "/admin/orders" },
  { icon: MenuSquare, label: "Menu Management", path: "/admin/menu" },
  { icon: Users, label: "Customers", path: "/admin/customers" },
  { icon: Tag, label: "Promotions", path: "/admin/promotions" },
  { icon: BarChart3, label: "Reports", path: "/admin/reports" },
  { icon: Settings, label: "Settings", path: "/admin/settings" }
];

const AdminSidebar = () => {
  return (
    <aside className="w-64 bg-white border-r shadow-light h-screen sticky top-16">
      <div className="p-6">
        {/* Back to Website */}
        <Button variant="outline" size="sm" asChild className="w-full mb-6">
          <NavLink to="/" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Website</span>
          </NavLink>
        </Button>
        
        {/* Navigation Menu */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin"}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg font-body font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`
                }
              >
                <IconComponent className="h-5 w-5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default AdminSidebar;