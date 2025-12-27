import { motion } from "framer-motion";
import { Users, Target, Heart, Sparkles } from "lucide-react";

const values = [
  {
    icon: Users,
    title: "Team First",
    description:
      "We believe great work happens when teams collaborate seamlessly. Every feature we build is designed with teamwork in mind.",
  },
  {
    icon: Target,
    title: "User Focused",
    description:
      "Our users are at the heart of everything we do. We listen, learn, and continuously improve based on your feedback.",
  },
  {
    icon: Heart,
    title: "Built with Care",
    description:
      "We obsess over the details. From smooth animations to intuitive workflows, we craft experiences you'll love.",
  },
  {
    icon: Sparkles,
    title: "Always Innovating",
    description:
      "We're constantly pushing boundaries to bring you cutting-edge features that make document collaboration effortless.",
  },
];

const stats = [
  { value: "10K+", label: "Active users" },
  { value: "50K+", label: "Documents created" },
  { value: "99.9%", label: "Uptime" },
  { value: "24/7", label: "Support" },
];

export const AboutSection = () => {
  return (
    <section id="about" className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            About DocFlow
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            We're on a mission to make document collaboration as seamless as having a conversation. 
            Founded in 2024, DocFlow is trusted by thousands of teams worldwide to create, 
            collaborate, and share their best work.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
              className="text-center p-6 rounded-2xl bg-card border border-border/50"
            >
              <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Our Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mb-12"
        >
          <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
            Our Values
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            These core values guide everything we do at DocFlow.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="group p-6 rounded-2xl bg-card border border-border/50 hover:shadow-lg hover:border-primary/20 transition-all duration-300 text-center"
            >
              <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-xl bg-accent group-hover:bg-primary/10 transition-colors mb-4">
                <value.icon className="h-6 w-6 text-accent-foreground group-hover:text-primary transition-colors" />
              </div>
              <h4 className="text-lg font-semibold text-foreground mb-2">
                {value.title}
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-20 text-center p-8 sm:p-12 rounded-2xl bg-gradient-to-br from-primary/5 via-background to-accent/20 border border-border/50"
        >
          <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
            Our Mission
          </h3>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            To empower teams around the world to communicate and collaborate more effectively 
            through beautiful, intuitive document tools. We believe that when teams can work 
            together seamlessly, they can achieve extraordinary things.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
