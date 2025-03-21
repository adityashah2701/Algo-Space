import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Search, Briefcase, Code, BookOpen, Building, Sun, Moon, X, Menu } from "lucide-react";
import { Button } from "../../components/ui/button";
import { cn } from "../../lib/utils";
import { useTheme } from "../../context/ThemeProvider";
import { useAuthStore } from "@/Store/useAuthStore";
import LanguageSelector from "@/pages/LanguageSelector";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const user = JSON.parse(localStorage.getItem('user'));
  const navigation = [
    { name: "FIND JOBS", href: "/jobs", icon: <Search className="h-4 w-4 mr-2" /> },
    { name: "ALGORITHM CHALLENGES", href: "/algo-challenge", icon: <Code className="h-4 w-4 mr-2" /> },
    { name: "LEARNING RESOURCES", href: "/resources", icon: <BookOpen className="h-4 w-4 mr-2" /> },
  ];

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-300 bg-white shadow-md dark:bg-gray-900 dark:border-gray-700">
      <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center shrink-0">
          <div className="mr-2">
            <img className="w-10 h-10 object-contain" src="/logo.png" alt="Logo" />
          </div>
          <span className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 tracking-wide">
            Algo<span className="text-gray-500 dark:text-gray-400">Space</span>
          </span>
        </Link>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center md:hidden">
          {/* LanguageSelector for Mobile */}
          <div className="mr-2 flex items-center">
            <LanguageSelector className="block h-8 w-20 text-xs" />
          </div>

          {/* Theme Toggle for Mobile */}
          <button 
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")} 
            className="p-2 mr-2 rounded-md text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 transition"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="p-2 rounded-md text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 transition"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-white dark:bg-gray-900 shadow-lg">
            <nav className="flex flex-col divide-y divide-gray-200 dark:divide-gray-700">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "text-sm font-medium flex items-center px-4 py-3 transition-all",
                    location.pathname === item.href 
                      ? "text-gray-900 bg-gray-100 dark:text-gray-100 dark:bg-gray-800" 
                      : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  )}
                >
                  {item.icon}
                  {item.name}
                </NavLink>
              ))}
              <div className="flex flex-col p-4 space-y-2">
                {user ? (
                  <Link to={user.role === "interviewer" ? "/interviewer-dashboard" : "/candidate-dashboard"} className="w-full">
                    <Button variant="outline" className="w-full border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800">
                      DashBoard
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/login" className="w-full">
                      <Button variant="outline" className="w-full border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800">
                        Log in
                      </Button>
                    </Link>
                    <Link to="/register" className="w-full">
                      <Button className="w-full bg-gray-700 dark:bg-gray-800 hover:bg-gray-600 dark:hover:bg-gray-700 text-white">
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 flex-grow justify-center">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={cn(
                "text-xs flex items-center px-3 py-2 rounded-md transition-all",
                location.pathname === item.href 
                  ? "text-gray-900 bg-gray-200 dark:text-gray-100 dark:bg-gray-800" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-200 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-800"
              )}
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Desktop Right Side buttons */}
        <div className="hidden md:flex items-center gap-4">
          {/* LanguageSelector for Desktop */}
          <LanguageSelector className="block h-8 w-24 border border-gray-300 dark:border-gray-700 rounded-md" />
          
          <button 
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")} 
            className="p-2 rounded-md text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 transition"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          {user ? (
            <Link to={user.role === "interviewer" ? "/interviewer-dashboard" : "/candidate-dashboard"}>
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800">
                Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" size="sm" className="border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800">
                  Log in
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="bg-gray-700 dark:bg-gray-800 hover:bg-gray-600 dark:hover:bg-gray-700 text-white">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;