import { Link, useLocation } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role") ? String(localStorage.getItem("role")).trim() : null;

  console.log("User Role (Type):", typeof role, "Value:", `'${role}'`);

  const getDashboardPath = () => {
    if (role === "admin") return "/dashboard-admin";
    if (role === "owner") return "/dashboard-owner";
    return "/dashboard";
  };
  console.log("Dashboard Path:", getDashboardPath());

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/ruko", label: "Ruko" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white backdrop-blur-sm border-b border-border shadow-soft w-full">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
          >
            <img
              src="/logo.png"
              alt="RukoSpace Logo"
              className="h-12 w-12 object-contain transition-transform group-hover:scale-110"
            />
            <span className="text-lg sm:text-xl font-bold text-secondary">RukoSpace</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${isActive(link.path) ? "text-primary" : "text-secondary"}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {token ? (
              <>
                <Link to={getDashboardPath()}>
                  <Button className="bg-primary hover:bg-primary/90 text-white">Dashboard</Button>
                </Link>
                <Button
                  variant="ghost"
                  onClick={() => {
                    localStorage.clear();
                    window.location.reload();
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    variant="ghost"
                    className="text-secondary"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-primary hover:bg-primary/90 text-white shadow-soft">Register</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-secondary hover:text-primary transition-colors"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-200 overflow-hidden ${isMenuOpen ? "max-h-[350px] opacity-100 py-4" : "max-h-0 opacity-0"}`}>
          <div className="flex flex-col gap-4 text-sm">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`font-medium transition-colors hover:text-primary ${isActive(link.path) ? "text-primary" : "text-secondary"}`}
              >
                {link.label}
              </Link>
            ))}

            <div className="flex flex-col gap-2 pt-3 border-t border-border">
              {token ? (
                <>
                  <Link
                    to={getDashboardPath()}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white">Dashboard</Button>
                  </Link>
                  <Button
                    variant="ghost"
                    className="w-full text-secondary hover:text-primary"
                    onClick={() => {
                      localStorage.clear();
                      window.location.reload();
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button
                      variant="ghost"
                      className="w-full text-secondary hover:text-primary"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white">Register</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
