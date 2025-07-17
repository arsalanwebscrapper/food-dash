
import { Search, User, ShoppingCart, Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { CustomerAuth } from "@/components/auth/CustomerAuth";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const { user, signOut } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleAuthClick = () => {
    if (user) {
      navigate('/profile');
    } else {
      setShowAuthDialog(true);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className="bg-white shadow-light sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-8 h-8 bg-gradient-orange rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="text-2xl font-heading font-bold text-foreground">
                Food <span className="text-primary">Dash</span>
              </span>
            </div>

            {/* Navigation - Hidden on mobile */}
            <nav className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => navigate('/')} 
                className="text-foreground hover:text-primary font-medium font-heading transition-colors"
              >
                Home
              </button>
              <button 
                onClick={() => navigate('/order')} 
                className="text-muted-foreground hover:text-primary font-medium font-heading transition-colors"
              >
                Menu
              </button>
              <button 
                onClick={() => scrollToSection('features')} 
                className="text-muted-foreground hover:text-primary font-medium font-heading transition-colors"
              >
                Service
              </button>
              <button 
                onClick={() => scrollToSection('about')} 
                className="text-muted-foreground hover:text-primary font-medium font-heading transition-colors"
              >
                About Us
              </button>
              {user && (
                <button 
                  onClick={() => navigate('/profile')} 
                  className="text-muted-foreground hover:text-primary font-medium font-heading transition-colors"
                >
                  Profile
                </button>
              )}
            </nav>

            {/* Right side icons */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="hidden md:flex">
                <Search className="h-5 w-5" />
              </Button>
              
              <Button variant="ghost" size="icon" onClick={handleAuthClick} title={user ? "Profile" : "Login"}>
                <User className="h-5 w-5" />
              </Button>
              
              <Button variant="ghost" size="icon" className="relative" onClick={() => navigate('/order')}>
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
              
              {user && (
                <Button variant="ghost" size="icon" onClick={signOut} title="Logout">
                  <LogOut className="h-5 w-5" />
                </Button>
              )}
              
              {/* Mobile menu button */}
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Auth Dialog */}
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="sm:max-w-md">
          <CustomerAuth onClose={() => setShowAuthDialog(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Header;
