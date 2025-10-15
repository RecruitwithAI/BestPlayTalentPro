# BestPlay Hub - Frontend Architecture Documentation

## Technology Stack

### Core Technologies
- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **Routing**: React Router DOM v6
- **State Management**: TanStack Query (React Query) v5
- **Backend**: Supabase (Authentication, Database, Edge Functions)
- **UI Components**: shadcn/ui (Radix UI primitives)
- **3D Graphics**: Three.js with React Three Fiber
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React

## Project Structure

```
src/
├── components/
│   ├── ui/                    # shadcn/ui components (buttons, cards, dialogs, etc.)
│   ├── Navbar.tsx            # Main navigation component
│   ├── SignupLoginButton.tsx # Authentication button
│   └── ThreeBackground.tsx   # 3D background component
│
├── pages/
│   ├── Landing.tsx           # Landing page with features & CTA
│   ├── Login.tsx             # User login page
│   ├── Register.tsx          # User registration page
│   ├── Dashboard.tsx         # Main dashboard with stats & activities
│   ├── AITools.tsx           # AI tools hub
│   ├── SearchStrategyCreator.tsx  # AI-powered search strategy tool
│   ├── CandidateSentiment.tsx     # Sentiment analysis challenge
│   ├── LiveJam.tsx           # Live collaboration sessions
│   ├── Contests.tsx          # Recruiting contests
│   ├── Training.tsx          # Training modules
│   ├── Calendar.tsx          # Event calendar
│   ├── NotFound.tsx          # 404 page
│   └── Index.tsx             # Root index (redirects to Landing)
│
├── hooks/
│   ├── use-mobile.tsx        # Mobile device detection hook
│   └── use-toast.ts          # Toast notification hook
│
├── integrations/
│   └── supabase/
│       ├── client.ts         # Supabase client configuration
│       └── types.ts          # Auto-generated database types
│
├── lib/
│   └── utils.ts              # Utility functions (cn, etc.)
│
├── App.tsx                   # Main app component with routing
├── main.tsx                  # Entry point
└── index.css                 # Global styles & design tokens

supabase/
├── functions/
│   ├── calculate-sentiment/  # Sentiment analysis edge function
│   └── search-strategy/      # Search strategy generation
├── migrations/               # Database migration files
└── config.toml              # Supabase configuration
```

## Routing Architecture

### Routes
- `/` - Landing page
- `/login` - Login page
- `/register` - Registration page
- `/dashboard` - Main dashboard
- `/ai-tools` - AI tools hub
- `/ai-tools/search-strategy` - Search strategy creator
- `/live-jam` - Live collaboration sessions
- `/contests` - Recruiting contests
- `/training` - Training modules
- `/calendar` - Event calendar
- `/candidate-sentiment` - Sentiment analysis challenge
- `*` - 404 Not Found page

## Database Schema

### Tables

#### `subscriber`
- User profile information
- Columns: id, created_at, updated_at, display_name, avatar_url, bio, username
- RLS: Public read, user can insert/update own profile

#### `calendar_events`
- Event scheduling
- Columns: id, event_type, start_time, end_time, created_by, title, description
- RLS: Public read, creator can CRUD own events

#### `challenges`
- Recruiting challenges
- Columns: id, title, description, candidate_situation, status, created_by, deadline, max_submissions
- RLS: Public read active challenges, creator manages own

#### `challenge_submissions`
- User submissions for challenges
- Columns: id, challenge_id, submitted_by, messaging_flow, sentiment_score, status, feedback
- RLS: Public read submitted entries, user manages own submissions

## Design System

### Color Tokens (HSL-based)
Defined in `src/index.css`:
- Primary colors with variants
- Secondary/accent colors
- Muted/foreground colors
- Destructive/warning states
- Sidebar-specific tokens
- Custom gradients

### Typography
- Font Family: 'Atkinson Hyperlegible'
- Semantic text sizes via Tailwind

### Animations
- `accordion-down`, `accordion-up`
- `fade-in-up`
- `glow-pulse`
- `float`
- `signup-letter` (text animation)

### Component Variants
- Button variants: default, destructive, outline, secondary, ghost, link, gaming, premium, outline-white
- Card styles with glassmorphism effects
- Gaming-themed gradients

## State Management

### TanStack Query
- Used for server state management
- Configured in `App.tsx` with QueryClientProvider
- Handles data fetching, caching, and synchronization

### Local State
- React useState for component-level state
- React Hook Form for form state

## Authentication Flow

### Supabase Auth
- Email/password authentication
- Social login placeholders (Google, GitHub)
- Session persistence via localStorage
- Auto-refresh tokens enabled

## Edge Functions

### `calculate-sentiment`
- Analyzes sentiment of messaging flows
- Used in Candidate Sentiment Challenge
- CORS-enabled for frontend calls

### `search-strategy`
- Generates AI-powered search strategies
- Integrates with Search Strategy Creator page
- CORS-enabled for frontend calls

## Key Features

### Dashboard
- Statistics cards (Challenges Won, Training Completed, Skills Mastered, Community Rank)
- Recent activities feed
- Quick actions (Practice, Join Event, Start Challenge)
- Upcoming events sidebar
- Level up achievements

### AI Tools
- Search Strategy Creator: AI-powered recruitment search strategy generation
- Candidate Sentiment Analysis: Practice messaging with sentiment scoring

### Calendar
- Event type filtering (Training, Live Jam, Contest, Webinar)
- Event creation and management
- Visual calendar interface

### Contests
- Browse recruiting challenges
- Submit messaging flows
- View leaderboard
- Receive feedback

### Training
- Module-based learning
- Progress tracking
- Skill development

## Best Practices Implemented

### Performance
- Lazy loading with React.lazy (potential for dynamic imports)
- Tree-shaking with Vite
- Component-based architecture for code splitting

### Accessibility
- Semantic HTML
- Radix UI primitives (ARIA-compliant)
- Keyboard navigation support
- Reduced motion support in CSS

### Security
- Row Level Security (RLS) on all tables
- Supabase auth integration
- Environment variables for sensitive data
- CORS configuration for edge functions

### Code Quality
- TypeScript for type safety
- ESLint configuration
- Component composition pattern
- Utility-first CSS with Tailwind

## UI/UX Patterns

### Navigation
- Persistent navbar across all pages
- Active route highlighting
- Mobile-responsive design

### Feedback
- Toast notifications (Sonner)
- Loading states
- Error boundaries (via NotFound page)
- Form validation feedback

### Theming
- Dark/light mode support
- Gaming aesthetic with neon accents
- Glassmorphism effects
- Gradient backgrounds
- Custom animations

## Development Workflow

### Local Development
```bash
npm install
npm run dev
```

### Build Process
- Vite for fast HMR
- Component tagging in development mode
- Path aliases (@/ for src/)

### Deployment
- Lovable Cloud hosting
- Automatic Supabase integration
- Environment variable management

## Future Considerations

### Scalability
- Current architecture supports:
  - Additional pages via routing
  - New UI components via shadcn
  - Extended database schema via migrations
  - More edge functions for backend logic

### Extension Points
- Additional AI tools
- More challenge types
- Advanced analytics
- Real-time collaboration features
- Mobile app (React Native potential)
