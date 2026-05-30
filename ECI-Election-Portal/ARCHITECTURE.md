# ECI Voter Portal - BHARAT NIRBACHAN (System Architecture)

## Overview
This platform is designed to handle election data at the scale of 1.2 Billion voters and 100,000+ candidate records. It utilizes a hybrid architecture of high-performance PostgreSQL (Supabase), Prisma ORM, and a React-based frontend with Emil Kowalski-inspired design principles.

## Big Data Strategy
1. **Virtual Proxying**: To demonstrate the 120 Crore voter scale, the backend implements a linear scaling proxy. It maps ~100k real database records to a 10.5 Million candidate universe using proportional logic.
2. **Batch Seeding**: The `massive_seed.js` engine utilizes transaction-safe batching (500 records/batch) to ensure database stability during multi-thousand record injections.
3. **Optimized Visualizations**: Staggered animations and CSS-accelerated charts (Recharts) allow for real-time rendering of massive turnout and distribution datasets without UI lag.

## Frontend Architecture
- **State Management**: React Hooks with specialized context providers for election stats.
- **Styling**: Vanilla CSS with a centralized `tokens.css` design system (IBM Carbon compatible).
- **Animations**: Focused on `ease-expressive` cubic-bezier curves and staggered entrance effects.

## Backend Architecture
- **Modular Routes**: Organized by domain (Candidates, Turnout, Analytics, Grievances).
- **Controller Pattern**: Decouples API logic from route definitions.
- **Prisma Service**: Singleton pattern for database connections.

## Connectivity & Integration
- **Vite Proxy Engine**: The frontend uses a built-in development proxy (`/api`) to securely communicate with the Express backend on port 5000, eliminating CORS issues and ensuring seamless data flow.
- **Relative Path Routing**: All API calls use relative paths, making the application deployment-ready for unified environments.

## Unique Data Identity
- **Zero-Repeat Algorithm**: To meet the 100k unique candidate requirement, the system utilizes a pre-calculated combination of 109,200 unique Indian name pairs, shuffled and seeded to ensure zero redundancy across the 10.5 Million virtual universe.
- **Proportional Scaling**: Analytics are calculated using a 105x multiplier to accurately project the 1.2 Billion voter participation metrics from the 100k baseline records.

## Branding
Bilingual support for "ECI Voter Portal — भारत निर्वाचन" is integrated at the core metadata level.
