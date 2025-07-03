import { eq, desc } from "drizzle-orm";
import { db } from "./db";
import { 
  users, 
  courses, 
  purchases,
  admins, 
  type User, 
  type Course, 
  type Purchase, 
  type Admin,
  type InsertUser, 
  type InsertCourse, 
  type InsertPurchase,
  type InsertAdmin 
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Course methods
  getAllCourses(): Promise<Course[]>;
  getCourse(id: string): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  updateCourse(id: string, course: Partial<Course>): Promise<Course>;
  deleteCourse(id: string): Promise<void>;
  
  // Purchase methods
  getUserPurchases(userId: string): Promise<(Purchase & { course: Course })[]>;
  createPurchase(purchase: InsertPurchase): Promise<Purchase>;
  updatePurchaseStatus(id: string, status: string): Promise<void>;
  getPurchaseByStripeSession(sessionId: string): Promise<Purchase | undefined>;
  
  // Admin methods
  isUserAdmin(userId: string): Promise<boolean>;
  createAdmin(admin: InsertAdmin): Promise<Admin>;
  getUserAdmin(userId: string): Promise<Admin | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Course methods
  async getAllCourses(): Promise<Course[]> {
    return await db.select().from(courses).orderBy(desc(courses.createdAt));
  }

  async getCourse(id: string): Promise<Course | undefined> {
    const result = await db.select().from(courses).where(eq(courses.id, id)).limit(1);
    return result[0];
  }

  // Purchase methods
  async getUserPurchases(userId: string): Promise<(Purchase & { course: Course })[]> {
    const result = await db
      .select()
      .from(purchases)
      .innerJoin(courses, eq(purchases.courseId, courses.id))
      .where(eq(purchases.userId, userId))
      .orderBy(desc(purchases.createdAt));

    return result.map(row => ({
      ...row.purchases,
      course: row.courses
    }));
  }

  async createPurchase(purchase: InsertPurchase): Promise<Purchase> {
    const result = await db.insert(purchases).values(purchase).returning();
    return result[0];
  }

  async updatePurchaseStatus(id: string, status: string): Promise<void> {
    await db.update(purchases).set({ status }).where(eq(purchases.id, id));
  }

  async getPurchaseByStripeSession(sessionId: string): Promise<Purchase | undefined> {
    const result = await db
      .select()
      .from(purchases)
      .where(eq(purchases.stripeSessionId, sessionId))
      .limit(1);
    return result[0];
  }

  // New course management methods
  async createCourse(course: InsertCourse): Promise<Course> {
    const result = await db.insert(courses).values(course).returning();
    return result[0];
  }

  async updateCourse(id: string, course: Partial<Course>): Promise<Course> {
    const result = await db
      .update(courses)
      .set({ ...course, updatedAt: new Date() })
      .where(eq(courses.id, id))
      .returning();
    return result[0];
  }

  async deleteCourse(id: string): Promise<void> {
    await db.delete(courses).where(eq(courses.id, id));
  }

  // Admin methods
  async isUserAdmin(userId: string): Promise<boolean> {
    const result = await db
      .select()
      .from(admins)
      .where(eq(admins.userId, userId))
      .limit(1);
    return result.length > 0;
  }

  async createAdmin(admin: InsertAdmin): Promise<Admin> {
    const result = await db.insert(admins).values(admin).returning();
    return result[0];
  }

  async getUserAdmin(userId: string): Promise<Admin | undefined> {
    const result = await db
      .select()
      .from(admins)
      .where(eq(admins.userId, userId))
      .limit(1);
    return result[0];
  }
}

export const storage = new DatabaseStorage();
