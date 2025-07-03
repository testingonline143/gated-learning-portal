import { Button } from "@/components/ui/button";
import { User, LogIn } from "lucide-react";

interface HeaderProps {
  isAuthenticated?: boolean;
  onLogin?: () => void;
  onDashboard?: () => void;
}

export const Header = ({ isAuthenticated, onLogin, onDashboard }: HeaderProps) => {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              AITools Academy
            </h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a 
              href="#courses" 
              className="text-foreground hover:text-accent transition-colors font-medium"
            >
              Courses
            </a>
            <a 
              href="#about" 
              className="text-foreground hover:text-accent transition-colors font-medium"
            >
              About
            </a>
            <a 
              href="#contact" 
              className="text-foreground hover:text-accent transition-colors font-medium"
            >
              Contact
            </a>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <Button 
                variant="course" 
                onClick={onDashboard}
                className="flex items-center space-x-2"
              >
                <User className="h-4 w-4" />
                <span>Dashboard</span>
              </Button>
            ) : (
              <Button 
                variant="outline" 
                onClick={onLogin}
                className="flex items-center space-x-2"
              >
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};