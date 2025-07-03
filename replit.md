# AITools Academy - Online Course Platform

## Overview

AITools Academy is a modern online course platform specializing in AI tools education. The application is built as a full-stack web application with a React frontend, Express.js backend, and PostgreSQL database. It features course browsing, user authentication, payment processing via Stripe, and a course management system.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack React Query for server state, React Context for authentication
- **Routing**: React Router DOM for client-side navigation
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL via Neon serverless connections
- **Session Management**: In-memory storage with interface for future database persistence

### Design System
- **UI Library**: shadcn/ui components based on Radix UI primitives
- **Color Scheme**: Deep navy (#0F172A) primary, indigo (#6366F1) accent
- **Typography**: Custom CSS variables for consistent theming
- **Responsive**: Mobile-first design with Tailwind CSS breakpoints

## Key Components

### Authentication System
- **Provider**: Supabase Auth integration
- **Features**: Sign up, sign in, session management
- **Storage**: User sessions stored with automatic refresh
- **Context**: React Context provider for global auth state

### Course Management
- **Course Cards**: Responsive cards with image, pricing, and level badges
- **Course Data**: Static course data with structured interfaces
- **Filtering**: Level-based filtering (Beginner, Intermediate, Advanced)
- **Purchase Flow**: Integrated Stripe checkout sessions

### Payment Processing
- **Provider**: Stripe for payment processing
- **Webhooks**: Serverless functions for handling payment events
- **Flow**: Checkout session creation → Payment → Webhook confirmation → Course access

### Database Schema
```sql
-- Users table for authentication
users: {
  id: serial primary key,
  username: text unique not null,
  password: text not null
}

-- Courses table (implied from Supabase integration)
courses: {
  id: string,
  title: string,
  description: string,
  price: number,
  image_url: string,
  level: enum,
  duration: string,
  instructor: string,
  students: number
}

-- Purchases table for tracking course access
purchases: {
  id: string,
  user_id: string,
  course_id: string,
  stripe_session_id: string,
  amount: number,
  status: string
}
```

## Data Flow

### Course Purchase Flow
1. User browses courses on homepage
2. User clicks purchase button → Stripe checkout session created
3. User completes payment → Stripe webhook fired
4. Webhook creates purchase record → User gains course access
5. User can access purchased courses via dashboard

### Authentication Flow
1. User registers/signs in via auth page
2. Supabase handles authentication and session management
3. Auth context provides user state throughout application
4. Protected routes redirect unauthenticated users

### Development Flow
1. Vite dev server serves React frontend with HMR
2. Express server handles API routes and serves static files in production
3. Drizzle ORM manages database schema and queries
4. TypeScript provides type safety across the stack

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Headless UI components
- **stripe**: Payment processing
- **@supabase/supabase-js**: Authentication and real-time features

### Development Tools
- **Vite**: Frontend build tool with React plugin
- **TypeScript**: Type checking and compilation
- **Tailwind CSS**: Utility-first CSS framework
- **ESBuild**: Backend bundling for production

### Supabase Integration
- **Authentication**: User management and session handling
- **Database**: PostgreSQL with real-time subscriptions
- **Edge Functions**: Serverless functions for webhooks
- **Storage**: File uploads for course materials (potential)

## Deployment Strategy

### Production Build
- Frontend built with Vite to `dist/public` directory
- Backend bundled with ESBuild to `dist/index.js`
- Static files served by Express in production mode
- Environment variables for database and API keys

### Database Management
- Drizzle Kit for schema migrations via `db:push` command
- Schema defined in `shared/schema.ts` for type sharing
- Connection pooling via Neon serverless for scalability

### Environment Configuration
- Development: Vite dev server + tsx for backend
- Production: Single Node.js process serving both frontend and API
- Database URL and API keys via environment variables

## Changelog

```
Changelog:
- July 03, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```