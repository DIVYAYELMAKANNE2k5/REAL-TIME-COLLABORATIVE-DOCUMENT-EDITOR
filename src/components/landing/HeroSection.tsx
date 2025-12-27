import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Play, Users, FileText, Zap } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/30 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,hsl(var(--background))_70%)]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-8"
          >
            <Zap className="h-4 w-4" />
            Real-time collaboration made simple
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6"
          >
            Write, collaborate, and{" "}
            <span className="bg-gradient-to-r from-primary to-[hsl(250_100%_60%)] bg-clip-text text-transparent">
              create together
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
          >
            The modern document editor that brings your team together. Edit in
            real-time, organize with folders, and share with anyone—all in one
            beautiful workspace.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Button variant="hero" size="xl" asChild>
              <Link to="/register">
                Start for free
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
            <Button variant="hero-outline" size="xl">
              <Play className="h-4 w-4 mr-1" />
              Watch demo
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-8 sm:gap-12"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                <Users className="h-5 w-5 text-accent-foreground" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-foreground">10k+</div>
                <div className="text-sm text-muted-foreground">Active users</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                <FileText className="h-5 w-5 text-accent-foreground" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-foreground">50k+</div>
                <div className="text-sm text-muted-foreground">Documents created</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                <Zap className="h-5 w-5 text-accent-foreground" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-foreground">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Product Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-20 max-w-5xl mx-auto"
        >
          <div className="relative rounded-2xl border border-border/50 bg-card shadow-xl overflow-hidden">
            {/* Browser Chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-muted/30">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-warning/60" />
                <div className="w-3 h-3 rounded-full bg-success/60" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-4 py-1 rounded-md bg-background text-xs text-muted-foreground">
                  docflow.app/dashboard
                </div>
              </div>
            </div>
            
            {/* Preview Content */}
            <div className="flex h-[400px] sm:h-[500px]">
              {/* Sidebar */}
              <div className="hidden sm:flex flex-col w-64 border-r border-border/50 bg-sidebar p-4">
                <div className="flex items-center gap-2 mb-6">
                  <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                    <FileText className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <span className="font-semibold text-sidebar-foreground">DocFlow</span>
                </div>
                <div className="space-y-1">
                  <div className="px-3 py-2 rounded-lg bg-sidebar-accent text-sidebar-accent-foreground text-sm font-medium">
                    My Documents
                  </div>
                  <div className="px-3 py-2 text-sidebar-foreground/60 text-sm">
                    Shared with me
                  </div>
                  <div className="px-3 py-2 text-sidebar-foreground/60 text-sm">
                    Recent
                  </div>
                  <div className="px-3 py-2 text-sidebar-foreground/60 text-sm">
                    Trash
                  </div>
                </div>
                <div className="mt-6">
                  <div className="text-xs font-medium text-sidebar-foreground/40 uppercase tracking-wider mb-2 px-3">
                    Folders
                  </div>
                  <div className="space-y-1">
                    <div className="px-3 py-2 text-sidebar-foreground/60 text-sm flex items-center gap-2">
                      📁 Projects
                    </div>
                    <div className="px-3 py-2 text-sidebar-foreground/60 text-sm flex items-center gap-2">
                      📁 Personal
                    </div>
                    <div className="px-3 py-2 text-sidebar-foreground/60 text-sm flex items-center gap-2">
                      📁 Archive
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Main Content */}
              <div className="flex-1 p-6 bg-background">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-foreground">My Documents</h2>
                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium">
                      + New
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { title: "Project Proposal", updated: "2 hours ago" },
                    { title: "Meeting Notes", updated: "Yesterday" },
                    { title: "Design System", updated: "3 days ago" },
                  ].map((doc, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl border border-border/50 bg-card hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center shrink-0">
                          <FileText className="h-5 w-5 text-accent-foreground" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-medium text-foreground truncate">{doc.title}</h3>
                          <p className="text-sm text-muted-foreground">{doc.updated}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
