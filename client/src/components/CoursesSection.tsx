import { useEffect, useState } from "react";
import { CourseCard } from "@/components/CourseCard";
import { useToast } from "@/hooks/use-toast";

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  instructor: string;
  students: number;
}

export const CoursesSection = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses');
      if (!response.ok) throw new Error('Failed to fetch courses');
      
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load courses",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (courseId: string) => {
    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId }),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to create checkout');
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast({
          title: "Demo Mode",
          description: data.message || "Stripe integration requires API keys for full functionality.",
          variant: "default",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create checkout session",
        variant: "destructive",
      });
    }
  };

  return (
    <section id="courses" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Premium AI Training Courses
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Carefully crafted courses by industry experts. Each course includes video lessons, 
            downloadable resources, and lifetime access.
          </p>
        </div>

        {/* Course Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-lg text-muted-foreground">Loading courses...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                id={course.id}
                title={course.title}
                description={course.description}
                price={course.price / 100} // Convert cents to dollars
                image={course.imageUrl}
                level={course.level}
                duration={course.duration}
                onPurchase={handlePurchase}
              />
            ))}
          </div>
        )}

        {/* Features Banner */}
        <div className="mt-16 bg-gradient-card rounded-xl p-8 border border-course-border shadow-course">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-2xl font-bold text-accent mb-2">✨</div>
              <h3 className="font-semibold text-foreground mb-2">Premium Content</h3>
              <p className="text-muted-foreground text-sm">
                High-quality video lessons with practical examples and real-world applications.
              </p>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent mb-2">📚</div>
              <h3 className="font-semibold text-foreground mb-2">Lifetime Access</h3>
              <p className="text-muted-foreground text-sm">
                Access your courses forever with free updates and new content additions.
              </p>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent mb-2">🎯</div>
              <h3 className="font-semibold text-foreground mb-2">Expert Instructors</h3>
              <p className="text-muted-foreground text-sm">
                Learn from professionals who use these tools daily in their businesses.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};