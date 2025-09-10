# CCTV Operations Dashboard

## Overview

This is a comprehensive CCTV Operations Dashboard built as a full-stack web application for monitoring and managing network security cameras. The system provides real-time camera feed monitoring, automated network device discovery, and centralized camera management capabilities. It combines modern web technologies with network protocols to deliver a professional security monitoring solution.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern component patterns
- **UI Components**: Radix UI with shadcn/ui design system for consistent, accessible interfaces
- **Styling**: Tailwind CSS with custom CSS variables for theming and responsive design
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express server framework
- **Language**: TypeScript for full-stack type safety
- **Storage Strategy**: In-memory storage with planned database migration to PostgreSQL
- **API Design**: RESTful endpoints with Zod schema validation for type-safe data handling
- **Development Setup**: Hot module replacement with Vite integration for seamless development

### Database Design
- **Current**: In-memory storage using Map objects for rapid prototyping
- **Planned**: PostgreSQL with Drizzle ORM for production deployment
- **Schema**: Three main entities - cameras, discovered devices, and system statistics
- **Validation**: Drizzle-Zod integration for runtime type checking and schema validation

### UI/UX Design Patterns
- **Design System**: New York variant of shadcn/ui with neutral color scheme
- **Layout**: Sidebar navigation with main dashboard area and responsive grid layouts
- **Components**: Modular component architecture with consistent prop interfaces
- **Accessibility**: Radix UI primitives ensure WCAG compliance and keyboard navigation

### Development Workflow
- **Monorepo Structure**: Shared schema types between client and server for consistency
- **Hot Reloading**: Vite development server with Express middleware integration
- **Type Checking**: Comprehensive TypeScript configuration across all packages
- **Build Process**: Separate client (Vite) and server (esbuild) build pipelines

## External Dependencies

### Database Services
- **PostgreSQL**: Production database (configured via DATABASE_URL environment variable)
- **Neon Database**: Serverless PostgreSQL provider for cloud deployment
- **Drizzle Kit**: Database migration and schema management toolkit

### UI and Styling
- **Radix UI**: Comprehensive set of accessible, unstyled UI primitives
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **Lucide React**: Consistent icon library for interface elements
- **shadcn/ui**: Pre-built component library built on Radix UI and Tailwind

### Development Tools
- **Replit Integration**: Development environment with runtime error overlay and cartographer
- **ESBuild**: Fast JavaScript bundler for server-side code
- **PostCSS**: CSS processing with Tailwind and Autoprefixer plugins

### Runtime Libraries
- **TanStack Query**: Server state management with caching and synchronization
- **React Hook Form**: Form handling with Hookform Resolvers for validation
- **Zod**: Runtime type validation and schema definition
- **Date-fns**: Date manipulation and formatting utilities

### Planned Integrations
- **ONVIF Protocol**: Industry standard for IP camera discovery and control
- **UPnP/SSDP**: Universal Plug and Play for automatic device detection
- **RTSP Streaming**: Real-Time Streaming Protocol for camera feed handling
- **Network Scanning**: IP range scanning for camera discovery automation