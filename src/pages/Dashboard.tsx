import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FileText,
  FolderOpen,
  Plus,
  Search,
  Clock,
  Users,
  Trash2,
  MoreHorizontal,
  ChevronRight,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data
const mockFolders = [
  { id: "1", name: "Projects", documentCount: 5 },
  { id: "2", name: "Personal", documentCount: 3 },
  { id: "3", name: "Archive", documentCount: 12 },
];

const mockDocuments = [
  {
    id: "1",
    title: "Project Proposal",
    updatedAt: "2 hours ago",
    shared: true,
  },
  {
    id: "2",
    title: "Meeting Notes - Q4 Planning",
    updatedAt: "Yesterday",
    shared: false,
  },
  {
    id: "3",
    title: "Design System Guidelines",
    updatedAt: "3 days ago",
    shared: true,
  },
  {
    id: "4",
    title: "Product Roadmap 2024",
    updatedAt: "1 week ago",
    shared: false,
  },
];

const mockSharedDocuments = [
  {
    id: "5",
    title: "Team Handbook",
    updatedAt: "5 hours ago",
    owner: "Sarah",
  },
  {
    id: "6",
    title: "API Documentation",
    updatedAt: "2 days ago",
    owner: "Mike",
  },
];

type ActiveSection = "my-docs" | "shared" | "recent" | "trash";

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState<ActiveSection>("my-docs");
  const [searchQuery, setSearchQuery] = useState("");

  const sidebarItems = [
    { id: "my-docs" as const, label: "My Documents", icon: FileText },
    { id: "shared" as const, label: "Shared with me", icon: Users },
    { id: "recent" as const, label: "Recent", icon: Clock },
    { id: "trash" as const, label: "Trash", icon: Trash2 },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-sidebar-border bg-sidebar flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <FileText className="h-5 w-5" />
            </div>
            <span className="text-lg font-semibold text-sidebar-foreground">
              DocFlow
            </span>
          </Link>
        </div>

        {/* New Document Button */}
        <div className="p-4">
          <Button className="w-full justify-start gap-2" asChild>
            <Link to="/editor/new">
              <Plus className="h-4 w-4" />
              New Document
            </Link>
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeSection === item.id
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}

          {/* Folders Section */}
          <div className="pt-6">
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-xs font-medium text-sidebar-foreground/40 uppercase tracking-wider">
                Folders
              </span>
              <Button variant="ghost" size="icon-sm" className="h-6 w-6">
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <div className="space-y-1">
              {mockFolders.map((folder) => (
                <button
                  key={folder.id}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
                >
                  <FolderOpen className="h-4 w-4" />
                  <span className="flex-1 text-left truncate">{folder.name}</span>
                  <span className="text-xs text-sidebar-foreground/40">
                    {folder.documentCount}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* User Menu */}
        <div className="p-4 border-t border-sidebar-border">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-accent/50 transition-colors">
                <div className="h-8 w-8 rounded-full bg-sidebar-accent flex items-center justify-center text-sm font-medium text-sidebar-accent-foreground">
                  JD
                </div>
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium text-sidebar-foreground">
                    John Doe
                  </div>
                  <div className="text-xs text-sidebar-foreground/50">
                    john@example.com
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-sidebar-foreground/40" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>
                <User className="h-4 w-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-border px-6 flex items-center justify-between bg-card">
          <h1 className="text-xl font-semibold text-foreground">
            {activeSection === "my-docs" && "My Documents"}
            {activeSection === "shared" && "Shared with me"}
            {activeSection === "recent" && "Recent"}
            {activeSection === "trash" && "Trash"}
          </h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-9"
              />
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-6 overflow-auto">
          {activeSection === "my-docs" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* Quick Actions */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <Button
                  variant="outline"
                  className="h-auto py-6 flex-col gap-2"
                  asChild
                >
                  <Link to="/editor/new">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <span>New Document</span>
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-6 flex-col gap-2"
                >
                  <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                    <FolderOpen className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <span>New Folder</span>
                </Button>
              </div>

              {/* Documents Grid */}
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Recent Documents
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {mockDocuments.map((doc, i) => (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                    >
                      <Link
                        to={`/editor/${doc.id}`}
                        className="block p-4 rounded-xl border border-border bg-card hover:shadow-md hover:border-primary/20 transition-all group"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                            <FileText className="h-5 w-5 text-accent-foreground group-hover:text-primary transition-colors" />
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => e.preventDefault()}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Share</DropdownMenuItem>
                              <DropdownMenuItem>Rename</DropdownMenuItem>
                              <DropdownMenuItem>Move to folder</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <h3 className="font-medium text-foreground mb-1 truncate">
                          {doc.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{doc.updatedAt}</span>
                          {doc.shared && (
                            <>
                              <span>•</span>
                              <Users className="h-3 w-3" />
                            </>
                          )}
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === "shared" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {mockSharedDocuments.map((doc, i) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    <Link
                      to={`/editor/${doc.id}`}
                      className="block p-4 rounded-xl border border-border bg-card hover:shadow-md hover:border-primary/20 transition-all group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                          <FileText className="h-5 w-5 text-accent-foreground" />
                        </div>
                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                          {doc.owner[0]}
                        </div>
                      </div>
                      <h3 className="font-medium text-foreground mb-1 truncate">
                        {doc.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>by {doc.owner}</span>
                        <span>•</span>
                        <span>{doc.updatedAt}</span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeSection === "recent" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-center py-16"
            >
              <Clock className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Recently viewed documents
              </h3>
              <p className="text-muted-foreground">
                Documents you've opened recently will appear here
              </p>
            </motion.div>
          )}

          {activeSection === "trash" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-center py-16"
            >
              <Trash2 className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Trash is empty
              </h3>
              <p className="text-muted-foreground">
                Deleted documents will appear here for 30 days
              </p>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
