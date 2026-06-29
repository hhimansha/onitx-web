# OnitX — Web Frontend

Modern task management web application for teams. Built with React, TypeScript, and Tailwind CSS.

## Features

- **Landing page** — Public SaaS-style homepage with theme toggle
- **Authentication** — Login, register, forgot/reset password with JWT
- **Dashboard** — Real-time stats, charts (status, priority, trends, top assignees)
- **Task management** — Kanban board (drag-and-drop) and table view
- **Priority system** — HIGH / MEDIUM / LOW with color-coded cards and badges
- **Team assignment** — Multi-assignee selection with avatar stacks
- **Dark / light mode** — Persisted per user via localStorage
- **Admin panel** — User management with task stats per user
- **Role-based access** — Admin and regular user roles

## Tech Stack

| Layer | Library |
|---|---|
| UI framework | React 18 |
| Language | TypeScript |
| Build tool | Vite |
| Styling | Tailwind CSS + Shadcn UI (Radix UI) |
| Routing | React Router v6 |
| Server state | TanStack React Query |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Drag and drop | dnd-kit |
| HTTP client | Axios |
| Fonts | Roboto (Google Fonts) |

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- OnitX backend running (see backend repo)

### Installation

```bash
# 1. Clone the repository
git clone <repo-url>
cd onitx-web

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Set VITE_API_URL to your backend base URL
```

### Development

```bash
npm run dev
```

Runs at `http://localhost:5173` by default.

### Production build

```bash
npm run build       # Type-check + bundle
npm run preview     # Preview the build locally
```

Output goes to `dist/`.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
├── components/
│   ├── kanban/           # Kanban board, columns, task cards
│   ├── charts/           # Dashboard charts (Recharts)
│   ├── ui/               # Shadcn UI primitives
│   ├── AssigneeMultiSelect.tsx
│   ├── Navbar.tsx
│   ├── Sidebar.tsx
│   ├── TaskPriorityBadge.tsx
│   ├── TaskStatusBadge.tsx
│   └── ProtectedRoute.tsx
├── context/
│   ├── AuthContext.tsx   # JWT auth state
│   └── ThemeContext.tsx  # Dark/light mode
├── hooks/                # Custom hooks (useAuth, useDashboard, …)
├── layouts/
│   └── MainLayout.tsx    # Sidebar + Navbar shell
├── pages/
│   ├── HomePage.tsx      # Public landing page
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── DashboardPage.tsx
│   ├── TaskListPage.tsx
│   ├── TaskDetailPage.tsx
│   ├── ProfilePage.tsx
│   └── UsersPage.tsx     # Admin only
├── services/             # Axios API calls
├── types/                # Shared TypeScript types
├── utils/
│   └── cn.ts             # Tailwind class merge helper
├── App.tsx               # Router + providers
├── main.tsx              # Entry point
└── index.css             # Global styles, Tailwind, CSS variables
```

## Routes

| Path | Page | Auth |
|---|---|---|
| `/` | Landing page | Public |
| `/login` | Sign in | Public |
| `/register` | Sign up | Public |
| `/forgot-password` | Forgot password | Public |
| `/reset-password/:token` | Reset password | Public |
| `/dashboard` | Dashboard | Required |
| `/tasks` | Task list (board + table) | Required |
| `/tasks/new` | Create task | Required |
| `/tasks/:id` | Task detail | Required |
| `/tasks/:id/edit` | Edit task | Required |
| `/profile` | User profile | Required |
| `/users` | User management | Admin only |

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend REST API (e.g. `http://localhost:5000/api`) |

## Adding Shadcn Components

```bash
npx shadcn@latest add <component-name>
```

Components are added to `src/components/ui/`.
