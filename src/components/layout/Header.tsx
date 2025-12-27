import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm group-hover:shadow-md transition-shadow">
              <FileText className="h-5 w-5" />
            </div>
            <span className="text-lg font-semibold text-foreground">
              DocFlow
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => scrollToSection("features")}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("pricing")}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </button>
          </nav>

          {/* Desktop Auth Buttons & Theme Toggle */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <Button variant="ghost" asChild>
              <Link to="/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link to="/register">Get Started</Link>
            </Button>
          </div>

          {/* Mobile Menu Button & Theme Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-border/50 py-4 overflow-hidden"
            >
              <nav className="flex flex-col gap-2">
                <button
                  onClick={() => scrollToSection("features")}
                  className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors text-left"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection("pricing")}
                  className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors text-left"
                >
                  Pricing
                </button>
                <button
                  onClick={() => scrollToSection("about")}
                  className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors text-left"
                >
                  About
                </button>
                <div className="flex flex-col gap-2 px-4 pt-4 border-t border-border/50 mt-2">
                  <Button variant="outline" asChild className="w-full">
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Sign in</Link>
                  </Button>
                  <Button asChild className="w-full">
                    <Link to="/register" onClick={() => setMobileMenuOpen(false)}>Get Started</Link>
                  </Button>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};
