import { Button } from "@/components/ui/button";
import heroThali from "@/assets/hero-thali.jpg";

const HeroSection = () => {
  return (
    <section id="hero" className="bg-gradient-warm py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-heading font-bold text-foreground leading-tight">
                Quick and Tasty{" "}
                <br />
                <span className="text-primary">Food Delivered</span>{" "}
                <br />
                with a{" "}
                <span className="text-primary">Dash of Speed</span>
              </h1>
              <p className="text-lg text-muted-foreground font-body max-w-lg">
                Experience the authentic flavors of India delivered fresh to your doorstep. 
                From traditional curries to modern fusion dishes, we deliver taste with speed.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="order-now" size="lg" className="min-w-[160px]">
                Order Now
              </Button>
              <Button variant="track-order" size="lg" className="min-w-[160px]">
                Track Order
              </Button>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="relative z-10">
              <img
                src={heroThali}
                alt="Delicious Indian Thali"
                className="w-full max-w-lg mx-auto rounded-full shadow-heavy"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute top-4 right-4 w-16 h-16 bg-primary/10 rounded-full"></div>
            <div className="absolute bottom-8 left-8 w-12 h-12 bg-accent/20 rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;