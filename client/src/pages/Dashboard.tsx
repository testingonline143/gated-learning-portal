import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { LogOut } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
}

interface Purchase {
  id: string;
  course_id: string;
  status: string;
  courses: Course;
}

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchPurchases();
    }
  }, [user]);

  const fetchPurchases = async () => {
    try {
      const { data, error } = await supabase
        .from('purchases')
        .select(`
          id,
          course_id,
          status,
          courses (
            id,
            title,
            description,
            instructor,
            duration
          )
        `)
        .eq('user_id', user?.id)
        .eq('status', 'completed');

      if (error) throw error;
      setPurchases(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load your courses",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You've been signed out successfully.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-lg">Loading your courses...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              AITools Academy
            </h1>
            <Button variant="outline" onClick={handleSignOut} className="flex items-center space-x-2">
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user?.email}!
          </h2>
          <p className="text-muted-foreground">
            Access your purchased courses below.
          </p>
        </div>

        {purchases.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No courses yet</h3>
              <p className="text-muted-foreground mb-4">
                You haven't purchased any courses. Browse our catalog to get started!
              </p>
              <Button asChild>
                <a href="/">Browse Courses</a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {purchases.map((purchase) => (
              <Card key={purchase.id} className="hover:shadow-elegant transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-xl">{purchase.courses.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {purchase.courses.description}
                  </p>
                  <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
                    <span>By {purchase.courses.instructor}</span>
                    <span>{purchase.courses.duration}</span>
                  </div>
                  <Button className="w-full" variant="course">
                    Access Course
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}