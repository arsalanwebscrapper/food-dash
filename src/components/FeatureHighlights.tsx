import { Truck, Leaf, Package } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Promise To Deliver Within 30 Mins"
  },
  {
    icon: Leaf,
    title: "Fresh Food",
    description: "Your Food Will Be Delivered 100% Fresh To Your Home"
  },
  {
    icon: Package,
    title: "Free Delivery",
    description: "Absolutely Free, No Cost Just Order"
  }
];

const FeatureHighlights = () => {
  return (
    <section id="features" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-food-orange-light rounded-full">
                  <IconComponent className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-heading font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground font-body">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeatureHighlights;