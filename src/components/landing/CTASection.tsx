import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Ready to transform how your team works?
          </h2>
          <p className="text-lg text-muted-foreground mb-10">
            Join thousands of teams who have already made the switch. Start
            collaborating in real-time today—no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="hero" size="xl" asChild>
              <Link to="/register">
                Get started for free
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <Link to="/login">Sign in to your account</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
