import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Search, Briefcase, Code, BookOpen, Building, Sun, Moon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { cn } from "../../lib/utils";
import { useTheme } from "../../context/ThemeProvider";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  const navigation = [
    { name: "FIND JOBS", href: "/jobs", icon: <Search className="h-4 w-4 mr-2" /> },
    { name: "MY APPLICATIONS", href: "/applications", icon: <Briefcase className="h-4 w-4 mr-2" /> },
    { name: "ALGORITHM CHALLENGES", href: "/challenges", icon: <Code className="h-4 w-4 mr-2" /> },
    { name: "LEARNING RESOURCES", href: "/resources", icon: <BookOpen className="h-4 w-4 mr-2" /> },
    { name: "COMPANIES", href: "/companies", icon: <Building className="h-4 w-4 mr-2" /> }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-300 bg-white shadow-md dark:bg-gray-900 dark:border-gray-700">
      <div className="container mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <div className="mr-2">
            <img className="w-12 h-12 object-contain" src="/logo.png" alt="Logo" />
          </div>
          <span className="text-lg font-semibold text-gray-800 dark:text-gray-200 tracking-wide">Algo<span className="text-gray-500 dark:text-gray-400">Space</span></span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={cn(
                "text-sm font-medium flex items-center px-3 py-2 rounded-md transition-all",
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

        {/* Right Side buttons */}
        <div className="hidden md:flex flex-row-reverse items-center gap-4">
          <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="p-2 rounded-md text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 transition">
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <Link to="/login">
            <Button variant="outline" size="sm" className="border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800">
              Log in
            </Button>
          </Link>
          <Link to="/signup">
            <Button size="sm" className="bg-gray-700 dark:bg-gray-800 hover:bg-gray-600 dark:hover:bg-gray-700 text-white">
              Sign Up
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
          className="md:hidden p-2 rounded-md text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 transition"
        >
          {isMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x">
              <path d="M18 6 6 18"/>
              <path d="m6 6 12 12"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu">
              <line x1="4" x2="20" y1="12" y2="12"/>
              <line x1="4" x2="20" y1="6" y2="6"/>
              <line x1="4" x2="20" y1="18" y2="18"/>
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}

export default Header;
