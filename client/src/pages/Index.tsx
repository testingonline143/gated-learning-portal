import { useLocation } from 'wouter';
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { CoursesSection } from "@/components/CoursesSection";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();
  const [location, setLocation] = useLocation();

  const handleLogin = () => {
    setLocation('/auth');
  };

  const handleDashboard = () => {
    setLocation('/dashboard');
  };

  const handleAdmin = () => {
    setLocation('/admin');
  };

  return (
    <div className="min-h-screen bg-background font-inter">
      <Header 
        isAuthenticated={!!user}
        onLogin={handleLogin}
        onDashboard={handleDashboard}
        onAdmin={handleAdmin}
      />
      <Hero />
      <CoursesSection />
      <Footer />
    </div>
  );
};

export default Index;
