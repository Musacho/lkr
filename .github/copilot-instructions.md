# Copilot Instructions for Student Brilliance Tracker

## Project Overview
Student Brilliance Tracker is a React + TypeScript web application for managing student records, marks, and academic reports using the Zambian ECZ grading system. Built with Vite, shadcn-ui, Tailwind CSS, and Supabase for backend services.

## Architecture

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: shadcn-ui (Radix UI primitives) + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Data Fetching**: React Query
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod validation
- **State Management**: React Context API + Custom hooks

### Core Data Flow
1. **Authentication**: `useAuth()` hook manages Supabase Auth (sign in/out, role-based access)
2. **Global State**: `AppContext` provides students, marks, and computed results (rankings, grades)
3. **Protected Routes**: `ProtectedRoute` component gates all pages except `/auth`
4. **Database**: Supabase tables: `students`, `marks`, `profiles`, `user_roles`

### Key Components Structure
- `src/pages/`: Page-level components (Dashboard, Students, Marks, Reports, etc.)
- `src/components/ui/`: shadcn-ui primitive components (auto-generated, don't edit)
- `src/components/`: Domain-specific components (StudentForm, StatCard, ReportCard, etc.)
- `src/context/AppContext.tsx`: Central hub for student/marks data and computed results
- `src/hooks/`: Custom hooks (useAuth, use-toast, use-mobile)
- `src/lib/`: Utility functions (gradeUtils, pdfExport)

## Critical Patterns

### Grading System (Zambian ECZ)
- Grade scale: 1 (highest, 75-100%) to 9 (lowest/fail, <25%)
- Marks: Continuous Assessment (CA) + Exam marks = Total
- Best 6 points calculation for aggregation (see `gradeUtils.ts`)
- Compulsory subjects: Math, English, Science, Social Studies, Life Skills
- Use `calculateGrade()`, `getGradeRemarks()`, `getGradePoints()` from `lib/gradeUtils.ts`

### Data Fetching Pattern
```typescript
// Use AppContext for shared state, not direct Supabase queries
const { students, marks, getStudentResults, refreshData } = useApp();

// For UI feedback on async operations
const { toast } = useToast();
await refreshData(); // Triggers automatic data refetch from Supabase
```

### Component Patterns
- **Server-driven UI**: All student/mark data flows through AppContext (Supabase as source of truth)
- **Loading States**: Use `Loader2` icon from lucide-react with `animate-spin` class
- **Toast Notifications**: Use `useToast()` hook for success/error feedback
- **Form Validation**: React Hook Form + Zod schema (see StudentForm.tsx)

### TypeScript Conventions
- Grade/Stream types use unions: `Grade = '1' | '2' | ... | '12'`, `Stream = 'A' | 'B'`
- Relaxed TypeScript: `noImplicitAny: false`, `strictNullChecks: false` (see tsconfig.json)
- Component props interface naming: `ComponentNameProps` (e.g., `ProtectedRouteProps`)

### Styling Patterns
- **Tailwind CSS**: No custom CSS files except `src/App.css` and `src/index.css`
- **Color Variables**: Use CSS custom properties (--primary, --foreground, etc.)
- **Responsive Grid**: Use `grid-cols-1 md:grid-cols-2 lg:grid-cols-4` for multi-column layouts
- **Grade Coloring**: Use `getGradeColor()` from gradeUtils for consistent grade visualization

### Path Aliases
- All imports use `@/` prefix: `import { Button } from '@/components/ui/button'`
- Configured in `vite.config.ts` and `tsconfig.json`

## Development Workflow

### Running the Project
```bash
npm run dev      # Start Vite dev server (port 8080)
npm run build    # Production build
npm run lint     # Run ESLint
npm run preview  # Preview production build locally
```

### Environment Setup
- **Supabase**: Create `.env.local` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`
- **Database**: Migrations run automatically on Supabase sync (see `supabase/migrations/`)
- **Auth Roles**: `user_roles` table determines access level (admin/teacher)

### Adding Features
1. **New Page**: Create file in `src/pages/`, add route in `App.tsx`
2. **New Data Model**: Extend types in `src/types/index.ts`, add Supabase table, update AppContext
3. **New UI Component**: Use shadcn-ui (`npx shadcn-ui@latest add <component>`) or create custom in `src/components/`
4. **New Utility**: Add to `src/lib/` if reusable, or component file if single-use

## Common Gotchas

### Supabase Auth
- Auth state listener must be set up BEFORE checking for existing session (see useAuth.tsx)
- Use `setTimeout(..., 0)` to avoid Supabase deadlock when fetching user roles
- Role-based access controlled via `user_roles` table (default: 'teacher')

### React Query
- QueryClient configured in `App.tsx` but primarily used through AppContext
- AppContext handles Supabase queries; components shouldn't make direct Supabase queries

### Data Persistence
- All student/mark mutations go through AppContext methods (addStudent, updateMark, etc.)
- These trigger Supabase writes + local state updates
- Use `refreshData()` to sync with database after external changes

### Component Updates
- shadcn-ui components are auto-generated—never edit `src/components/ui/` directly
- Create custom wrapper components in `src/components/` if you need modified behavior

## File Structure Quick Reference
- **Types**: `src/types/index.ts` (Student, Mark, Grade, Stream, etc.)
- **Grades**: `src/lib/gradeUtils.ts` (ECZ grading logic)
- **Initial Data**: `src/data/initialData.ts` (core/optional subjects, seed students)
- **Auth/Roles**: `src/hooks/useAuth.tsx`, `src/integrations/supabase/client.ts`
- **Supabase Schema**: `supabase/migrations/` (profiles, students, marks tables)
