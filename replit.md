# Mahmood Salah - Personal Portfolio & Services Website

## Overview

This is a personal portfolio and services website for Mahmood Salah, a Senior Data Scientist and AI Engineer. The site has three main pages:

1. **Hire Me** (homepage `/`) — Portfolio showcasing projects, core competencies, and contact information
2. **Consultation** (`/consultation`) — Consultation services page
3. **BootcampAI** (`/bootcampai`) — Landing page for a 10-week LLM & AI Agent bootcamp program (non-profit, scholarship-based)
4. **Mentorship** (`/mentorship`) — Tiered mentorship service offerings with pricing plans
5. **Admin CMS** (`/admin`) — Content management system for editing all site text content (requires authentication)

The application is a full-stack TypeScript project with a React frontend and Express backend, using PostgreSQL for data storage via Drizzle ORM. All text content is stored in the database and editable via the admin CMS panel.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side router) with routes: `/`, `/consultation`, `/bootcampai`, `/mentorship`, `/admin`
- **Styling**: Tailwind CSS with CSS variables for theming. Custom color scheme based on warm gold/brown tones (`#B18F6A` primary)
- **UI Components**: shadcn/ui (new-york style) built on Radix UI primitives. Components live in `client/src/components/ui/`
- **Fonts**: Inter (body) and Montserrat (headings), loaded from Google Fonts
- **State Management**: TanStack React Query for server state
- **Build Tool**: Vite with React plugin
- **Animations**: Custom `useAnimateOnScroll` hook using IntersectionObserver, plus a canvas-based `NetworkBg` particle animation component
- **Path aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`, `@assets/` maps to `attached_assets/`

### Backend Architecture
- **Framework**: Express 5 on Node.js
- **Language**: TypeScript, run via `tsx` in development
- **HTTP Server**: Node `http.createServer` wrapping Express
- **API Pattern**: All API routes should be prefixed with `/api` and registered in `server/routes.ts`
- **Storage Layer**: Abstracted via `IStorage` interface in `server/storage.ts`. Uses `DatabaseStorage` implementation backed by PostgreSQL
- **Authentication**: Replit Auth (OIDC) via `server/replit_integrations/auth/` module. Protects admin write endpoints
- **Development**: Vite dev server runs as middleware for HMR. In production, static files are served from `dist/public/`
- **Build**: Custom build script (`script/build.ts`) that runs Vite for the client and esbuild for the server, outputting to `dist/`

### Data Storage
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Defined in `shared/schema.ts` and `shared/models/auth.ts`
  - `users` table — Replit Auth user records (id, email, firstName, lastName, profileImageUrl)
  - `sessions` table — Express session storage for authentication
  - `site_content` table — CMS content storage with `page`, `section`, `contentKey`, and `value` (JSONB) columns
- **Validation**: Drizzle-zod for generating Zod schemas from Drizzle table definitions
- **Migrations**: Generated via `drizzle-kit push` command, config in `drizzle.config.ts`
- **Database URL**: Requires `DATABASE_URL` environment variable for PostgreSQL connection
- **Session Store**: `connect-pg-simple` is included as a dependency for PostgreSQL-backed sessions

### Key Design Decisions
1. **Shared schema between frontend and backend** — `shared/schema.ts` contains types and validation used by both sides, avoiding duplication
2. **Storage interface pattern** — The `IStorage` interface allows swapping between in-memory and database implementations without changing route handlers
3. **Single server serves everything** — In production, Express serves both the API and the built static frontend files. In development, Vite middleware handles the frontend with HMR

## External Dependencies

### Database
- **PostgreSQL** — Required for production use. Connection via `DATABASE_URL` environment variable
- **Drizzle ORM** — Schema management and query building
- **drizzle-kit** — Database migrations (`db:push` command)

### Frontend Libraries
- **shadcn/ui + Radix UI** — Full component library (accordion, dialog, dropdown, tabs, toast, etc.)
- **TanStack React Query** — Async data fetching and caching
- **Wouter** — Client-side routing
- **Embla Carousel** — Carousel component
- **Recharts** — Chart components
- **react-icons** — Social media icons (LinkedIn, YouTube, X, Facebook)
- **Lucide React** — General purpose icons
- **react-hook-form + @hookform/resolvers** — Form handling with Zod validation
- **date-fns** — Date utilities
- **vaul** — Drawer component

### External Links (not integrations)
- Google Forms link for BootcampAI applications: `https://forms.gle/nCeyqSxashm8Q1bv5`
- Social media profiles (LinkedIn, YouTube, X, Facebook)
- Email-based contact for mentorship bookings

### Build & Dev Tools
- **Vite** — Frontend bundler with HMR
- **esbuild** — Server bundling for production
- **TypeScript** — Full-stack type safety
- **Tailwind CSS + PostCSS + Autoprefixer** — Styling pipeline
- **Replit plugins** — Runtime error overlay, cartographer, dev banner (dev only)