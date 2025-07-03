export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">AITools Academy</h3>
            <p className="text-primary-foreground/80 mb-4 max-w-md">
              Empowering professionals with cutting-edge AI knowledge through 
              premium courses and hands-on training.
            </p>
            <div className="text-sm text-primary-foreground/60">
              © 2024 AITools Academy. All rights reserved.
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li><a href="#courses" className="hover:text-primary-foreground transition-colors">Courses</a></li>
              <li><a href="#about" className="hover:text-primary-foreground transition-colors">About</a></li>
              <li><a href="#contact" className="hover:text-primary-foreground transition-colors">Contact</a></li>
              <li><a href="#faq" className="hover:text-primary-foreground transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li><a href="#help" className="hover:text-primary-foreground transition-colors">Help Center</a></li>
              <li><a href="#privacy" className="hover:text-primary-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="#terms" className="hover:text-primary-foreground transition-colors">Terms of Service</a></li>
              <li><a href="#refunds" className="hover:text-primary-foreground transition-colors">Refund Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-primary-foreground/60">
          <p>Built with ❤️ for AI enthusiasts worldwide</p>
        </div>
      </div>
    </footer>
  );
};