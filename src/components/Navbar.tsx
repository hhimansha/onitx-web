import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="border-b">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link to="/dashboard" className="text-lg font-bold">
          OnitX
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            to="/dashboard"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Dashboard
          </Link>
          <Link
            to="/tasks"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Tasks
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
