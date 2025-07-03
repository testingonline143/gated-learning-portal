import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertPurchaseSchema, insertCourseSchema } from "@shared/schema";
import bcrypt from "bcrypt";
import session from "express-session";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";

// Session configuration
declare module "express-session" {
  interface SessionData {
    userId?: string;
    userEmail?: string;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Session middleware
  app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-this',
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: false, // Set to true in production with HTTPS
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Auth middleware
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.session?.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    next();
  };

  // Admin middleware
  const requireAdmin = async (req: any, res: any, next: any) => {
    if (!req.session?.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const isAdmin = await storage.isUserAdmin(req.session.userId);
    if (!isAdmin) {
      return res.status(403).json({ error: "Admin access required" });
    }
    next();
  };

  // File upload setup
  const uploadDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const upload = multer({
    storage: multer.diskStorage({
      destination: uploadDir,
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
      }
    }),
    fileFilter: (req, file, cb) => {
      const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi|pdf|doc|docx/;
      const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowedTypes.test(file.mimetype);
      
      if (mimetype && extname) {
        return cb(null, true);
      } else {
        cb(new Error('Only images, videos, and documents are allowed!'));
      }
    },
    limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
  });

  // Auth routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { email, password, fullName } = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create user
      const user = await storage.createUser({
        email,
        password: hashedPassword,
        fullName: fullName || null
      });

      // Set session
      req.session.userId = user.id;
      req.session.userEmail = user.email;

      res.json({ 
        user: { 
          id: user.id, 
          email: user.email, 
          fullName: user.fullName 
        } 
      });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(400).json({ error: "Invalid input" });
    }
  });

  app.post("/api/auth/signin", async (req, res) => {
    try {
      const { email, password } = z.object({
        email: z.string().email(),
        password: z.string()
      }).parse(req.body);

      // Find user
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Check password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Set session
      req.session.userId = user.id;
      req.session.userEmail = user.email;

      res.json({ 
        user: { 
          id: user.id, 
          email: user.email, 
          fullName: user.fullName 
        } 
      });
    } catch (error) {
      console.error("Signin error:", error);
      res.status(400).json({ error: "Invalid input" });
    }
  });

  app.post("/api/auth/signout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Could not sign out" });
      }
      res.json({ message: "Signed out successfully" });
    });
  });

  app.get("/api/auth/session", async (req, res) => {
    if (!req.session?.userId) {
      return res.json({ user: null, session: null });
    }

    try {
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        req.session.destroy(() => {});
        return res.json({ user: null, session: null });
      }

      res.json({
        user: { 
          id: user.id, 
          email: user.email, 
          fullName: user.fullName 
        },
        session: { userId: user.id }
      });
    } catch (error) {
      console.error("Session error:", error);
      res.status(500).json({ error: "Session error" });
    }
  });

  // Course routes
  app.get("/api/courses", async (req, res) => {
    try {
      const courses = await storage.getAllCourses();
      res.json(courses);
    } catch (error) {
      console.error("Get courses error:", error);
      res.status(500).json({ error: "Failed to fetch courses" });
    }
  });

  app.get("/api/courses/:id", async (req, res) => {
    try {
      const course = await storage.getCourse(req.params.id);
      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }
      res.json(course);
    } catch (error) {
      console.error("Get course error:", error);
      res.status(500).json({ error: "Failed to fetch course" });
    }
  });

  // Purchase routes
  app.get("/api/purchases", requireAuth, async (req, res) => {
    try {
      const purchases = await storage.getUserPurchases(req.session.userId!);
      res.json(purchases);
    } catch (error) {
      console.error("Get purchases error:", error);
      res.status(500).json({ error: "Failed to fetch purchases" });
    }
  });

  // Stripe checkout route (replaces Supabase Edge Function)
  app.post("/api/create-checkout", async (req, res) => {
    try {
      const { courseId } = z.object({
        courseId: z.string()
      }).parse(req.body);

      // Get course details
      const course = await storage.getCourse(courseId);
      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }

      // For now, return a success URL - user will need to provide Stripe keys
      // This replaces the Supabase Edge Function functionality
      res.json({ 
        url: `/success?session_id=demo_session_${Date.now()}`,
        message: "Stripe integration requires API keys. Please provide STRIPE_SECRET_KEY for full functionality."
      });
    } catch (error) {
      console.error("Create checkout error:", error);
      res.status(500).json({ error: "Failed to create checkout session" });
    }
  });

  // Stripe webhook route (replaces Supabase Edge Function)
  app.post("/api/stripe-webhook", async (req, res) => {
    try {
      // This would handle Stripe webhook events
      // For now, return success - requires Stripe configuration
      res.json({ received: true });
    } catch (error) {
      console.error("Webhook error:", error);
      res.status(400).json({ error: "Webhook error" });
    }
  });

  // Serve uploaded files
  app.use('/uploads', express.static(uploadDir));

  // Admin Routes
  
  // Check if user is admin
  app.get("/api/admin/check", requireAuth, async (req, res) => {
    try {
      const isAdmin = await storage.isUserAdmin(req.session.userId!);
      res.json({ isAdmin });
    } catch (error) {
      console.error("Admin check error:", error);
      res.status(500).json({ error: "Failed to check admin status" });
    }
  });

  // Make user admin (for initial setup - you can restrict this later)
  app.post("/api/admin/create", requireAuth, async (req, res) => {
    try {
      await storage.createAdmin({
        userId: req.session.userId!,
        role: 'admin'
      });
      res.json({ message: "Admin access granted" });
    } catch (error) {
      console.error("Create admin error:", error);
      res.status(500).json({ error: "Failed to create admin" });
    }
  });

  // Create new course
  app.post("/api/admin/courses", requireAdmin, async (req, res) => {
    try {
      const courseData = insertCourseSchema.parse(req.body);
      const course = await storage.createCourse(courseData);
      res.json(course);
    } catch (error) {
      console.error("Create course error:", error);
      res.status(400).json({ error: "Failed to create course" });
    }
  });

  // Update course
  app.put("/api/admin/courses/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const course = await storage.updateCourse(id, updates);
      res.json(course);
    } catch (error) {
      console.error("Update course error:", error);
      res.status(400).json({ error: "Failed to update course" });
    }
  });

  // Delete course
  app.delete("/api/admin/courses/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteCourse(id);
      res.json({ message: "Course deleted successfully" });
    } catch (error) {
      console.error("Delete course error:", error);
      res.status(400).json({ error: "Failed to delete course" });
    }
  });

  // Upload file
  app.post("/api/admin/upload", requireAdmin, upload.single('file'), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const fileUrl = `/uploads/${req.file.filename}`;
      res.json({ 
        url: fileUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Failed to upload file" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
