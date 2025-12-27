import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FileText,
  ArrowLeft,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Image,
  Check,
  Users,
  Lock,
  Eye,
  Edit3,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { useDocument } from "@/hooks/useDocument";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatDistanceToNow } from "date-fns";

const SharedDocument = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const [redirecting, setRedirecting] = useState(false);

  const {
    document,
    title,
    content,
    permission,
    isLoading,
    isSaving,
    lastSaved,
    collaborators,
    error,
    canEdit,
    setTitle,
    setContent,
  } = useDocument({ shareToken: token });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user && !error) {
      setRedirecting(true);
      // Store the intended destination
      sessionStorage.setItem("redirect_after_login", `/shared/${token}`);
      navigate("/login");
    }
  }, [authLoading, user, navigate, token, error]);

  const toolbarButtons = [
    { icon: Bold, label: "Bold" },
    { icon: Italic, label: "Italic" },
    { icon: Underline, label: "Underline" },
    { divider: true },
    { icon: List, label: "Bullet list" },
    { icon: ListOrdered, label: "Numbered list" },
    { divider: true },
    { icon: AlignLeft, label: "Align left" },
    { icon: AlignCenter, label: "Center" },
    { icon: AlignRight, label: "Align right" },
    { divider: true },
    { icon: LinkIcon, label: "Insert link" },
    { icon: Image, label: "Insert image" },
  ];

  // Loading state
  if (authLoading || isLoading || redirecting) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">
            {redirecting ? "Redirecting to login..." : "Loading document..."}
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="mt-4 flex gap-2 justify-center">
            <Button variant="outline" onClick={() => navigate("/")}>
              Go Home
            </Button>
            <Button onClick={() => navigate("/login")}>
              Sign In
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="h-14 border-b border-border px-4 flex items-center justify-between bg-card shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            {canEdit ? (
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Untitled document"
                className="border-0 bg-transparent px-0 text-base font-medium focus-visible:ring-0 w-auto min-w-[200px]"
              />
            ) : (
              <span className="text-base font-medium">{title || "Untitled"}</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Permission Badge */}
          <Badge variant={canEdit ? "default" : "secondary"} className="gap-1">
            {canEdit ? (
              <>
                <Edit3 className="h-3 w-3" />
                Edit Access
              </>
            ) : (
              <>
                <Eye className="h-3 w-3" />
                View Only
              </>
            )}
          </Badge>

          {/* Save Status */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {isSaving ? (
              <span>Saving...</span>
            ) : lastSaved ? (
              <>
                <Check className="h-3 w-3 text-emerald-500" />
                <span>Saved {formatDistanceToNow(lastSaved, { addSuffix: true })}</span>
              </>
            ) : null}
          </div>

          {/* Collaborators */}
          {collaborators.length > 0 && (
            <div className="flex items-center -space-x-2 mr-2">
              {collaborators.slice(0, 4).map((user) => (
                <div
                  key={user.id}
                  className={`h-7 w-7 rounded-full ${user.color} flex items-center justify-center text-xs font-medium text-white border-2 border-card`}
                  title={user.name}
                >
                  {user.name[0].toUpperCase()}
                </div>
              ))}
              {collaborators.length > 4 && (
                <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-xs font-medium border-2 border-card">
                  +{collaborators.length - 4}
                </div>
              )}
            </div>
          )}

          {/* Shared indicator */}
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Lock className="h-4 w-4" />
            <span>Shared</span>
          </div>
        </div>
      </header>

      {/* Toolbar - only show if can edit */}
      {canEdit && (
        <div className="h-12 border-b border-border px-4 flex items-center gap-1 bg-card shrink-0 overflow-x-auto">
          {toolbarButtons.map((item, i) =>
            item.divider ? (
              <div key={i} className="w-px h-6 bg-border mx-1" />
            ) : (
              <Button
                key={i}
                variant="ghost"
                size="icon"
                title={item.label}
                className="shrink-0 h-8 w-8"
              >
                <item.icon className="h-4 w-4" />
              </Button>
            )
          )}
        </div>
      )}

      {/* View-only notice */}
      {!canEdit && (
        <div className="bg-muted/50 border-b border-border px-4 py-2 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Eye className="h-4 w-4" />
          <span>You have view-only access to this document</span>
        </div>
      )}

      {/* Editor */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex-1 flex justify-center overflow-auto py-8 px-4"
      >
        <div className="w-full max-w-3xl">
          {/* Document Title */}
          {canEdit ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Untitled"
              className="w-full text-4xl font-bold text-foreground bg-transparent border-0 outline-none placeholder:text-muted-foreground/50 mb-6"
            />
          ) : (
            <h1 className="w-full text-4xl font-bold text-foreground mb-6">
              {title || "Untitled"}
            </h1>
          )}

          {/* Document Content */}
          {canEdit ? (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing..."
              className="w-full min-h-[60vh] text-lg text-foreground bg-transparent border-0 outline-none resize-none placeholder:text-muted-foreground/50 leading-relaxed"
            />
          ) : (
            <div className="w-full min-h-[60vh] text-lg text-foreground leading-relaxed whitespace-pre-wrap">
              {content || <span className="text-muted-foreground italic">No content yet</span>}
            </div>
          )}
        </div>
      </motion.div>

      {/* Collaboration indicator */}
      {collaborators.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="fixed bottom-4 right-4"
        >
          <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-card border border-border shadow-lg">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {collaborators.length + 1} {canEdit ? "editing" : "viewing"}
            </span>
            <div className="flex -space-x-1">
              {collaborators.slice(0, 3).map((user) => (
                <div
                  key={user.id}
                  className={`h-5 w-5 rounded-full ${user.color} flex items-center justify-center text-xs font-medium text-white border border-card`}
                >
                  {user.name[0].toUpperCase()}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SharedDocument;
