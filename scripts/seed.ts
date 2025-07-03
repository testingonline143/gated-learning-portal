import { db } from "../server/db";
import { courses } from "../shared/schema";

async function seedDatabase() {
  try {
    console.log('Seeding database with course data...');
    
    const sampleCourses = [
      {
        title: 'ChatGPT Mastery',
        description: 'Master the art of prompt engineering and unlock ChatGPT\'s full potential for business, writing, and creative tasks.',
        price: 9700,
        imageUrl: '/placeholder.svg',
        level: 'Beginner',
        duration: '4 hours',
        features: ['Advanced prompt engineering techniques', 'Business automation workflows', 'Creative writing masterclass', '50+ real-world examples', 'Downloadable prompt library'],
        instructor: 'Sarah Johnson',
        students: 1247
      },
      {
        title: 'Midjourney Pro',
        description: 'Create stunning AI art and professional designs with advanced Midjourney techniques and commercial applications.',
        price: 12700,
        imageUrl: '/placeholder.svg',
        level: 'Intermediate',
        duration: '6 hours',
        features: ['Advanced parameter mastery', 'Style reference techniques', 'Commercial licensing guide', 'Brand identity creation', 'Portfolio building strategies'],
        instructor: 'Mike Chen',
        students: 892
      },
      {
        title: 'AI Automation Toolkit',
        description: 'Build powerful automation workflows combining multiple AI tools to streamline your business processes.',
        price: 19700,
        imageUrl: '/placeholder.svg',
        level: 'Advanced',
        duration: '8 hours',
        features: ['Multi-tool integration workflows', 'No-code automation platforms', 'API connections and webhooks', 'ROI optimization strategies', 'Custom workflow templates'],
        instructor: 'David Rodriguez',
        students: 634
      }
    ];

    // Check if courses already exist
    const existingCourses = await db.select().from(courses).limit(1);
    if (existingCourses.length > 0) {
      console.log('Courses already exist, skipping seed...');
      return;
    }

    await db.insert(courses).values(sampleCourses);
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

seedDatabase()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));