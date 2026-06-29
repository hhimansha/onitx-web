import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight, Sun, Moon, LayoutDashboard, Flag, Users,
  BarChart3, Clock, Shield, Check, Zap, Globe, ChevronRight,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/utils/cn";

// ── Scroll reveal hook ────────────────────────────────────────────────────────

const useScrollReveal = (threshold = 0.15) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
};

// ── Navbar ────────────────────────────────────────────────────────────────────

const LandingNav = () => {
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border/50 bg-background/90 shadow-sm backdrop-blur-md"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <img
          src={theme === "dark" ? "/onitx-white1.png" : "/onitx-black1.png"}
          alt="OnitX"
          className="h-5 w-auto"
        />

        <div className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
          <a href="#features" className="transition-colors hover:text-foreground">Features</a>
          <a href="#showcase" className="transition-colors hover:text-foreground">How It Works</a>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>

          <Link
            to="/login"
            className="hidden rounded-lg px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent sm:inline-flex"
          >
            Sign in
          </Link>

          <Link
            to="/register"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#1b17ff] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[#1511dd] hover:shadow-md hover:shadow-[#1b17ff]/30"
          >
            Get started <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </nav>
  );
};

// ── Hero ──────────────────────────────────────────────────────────────────────

const HeroSection = () => {
  const { theme } = useTheme();

  return (
    <section className="relative overflow-hidden pb-0 pt-32">
      {/* Subtle dot grid background */}
      <div className="absolute inset-0 [background-image:radial-gradient(hsl(var(--border))_1px,transparent_1px)] [background-size:32px_32px] opacity-60" />

      {/* Blue glow blob behind hero */}
      <div className="absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-[#1b17ff]/10 blur-[120px]" />

      <div className="relative mx-auto max-w-5xl px-6 text-center">
        {/* Announcement badge */}
        <div className="mb-8 inline-flex animate-fade-in-up items-center gap-2 rounded-full border border-[#1b17ff]/25 bg-[#1b17ff]/8 px-4 py-1.5 text-sm font-medium text-[#1b17ff]"
          style={{ animationDelay: "0ms" }}>
          <Zap className="h-3.5 w-3.5" />
          Task management, reimagined for modern teams
          <ChevronRight className="h-3.5 w-3.5 opacity-60" />
        </div>

        {/* Headline */}
        <h1
          className="animate-fade-in-up text-5xl font-black leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl"
          style={{ animationDelay: "80ms" }}
        >
          Stop juggling tasks.{" "}
          <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-[#1b17ff] via-[#4f46e5] to-[#818cf8] bg-clip-text text-transparent">
            Start shipping
          </span>{" "}
          results.
        </h1>

        <p
          className="animate-fade-in-up mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground"
          style={{ animationDelay: "160ms" }}
        >
          OnitX gives your team one beautiful place to manage tasks, set priorities,
          track deadlines, and stay aligned — so you spend less time organizing and
          more time delivering.
        </p>

        {/* CTA row */}
        <div
          className="animate-fade-in-up mt-10 flex flex-wrap items-center justify-center gap-4"
          style={{ animationDelay: "240ms" }}
        >
          <Link
            to="/register"
            className="relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-[#1b17ff] px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-[#1511dd] hover:shadow-xl hover:shadow-[#1b17ff]/30 active:scale-95"
          >
            <span className="absolute inset-0 -translate-x-full animate-shimmer-slide bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            Get started free <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-background/80 px-8 py-3.5 text-base font-semibold transition-colors hover:bg-accent"
          >
            Sign in to your workspace
          </Link>
        </div>

        <p
          className="animate-fade-in-up mt-4 text-sm text-muted-foreground"
          style={{ animationDelay: "300ms" }}
        >
          Free to start &nbsp;·&nbsp; No credit card required &nbsp;·&nbsp; Ready in minutes
        </p>

        {/* Trust indicators */}
        <div
          className="animate-fade-in-up mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
          style={{ animationDelay: "360ms" }}
        >
          {[
            { icon: Shield, text: "SOC 2 compliant" },
            { icon: Globe,  text: "99.9% uptime" },
            { icon: Users,  text: "500+ teams" },
          ].map(({ icon: Icon, text }) => (
            <span key={text} className="flex items-center gap-1.5">
              <Icon className="h-3.5 w-3.5 text-[#1b17ff]" /> {text}
            </span>
          ))}
        </div>

        {/* Dashboard screenshot — browser mockup */}
        <div className="relative mx-auto mt-16 max-w-5xl animate-float">
          {/* Glow behind */}
          <div className="absolute inset-x-16 bottom-0 top-8 -z-10 rounded-3xl bg-[#1b17ff]/15 blur-3xl" />

          {/* Browser chrome */}
          <div className="overflow-hidden rounded-2xl border border-border/50 shadow-[0_30px_100px_rgba(0,0,0,0.2)] ring-1 ring-border/20">
            <div className="flex items-center gap-3 border-b border-border/50 bg-card px-4 py-3">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-400/80" />
                <div className="h-3 w-3 rounded-full bg-amber-400/80" />
                <div className="h-3 w-3 rounded-full bg-green-400/80" />
              </div>
              <div className="mx-auto flex w-60 items-center justify-center gap-2 rounded-md bg-muted/60 px-3 py-1 text-xs text-muted-foreground">
                <Shield className="h-3 w-3" />
                app.onitx.io/dashboard
              </div>
              <div className="w-16" />
            </div>
            <img
              src={theme === "dark" ? "/dark-dash.png" : "/light-dash.png"}
              alt="OnitX Dashboard"
              className="block w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

// ── Features ──────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: LayoutDashboard,
    accent: "text-blue-600 bg-blue-50 dark:bg-blue-950/50 dark:text-blue-400",
    title: "Kanban Boards",
    desc: "Visualize your workflow with drag-and-drop boards. Move tasks through Open, In Progress, Testing, and Done stages with ease.",
  },
  {
    icon: Flag,
    accent: "text-red-600 bg-red-50 dark:bg-red-950/50 dark:text-red-400",
    title: "Priority Management",
    desc: "Set HIGH, MEDIUM, and LOW priorities so your team always knows what matters most. Color-coded cards make urgency instantly visible.",
  },
  {
    icon: Users,
    accent: "text-violet-600 bg-violet-50 dark:bg-violet-950/50 dark:text-violet-400",
    title: "Team Assignment",
    desc: "Assign tasks to one or multiple team members with avatar stacks. Clear ownership ensures nothing falls through the cracks.",
  },
  {
    icon: BarChart3,
    accent: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-400",
    title: "Analytics Dashboard",
    desc: "Real-time insights into task completion rates, team performance, and priority breakdowns — all in one beautiful view.",
  },
  {
    icon: Clock,
    accent: "text-amber-600 bg-amber-50 dark:bg-amber-950/50 dark:text-amber-400",
    title: "Smart Deadlines",
    desc: "Never miss a deadline. Instant visibility into overdue tasks and what's due today so your team can course-correct fast.",
  },
  {
    icon: Moon,
    accent: "text-slate-600 bg-slate-100 dark:bg-slate-800/60 dark:text-slate-300",
    title: "Dark & Light Mode",
    desc: "Work comfortably at any hour. OnitX adapts to your preferred theme and remembers your choice across every session.",
  },
];

const FeaturesSection = () => {
  const { ref, visible } = useScrollReveal();

  return (
    <section id="features" className="py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-widest text-[#1b17ff]">
            Features
          </p>
          <h2 className="text-4xl font-bold tracking-tight">
            Everything your team needs
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Built for teams that want clarity, speed, and full visibility over their
            work — without drowning in complexity.
          </p>
        </div>

        <div
          ref={ref}
          className={cn(
            "grid grid-cols-1 gap-5 transition-all duration-700 sm:grid-cols-2 lg:grid-cols-3",
            visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          )}
        >
          {FEATURES.map(({ icon: Icon, accent, title, desc }) => (
            <div
              key={title}
              className="group rounded-2xl border border-border/60 bg-card p-6 transition-all duration-200 hover:border-border hover:shadow-lg"
            >
              <div className={cn("mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl", accent)}>
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 font-semibold">{title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── Showcase ──────────────────────────────────────────────────────────────────

const ShowcaseSection = () => {
  const { theme } = useTheme();
  const row1 = useScrollReveal();
  const row2 = useScrollReveal();

  return (
    <section id="showcase" className="bg-muted/30 py-28">
      <div className="mx-auto max-w-6xl space-y-28 px-6">

        {/* Row 1: text left, image right */}
        <div
          ref={row1.ref}
          className={cn(
            "grid items-center gap-14 transition-all duration-700 lg:grid-cols-2",
            row1.visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          )}
        >
          <div className="space-y-5">
            <span className="inline-block rounded-full bg-[#1b17ff]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#1b17ff]">
              Dashboard
            </span>
            <h2 className="text-3xl font-bold tracking-tight">
              See your entire operation at a glance
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              Your command center for all things work. The OnitX dashboard surfaces
              exactly what your team needs — active tasks, overdue items, team
              performance, and upcoming deadlines — in a single, stunning view.
            </p>
            <ul className="space-y-3">
              {[
                "Real-time task counts by status",
                "Priority breakdown with visual charts",
                "Overdue & due-today instant alerts",
                "Top assignee performance leaderboard",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1b17ff]/10">
                    <Check className="h-3 w-3 text-[#1b17ff]" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#1b17ff] hover:underline"
            >
              Explore the dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="relative">
            <div className="absolute inset-0 -z-10 scale-90 rounded-3xl bg-[#1b17ff]/12 blur-3xl" />
            <div className="overflow-hidden rounded-2xl border border-border/50 shadow-xl">
              <img
                src={theme === "dark" ? "/dark-dash.png" : "/light-dash.png"}
                alt="OnitX Dashboard Overview"
                className="block w-full"
              />
            </div>
          </div>
        </div>

        {/* Row 2: image left, text right */}
        <div
          ref={row2.ref}
          className={cn(
            "grid items-center gap-14 transition-all duration-700 lg:grid-cols-2",
            row2.visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          )}
        >
          <div className="relative order-2 lg:order-1">
            <div className="absolute inset-0 -z-10 scale-90 rounded-3xl bg-[#1b17ff]/12 blur-3xl" />
            <div className="overflow-hidden rounded-2xl border border-border/50 shadow-xl">
              <img
                src={theme === "dark" ? "/dark-board.png" : "/light-board.png"}
                alt="OnitX Task Board"
                className="block w-full"
              />
            </div>
          </div>

          <div className="order-1 space-y-5 lg:order-2">
            <span className="inline-block rounded-full bg-[#1b17ff]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#1b17ff]">
              Kanban
            </span>
            <h2 className="text-3xl font-bold tracking-tight">
              Switch between powerful views — your way
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              Use the Kanban board for visual workflow management — drag tasks between
              stages effortlessly. Or switch to table view when you need to sort,
              filter, and analyze tasks at scale with full control.
            </p>
            <ul className="space-y-3">
              {[
                "Drag-and-drop Kanban with priority colors",
                "Left-border task cards just like Jira",
                "Filter by status, priority & assignee",
                "Table view with sortable columns",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1b17ff]/10">
                    <Check className="h-3 w-3 text-[#1b17ff]" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#1b17ff] hover:underline"
            >
              Try the Kanban board <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};

// ── CTA ───────────────────────────────────────────────────────────────────────

const CtaSection = () => {
  const { theme } = useTheme();
  const { ref, visible } = useScrollReveal();

  return (
    <section className="px-6 pb-28">
      <div
        ref={ref}
        className={cn(
          "relative mx-auto max-w-4xl overflow-hidden rounded-3xl p-14 text-center transition-all duration-700",
          theme === "dark"
            ? "border border-white/10 bg-gradient-to-br from-zinc-900 to-zinc-950"
            : "bg-gradient-to-br from-[#1b17ff] to-[#0d0b99]",
          visible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        )}
      >
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-white/5 blur-3xl" />

        <div className="relative z-10">
          <p className="mb-4 text-sm font-bold uppercase tracking-widest text-white/60">
            Get started today
          </p>
          <h2 className="text-4xl font-black tracking-tight text-white">
            Ready to transform how
            <br />
            your team works?
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-lg text-white/70">
            Join hundreds of teams already using OnitX to ship faster,
            stay organized, and deliver with confidence — every single day.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-[#1b17ff] transition-all hover:bg-white/90 active:scale-95"
            >
              Get started free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-8 py-3.5 text-base font-semibold text-white transition-colors hover:bg-white/10"
            >
              Sign in to your account
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-white/50">
            {["No credit card required", "Free to start", "Cancel anytime"].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5" /> {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ── Footer ────────────────────────────────────────────────────────────────────

const Footer = () => {
  const { theme } = useTheme();

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <img
            src={theme === "dark" ? "/onitx-white1.png" : "/onitx-black1.png"}
            alt="OnitX"
            className="h-5 w-auto"
          />
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <a href="#features"  className="transition-colors hover:text-foreground">Features</a>
            <a href="#showcase"  className="transition-colors hover:text-foreground">How It Works</a>
            <Link to="/login"    className="transition-colors hover:text-foreground">Sign In</Link>
            <Link to="/register" className="transition-colors hover:text-foreground">Sign Up</Link>
          </div>
          <p className="text-sm text-muted-foreground">© 2025 OnitX. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard", { replace: true });
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <LandingNav />
      <main>
        <HeroSection />
        <FeaturesSection />
        <ShowcaseSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
