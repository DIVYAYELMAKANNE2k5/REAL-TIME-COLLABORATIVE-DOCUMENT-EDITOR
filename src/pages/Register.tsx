import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, ArrowLeft, Eye, EyeOff, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});
  const { signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate inputs
    const result = registerSchema.safeParse({ name, email, password });
    if (!result.success) {
      const formattedErrors: { name?: string; email?: string; password?: string } = {};
      result.error.errors.forEach((err) => {
        const path = err.path[0] as string;
        formattedErrors[path as keyof typeof formattedErrors] = err.message;
      });
      setErrors(formattedErrors);
      return;
    }

    setIsLoading(true);
    const { error } = await signUp(email, password);
    setIsLoading(false);

    if (!error) {
      navigate("/dashboard");
    }
  };

  const passwordChecks = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Contains a number", met: /\d/.test(password) },
    { label: "Contains a letter", met: /[a-zA-Z]/.test(password) },
  ];

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
              Create your account
            </h1>
            <p className="text-muted-foreground">
              Start collaborating with your team today
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={`h-11 ${errors.name ? "border-destructive" : ""}`}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

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
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
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
              {password && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-1.5 pt-2"
                >
                  {passwordChecks.map((check, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-2 text-xs ${
                        check.met ? "text-success" : "text-muted-foreground"
                      }`}
                    >
                      <Check className={`h-3 w-3 ${check.met ? "opacity-100" : "opacity-30"}`} />
                      {check.label}
                    </div>
                  ))}
                </motion.div>
              )}
            </div>

            <Button type="submit" className="w-full h-11" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            By creating an account, you agree to our{" "}
            <Link to="/" className="underline hover:text-foreground">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/" className="underline hover:text-foreground">
              Privacy Policy
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Panel - Decorative */}
      <div className="hidden lg:flex flex-1 bg-muted/30 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/20" />
        <div className="absolute top-1/3 right-1/3 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-accent/30 rounded-full blur-3xl" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative z-10 max-w-lg"
        >
          <div className="space-y-6">
            {[
              "Unlimited documents",
              "Real-time collaboration",
              "Folder organization",
              "Share with anyone",
            ].map((feature, i) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/10 text-success">
                  <Check className="h-4 w-4" />
                </div>
                <span className="text-lg font-medium text-foreground">
                  {feature}
                </span>
              </motion.div>
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-12 p-6 rounded-2xl bg-card border border-border/50 shadow-lg"
          >
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center text-lg font-semibold text-accent-foreground shrink-0">
                JD
              </div>
              <div>
                <p className="text-foreground font-medium mb-1">
                  "DocFlow transformed how our team works together."
                </p>
                <p className="text-sm text-muted-foreground">
                  Jane Doe, Product Manager at Acme Inc.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
