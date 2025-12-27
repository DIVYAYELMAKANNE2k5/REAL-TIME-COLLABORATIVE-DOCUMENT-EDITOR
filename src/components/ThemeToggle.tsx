import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import { motion, AnimatePresence } from "framer-motion";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative h-9 w-9"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === "light" ? (
          <motion.div
            key="sun"
            initial={{ rotate: -90, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            exit={{ rotate: 90, scale: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Sun className="h-[1.2rem] w-[1.2rem]" />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ rotate: 90, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            exit={{ rotate: -90, scale: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Moon className="h-[1.2rem] w-[1.2rem]" />
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  );
};
