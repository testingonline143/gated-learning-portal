import chatgptImage from "@/assets/course-chatgpt.jpg";
import midjourneyImage from "@/assets/course-midjourney.jpg";
import automationImage from "@/assets/course-automation.jpg";

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  features: string[];
  instructor: string;
  students: number;
}

export const courses: Course[] = [
  {
    id: "chatgpt-mastery",
    title: "ChatGPT Mastery",
    description: "Master the art of prompt engineering and unlock ChatGPT's full potential for business, writing, and creative tasks.",
    price: 97,
    image: chatgptImage,
    level: "Beginner",
    duration: "4 hours",
    features: [
      "Advanced prompt engineering techniques",
      "Business automation workflows", 
      "Creative writing masterclass",
      "50+ real-world examples",
      "Downloadable prompt library"
    ],
    instructor: "Sarah Johnson",
    students: 1247
  },
  {
    id: "midjourney-pro",
    title: "Midjourney Pro", 
    description: "Create stunning AI art and professional designs with advanced Midjourney techniques and commercial applications.",
    price: 127,
    image: midjourneyImage,
    level: "Intermediate",
    duration: "6 hours",
    features: [
      "Advanced parameter mastery",
      "Style reference techniques",
      "Commercial licensing guide",
      "Brand identity creation",
      "Portfolio building strategies"
    ],
    instructor: "Mike Chen",
    students: 892
  },
  {
    id: "ai-automation",
    title: "AI Automation Toolkit",
    description: "Build powerful automation workflows combining multiple AI tools to streamline your business processes.",
    price: 197,
    image: automationImage,
    level: "Advanced", 
    duration: "8 hours",
    features: [
      "Multi-tool integration workflows",
      "No-code automation platforms",
      "API connections and webhooks",
      "ROI optimization strategies",
      "Custom workflow templates"
    ],
    instructor: "David Rodriguez",
    students: 634
  }
];

export const getCourseById = (id: string): Course | undefined => {
  return courses.find(course => course.id === id);
};