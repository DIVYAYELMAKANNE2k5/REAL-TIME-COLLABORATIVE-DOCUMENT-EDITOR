import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const { signIn, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // Check for redirect after login (e.g., from shared document link)
      const redirectPath = sessionStorage.getItem("redirect_after_login");
      if (redirectPath) {
        sessionStorage.removeItem("redirect_after_login");
        navigate(redirectPath);
      } else {
        navigate("/dashboard");
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate inputs
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const formattedErrors: { email?: string; password?: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0] === "email") formattedErrors.email = err.message;
        if (err.path[0] === "password") formattedErrors.password = err.message;
      });
      setErrors(formattedErrors);
      return;
    }

    setIsLoading(true);
    const { error } = await signIn(email, password);
    setIsLoading(false);

    if (!error) {
      // Check for redirect after login (e.g., from shared document link)
      const redirectPath = sessionStorage.getItem("redirect_after_login");
      if (redirectPath) {
        sessionStorage.removeItem("redirect_after_login");
        navigate(redirectPath);
      } else {
        navigate("/dashboard");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mx-auto w-full max-w-sm"
        >
          {/* Back Link */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <FileText className="h-5 w-5" />
            </div>
            <span className="text-xl font-semibold text-foreground">DocFlow</span>
          </div>

          {/* Form */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Welcome back
            </h1>
            <p className="text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`h-11 ${errors.email ? "border-destructive" : ""}`}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={`h-11 pr-10 ${errors.password ? "border-destructive" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            <Button type="submit" className="w-full h-11" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-primary font-medium hover:underline"
            >
              Create one
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Panel - Decorative */}
      <div className="hidden lg:flex flex-1 bg-muted/30 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/20" />
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent/30 rounded-full blur-3xl" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative z-10 max-w-lg text-center"
        >
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-card shadow-xl border border-border/50 mb-6">
              <FileText className="h-10 w-10 text-primary" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Collaborate in real-time
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of teams who use DocFlow to write, edit, and share
            documents together.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
