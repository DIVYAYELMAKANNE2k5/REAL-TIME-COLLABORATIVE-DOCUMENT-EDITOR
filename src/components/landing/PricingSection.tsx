import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for individuals just getting started",
    features: [
      "Up to 5 documents",
      "Basic collaboration",
      "1 GB storage",
      "Email support",
      "Mobile access",
    ],
    cta: "Get started",
    variant: "outline" as const,
    popular: false,
  },
  {
    name: "Pro",
    price: "$12",
    period: "per month",
    description: "For professionals who need more power",
    features: [
      "Unlimited documents",
      "Real-time collaboration",
      "25 GB storage",
      "Priority support",
      "Version history",
      "Custom branding",
      "Advanced analytics",
    ],
    cta: "Start free trial",
    variant: "hero" as const,
    popular: true,
  },
  {
    name: "Team",
    price: "$29",
    period: "per user/month",
    description: "For teams that need to work together",
    features: [
      "Everything in Pro",
      "Unlimited storage",
      "Admin controls",
      "Team workspaces",
      "SSO integration",
      "API access",
      "Dedicated support",
    ],
    cta: "Contact sales",
    variant: "outline" as const,
    popular: false,
  },
];

export const PricingSection = () => {
  return (
    <section id="pricing" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that's right for you. All plans include a 14-day free trial.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative p-6 sm:p-8 rounded-2xl bg-card border transition-all duration-300 ${
                plan.popular
                  ? "border-primary shadow-lg shadow-primary/10 scale-100 lg:scale-105"
                  : "border-border/50 hover:shadow-lg hover:border-primary/20"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 text-xs font-semibold bg-primary text-primary-foreground rounded-full">
                    Most popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {plan.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {plan.description}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-foreground">
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.variant}
                size="lg"
                className="w-full"
                asChild
              >
                <Link to="/register">{plan.cta}</Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
