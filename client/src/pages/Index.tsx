import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { CoursesSection } from "@/components/CoursesSection";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/auth');
  };

  const handleDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background font-inter">
      <Header 
        isAuthenticated={!!user}
        onLogin={handleLogin}
        onDashboard={handleDashboard}
      />
      <Hero />
      <CoursesSection />
      <Footer />
    </div>
  );
};

export default Index;
