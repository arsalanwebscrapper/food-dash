import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { MenuItem } from "@/types";
import vegetablePulao from "@/assets/vegetable-pulao.jpg";
import paneerBhuna from "@/assets/paneer-bhuna.jpg";
import vermicelliUpma from "@/assets/vermicelli-upma.jpg";

const dishes = [
  {
    id: "pulao-1",
    name: "Indian Vegetable Pulao",
    image: vegetablePulao,
    price: "₹280",
    menuItem: {
      id: "pulao-1",
      name: "Indian Vegetable Pulao",
      description: "Aromatic basmati rice cooked with fresh vegetables and traditional spices",
      price: 280,
      category: "Rice & Biryani",
      image: vegetablePulao,
      available: true,
      preparationTime: 25,
      spiceLevel: "mild" as "mild",
      dietary: ["vegetarian" as "vegetarian"],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  },
  {
    id: "paneer-1", 
    name: "Paneer Bhuna Masala",
    image: paneerBhuna,
    price: "₹320",
    menuItem: {
      id: "paneer-1",
      name: "Paneer Bhuna Masala",
      description: "Tender paneer cubes cooked in rich and flavorful masala gravy",
      price: 320,
      category: "Main Course",
      image: paneerBhuna,
      available: true,
      preparationTime: 20,
      spiceLevel: "medium" as "medium",
      dietary: ["vegetarian" as "vegetarian"],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  },
  {
    id: "upma-1",
    name: "Vermicelli Upma", 
    image: vermicelliUpma,
    price: "₹180",
    menuItem: {
      id: "upma-1",
      name: "Vermicelli Upma",
      description: "Light and healthy semolina dish with mixed vegetables and south Indian flavors",
      price: 180,
      category: "Appetizers",
      image: vermicelliUpma,
      available: true,
      preparationTime: 15,
      spiceLevel: "mild" as "mild",
      dietary: ["vegetarian" as "vegetarian"],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }
];

const BestDishes = () => {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (dish: typeof dishes[0]) => {
    addToCart(dish.menuItem, 1);
    
    toast({
      title: "Added to Cart",
      description: `${dish.name} has been added to your cart.`,
    });
  };

  return (
    <section id="menu" className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-3xl lg:text-4xl font-heading font-bold text-foreground">
              Our <span className="text-primary">Best Delivered</span>
              <br />
              Indian Dish
            </h2>
          </div>
          <div className="flex items-center">
            <p className="text-muted-foreground font-body text-lg">
              It's Not Just About Bringing You Good Food From Restaurants, 
              We Deliver You Experience
            </p>
          </div>
        </div>

        {/* Dishes Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {dishes.map((dish) => (
            <div key={dish.id} className="group">
              <div className="bg-white rounded-2xl p-6 shadow-light hover:shadow-medium transition-all duration-300 transform group-hover:scale-[1.02]">
                {/* Dish Image */}
                <div className="relative mb-6">
                  <div className="w-40 h-40 mx-auto relative">
                    <div className="absolute inset-0 border-4 border-dashed border-primary/30 rounded-full"></div>
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-full object-cover rounded-full border-4 border-white shadow-medium"
                    />
                  </div>
                </div>

                {/* Dish Info */}
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-heading font-semibold text-foreground">
                    {dish.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-heading font-bold text-primary">
                      {dish.price}
                    </span>
                    <Button 
                      variant="buy-now" 
                      size="xs"
                      onClick={() => handleAddToCart(dish)}
                    >
                      Order Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestDishes;