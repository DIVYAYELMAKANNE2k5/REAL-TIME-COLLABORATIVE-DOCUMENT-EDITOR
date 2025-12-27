import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
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
  MoreHorizontal,
  Check,
  Users,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useDocument } from "@/hooks/useDocument";
import { ShareDialog } from "@/components/editor/ShareDialog";

const Editor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  
  const {
    document,
    title,
    content,
    collaborators,
    isLoading,
    isSaving,
    lastSaved,
    isOwner,
    setTitle,
    setContent,
    saveDocument,
  } = useDocument({ documentId: id });

  const [newDocId, setNewDocId] = useState<string | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  // Handle creating new document when user starts typing
  const handleTitleChange = async (newTitle: string) => {
    setTitle(newTitle);
    
    if (id === "new" && !document && newTitle.trim()) {
      const docId = await saveDocument(newTitle, content);
      if (docId && docId !== "new") {
        setNewDocId(docId);
        navigate(`/editor/${docId}`, { replace: true });
      }
    }
  };

  const handleContentChange = async (newContent: string) => {
    setContent(newContent);
    
    if (id === "new" && !document && newContent.trim()) {
      const docId = await saveDocument(title || "Untitled", newContent);
      if (docId && docId !== "new") {
        setNewDocId(docId);
        navigate(`/editor/${docId}`, { replace: true });
      }
    }
  };

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

  const formatLastSaved = (date: Date | null) => {
    if (!date) return null;
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    
    if (diffSeconds < 60) return "Just now";
    if (diffSeconds < 120) return "1 minute ago";
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)} minutes ago`;
    return date.toLocaleTimeString();
  };

  if (authLoading || (isLoading && id !== "new")) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const documentId = newDocId || (id !== "new" ? id : undefined);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="h-14 border-b border-border px-4 flex items-center justify-between bg-card shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon-sm" asChild>
            <Link to="/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <Input
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Untitled document"
              className="border-0 bg-transparent px-0 text-base font-medium focus-visible:ring-0 w-auto min-w-[200px]"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Save Status */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {isSaving ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Saving...</span>
              </>
            ) : lastSaved ? (
              <>
                <Check className="h-3 w-3 text-success" />
                <span>Saved {formatLastSaved(lastSaved)}</span>
              </>
            ) : null}
          </div>

          {/* Collaborators */}
          {collaborators.length > 0 && (
            <div className="flex items-center -space-x-2 mr-2">
              {collaborators.map((collab) => (
                <div
                  key={collab.id}
                  className={`h-7 w-7 rounded-full ${collab.color} flex items-center justify-center text-xs font-medium text-primary-foreground border-2 border-card`}
                  title={collab.name}
                >
                  {collab.name?.[0]?.toUpperCase() || "?"}
                </div>
              ))}
            </div>
          )}

          {/* Share Button */}
          <ShareDialog 
            documentId={documentId} 
            documentTitle={title || "Untitled"} 
            isOwner={isOwner} 
          />

          <Button variant="ghost" size="icon-sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Toolbar */}
      <div className="h-12 border-b border-border px-4 flex items-center gap-1 bg-card shrink-0 overflow-x-auto">
        {toolbarButtons.map((item, i) =>
          item.divider ? (
            <div
              key={i}
              className="w-px h-6 bg-border mx-1"
            />
          ) : (
            <Button
              key={i}
              variant="ghost"
              size="icon-sm"
              title={item.label}
              className="shrink-0"
            >
              <item.icon className="h-4 w-4" />
            </Button>
          )
        )}
      </div>

      {/* Editor */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex-1 flex justify-center overflow-auto py-8 px-4"
      >
        <div className="w-full max-w-3xl">
          {/* Document Title */}
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Untitled"
            className="w-full text-4xl font-bold text-foreground bg-transparent border-0 outline-none placeholder:text-muted-foreground/50 mb-6"
          />

          {/* Document Content */}
          <textarea
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder="Start writing..."
            className="w-full min-h-[60vh] text-lg text-foreground bg-transparent border-0 outline-none resize-none placeholder:text-muted-foreground/50 leading-relaxed"
          />
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
              {collaborators.length + 1} editing
            </span>
            <div className="flex -space-x-1">
              {collaborators.slice(0, 3).map((collab) => (
                <div
                  key={collab.id}
                  className={`h-5 w-5 rounded-full ${collab.color} flex items-center justify-center text-xs font-medium text-primary-foreground border border-card`}
                >
                  {collab.name?.[0]?.toUpperCase() || "?"}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Editor;
