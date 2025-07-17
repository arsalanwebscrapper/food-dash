import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer id="about" className="bg-foreground text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo and Copyright */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-orange rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="text-xl font-heading font-bold">
                Food <span className="text-primary">Dash</span>
              </span>
            </div>
            <p className="text-sm text-gray-400">
              © 2023 All Rights Reserved
            </p>
            <p className="text-sm text-gray-400">
              Food Dash - Your trusted food delivery partner
            </p>
          </div>

          {/* Menu Links */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li><button onClick={() => scrollToSection('hero')} className="text-gray-400 hover:text-white font-body transition-colors text-left">Home</button></li>
              <li><button onClick={() => scrollToSection('menu')} className="text-gray-400 hover:text-white font-body transition-colors text-left">Menu</button></li>
              <li><button onClick={() => scrollToSection('features')} className="text-gray-400 hover:text-white font-body transition-colors text-left">Service</button></li>
              <li><button onClick={() => scrollToSection('about')} className="text-gray-400 hover:text-white font-body transition-colors text-left">About Us</button></li>
              <li><button onClick={() => window.location.href = '/admin'} className="text-gray-400 hover:text-white font-body transition-colors text-left">Admin</button></li>
            </ul>
          </div>

          {/* Information Links */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Information</h4>
            <ul className="space-y-2">
              <li><button onClick={() => scrollToSection('menu')} className="text-gray-400 hover:text-white font-body transition-colors text-left">Our Menu</button></li>
              <li><span className="text-gray-400 font-body">Quality Guarantee</span></li>
              <li><span className="text-gray-400 font-body">Fresh Ingredients</span></li>
              <li><button onClick={() => scrollToSection('features')} className="text-gray-400 hover:text-white font-body transition-colors text-left">Fast Delivery</button></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Contact</h4>
            <ul className="space-y-2 mb-6">
              <li><span className="text-gray-400 font-body">+123456789</span></li>
              <li><span className="text-gray-400 font-body">Explore</span></li>
              <li><span className="text-gray-400 font-body">info@fooddash.com</span></li>
              <li><span className="text-gray-400 font-body">42, Nehruplace, Delhi</span></li>
            </ul>
            
            {/* Social Media */}
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;