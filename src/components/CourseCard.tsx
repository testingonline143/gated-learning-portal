import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  onPurchase: (courseId: string) => void;
}

export const CourseCard = ({ 
  id, 
  title, 
  description, 
  price, 
  image, 
  level, 
  duration, 
  onPurchase 
}: CourseCardProps) => {
  const handlePurchase = () => {
    onPurchase(id);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner": return "bg-success text-success-foreground";
      case "Intermediate": return "bg-accent text-accent-foreground";
      case "Advanced": return "bg-destructive text-destructive-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="group hover:shadow-elegant transition-all duration-300 border-course-border bg-gradient-card h-full flex flex-col">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <img 
            src={image} 
            alt={title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3">
            <Badge className={getLevelColor(level)}>
              {level}
            </Badge>
          </div>
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-white/90 text-foreground">
              {duration}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-accent transition-colors">
          {title}
        </h3>
        <p className="text-muted-foreground leading-relaxed flex-1">
          {description}
        </p>
      </CardContent>
      
      <CardFooter className="p-6 pt-0 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-2xl font-bold text-price-highlight">
            ${price}
          </span>
          <span className="text-sm text-muted-foreground">
            One-time payment
          </span>
        </div>
        <Button 
          variant="purchase" 
          size="lg"
          onClick={handlePurchase}
          className="ml-4"
        >
          Buy Now
        </Button>
      </CardFooter>
    </Card>
  );
};