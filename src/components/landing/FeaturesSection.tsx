import { motion } from "framer-motion";
import { 
  Users, 
  FolderOpen, 
  Lock, 
  Zap, 
  History, 
  Share2 
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Real-time collaboration",
    description:
      "Work together with your team in real-time. See changes as they happen with live cursors and instant sync.",
  },
  {
    icon: FolderOpen,
    title: "Folder organization",
    description:
      "Keep your documents organized with a powerful folder system. Create nested folders and move files easily.",
  },
  {
    icon: Share2,
    title: "Easy sharing",
    description:
      "Share documents with anyone. Set view or edit permissions and collaborate with external partners.",
  },
  {
    icon: Lock,
    title: "Secure by design",
    description:
      "Enterprise-grade security with role-based access control. Your documents are encrypted and protected.",
  },
  {
    icon: History,
    title: "Version history",
    description:
      "Never lose your work. Access complete version history and restore any previous version instantly.",
  },
  {
    icon: Zap,
    title: "Lightning fast",
    description:
      "Built for speed. Documents load instantly and sync in milliseconds, no matter where you are.",
  },
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Everything you need to collaborate
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful features that make document collaboration a breeze. Focus on
            writing, we'll handle the rest.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group p-6 rounded-2xl bg-card border border-border/50 hover:shadow-lg hover:border-primary/20 transition-all duration-300"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent group-hover:bg-primary/10 transition-colors mb-4">
                <feature.icon className="h-6 w-6 text-accent-foreground group-hover:text-primary transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
