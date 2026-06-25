# OnitX Web

React frontend for the OnitX application.

## Tech Stack

- **React 18** — UI library
- **Vite** — build tool and dev server
- **TypeScript** — type safety
- **Tailwind CSS** — utility-first styling
- **Shadcn UI** — accessible component library built on Radix UI
- **React Router v6** — client-side routing
- **Axios** — HTTP client
- **React Hook Form** — form state management
- **Zod** — schema validation

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# 1. Clone the repository
git clone <repo-url>
cd onitx-web

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env and set VITE_API_URL to your backend URL

# 4. Start the development server
npm run dev
```

The app runs at `http://localhost:5173` by default.

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
├── components/       # Shared/reusable components
│   ├── ui/           # Shadcn UI components
│   ├── Navbar.tsx
│   └── ProtectedRoute.tsx
├── hooks/            # Custom React hooks
├── layouts/          # Page layout wrappers
│   └── MainLayout.tsx
├── pages/            # Route-level page components
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   ├── TaskListPage.tsx
│   ├── NewTaskPage.tsx
│   ├── TaskDetailPage.tsx
│   └── EditTaskPage.tsx
├── services/         # API calls (Axios)
│   └── api.ts
├── types/            # Shared TypeScript types
│   └── index.ts
├── utils/            # Utility functions
│   └── cn.ts
├── App.tsx           # Root component with router
├── main.tsx          # Entry point
└── index.css         # Global styles + Tailwind + CSS variables
```

## Routes

| Path | Page | Auth Required |
|------|------|--------------|
| `/login` | Login | No |
| `/dashboard` | Dashboard | Yes |
| `/tasks` | Task List | Yes |
| `/tasks/new` | New Task | Yes |
| `/tasks/:id` | Task Detail | Yes |
| `/tasks/:id/edit` | Edit Task | Yes |

Unauthenticated users are redirected to `/login`. The `ProtectedRoute` component reads a `token` key from `localStorage` — replace with your real auth logic when implementing the auth feature.

## Adding Shadcn Components

```bash
npx shadcn@latest add <component-name>
# e.g.
npx shadcn@latest add input
npx shadcn@latest add card
npx shadcn@latest add dialog
```

Components are added to `src/components/ui/`.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Base URL of the backend REST API |
