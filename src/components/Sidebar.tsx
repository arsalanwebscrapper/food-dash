import { Button } from "@/components/ui/button";
import { Star, Copy } from "lucide-react";
import teaSnacks from "@/assets/tea-snacks.jpg";
import pavBhaji from "@/assets/pav-bhaji.jpg";
import dalBatiChurma from "@/assets/dal-bati-churma.jpg";

const popularDishes = [
  {
    id: 1,
    name: "Indian Tea Time Snacks",
    image: teaSnacks,
    rating: 4.5,
    reviews: 800,
    price: "₹150"
  },
  {
    id: 2,
    name: "Gujarati Pav Bhaji",
    image: pavBhaji,
    rating: 4.7,
    reviews: 650,
    price: "₹250"
  },
  {
    id: 3,
    name: "Rajasthani Dal Bati Churma",
    image: dalBatiChurma,
    rating: 4.8,
    reviews: 500,
    price: "₹450"
  }
];

const Sidebar = () => {
  return (
    <div className="space-y-8">
      {/* Popular Dishes Section */}
      <div className="bg-white rounded-2xl shadow-light p-6">
        <h3 className="text-xl font-heading font-semibold text-foreground mb-6">
          Popular Dishes
        </h3>
        <div className="space-y-4">
          {popularDishes.map((dish) => (
            <div key={dish.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-primary/30 p-1">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-heading font-medium text-foreground text-sm mb-1 truncate">
                  {dish.name}
                </h4>
                <div className="flex items-center space-x-1 mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < Math.floor(dish.rating)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    ({dish.reviews})
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-heading font-bold text-primary text-sm">
                    {dish.price}
                  </span>
                  <Button variant="buy-now" size="xs">
                    Buy Now
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Special Offer Banner */}
      <div className="bg-gradient-orange rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="text-center mb-4">
            <h3 className="text-2xl font-heading font-bold mb-2">
              25% OFF 25% OFF
            </h3>
            <p className="text-sm opacity-90 mb-4">
              SPECIAL OFFER
            </p>
          </div>
          
          <div className="text-center mb-6">
            <p className="text-xs opacity-90 mb-2">COUPON CODE</p>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="font-heading font-bold text-lg">FOODDASH80</span>
                <Button size="xs" variant="secondary" className="text-primary">
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <p className="text-xs opacity-90">
              GET 25% OFF YOUR FIRST ORDER WITH SPEED OF DASH
            </p>
          </div>
          
          <div className="text-center">
            <p className="text-xs opacity-90">Contact: 123-456-7890</p>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-4 right-4 w-8 h-8 bg-white/10 rounded-full"></div>
        <div className="absolute bottom-4 left-4 w-6 h-6 bg-white/10 rounded-full"></div>
      </div>

      {/* Restaurant Banner */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-xl font-heading font-bold mb-2">
            Indian Restaurant
          </h3>
          <p className="text-sm opacity-90 mb-4">
            Authentic flavors from the heart of India
          </p>
          <Button variant="secondary" size="sm" className="text-amber-600">
            Explore Menu
          </Button>
        </div>
        
        {/* Decorative spice elements */}
        <div className="absolute top-2 right-2 w-4 h-4 bg-white/20 rounded-full"></div>
        <div className="absolute bottom-2 left-2 w-3 h-3 bg-white/20 rounded-full"></div>
      </div>
    </div>
  );
};

export default Sidebar;