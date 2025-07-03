import { Button } from "@/components/ui/button";
import heroBackground from "@/assets/hero-bg.jpg";

export const Hero = () => {
  const scrollToCourses = () => {
    document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroBackground} 
          alt="AI Training Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-accent/80"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Master AI Tools with
            <span className="block text-transparent bg-gradient-to-r from-white to-white/80 bg-clip-text">
              Premium Training Courses
            </span>
          </h1>
          
          <p className="text-xl text-white/90 mb-8 leading-relaxed max-w-2xl mx-auto">
            Learn from industry experts with hands-on video courses, downloadable resources, 
            and practical projects. Transform your workflow with cutting-edge AI tools.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              variant="course" 
              onClick={scrollToCourses}
              className="text-lg px-8 py-6 bg-white text-primary hover:bg-white/90"
            >
              Browse Courses
            </Button>
            <div className="text-white/80 text-sm">
              ⭐ Trusted by 1,000+ professionals
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent z-10"></div>
    </section>
  );
};