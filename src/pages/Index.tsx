import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { CoursesSection } from "@/components/CoursesSection";
import { Footer } from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();

  const handleLogin = () => {
    toast({
      title: "Login Coming Soon!",
      description: "Authentication will be integrated with Supabase.",
    });
  };

  const handleDashboard = () => {
    toast({
      title: "Dashboard Coming Soon!",
      description: "User dashboard for purchased courses will be available after authentication setup.",
    });
  };

  return (
    <div className="min-h-screen bg-background font-inter">
      <Header 
        isAuthenticated={false}
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
