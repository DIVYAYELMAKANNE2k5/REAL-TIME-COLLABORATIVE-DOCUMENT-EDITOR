import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

interface Document {
  id: string;
  title: string;
  content: string | null;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

interface Collaborator {
  id: string;
  name: string;
  color: string;
  cursor_position?: number;
}

interface UseDocumentOptions {
  documentId?: string;
  shareToken?: string;
}

interface TokenDocumentResult {
  id: string;
  title: string;
  content: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
  permission: string;
}

const COLORS = [
  "bg-primary",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-violet-500",
  "bg-cyan-500",
];

export function useDocument({ documentId, shareToken }: UseDocumentOptions) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [document, setDocument] = useState<Document | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [permission, setPermission] = useState<"view" | "edit" | "owner">("view");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load document
  const loadDocument = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (shareToken) {
        // Load via share token using raw SQL call
        const { data, error } = await (supabase as any).rpc("get_document_by_token", {
          p_token: shareToken,
        });

        if (error) throw error;
        const results = data as TokenDocumentResult[] | null;
        if (!results || results.length === 0) {
          setError("This share link is invalid or has expired.");
          return;
        }

        const doc = results[0];
        setDocument({
          id: doc.id,
          title: doc.title,
          content: doc.content,
          owner_id: doc.owner_id,
          created_at: doc.created_at,
          updated_at: doc.updated_at,
        });
        setTitle(doc.title || "");
        setContent(doc.content || "");
        setPermission(doc.permission as "view" | "edit");
      } else if (documentId && documentId !== "new") {
        // Load as owner or shared user
        const { data, error } = await supabase
          .from("documents")
          .select("*")
          .eq("id", documentId)
          .maybeSingle();

        if (error) throw error;
        if (!data) {
          setError("Document not found.");
          return;
        }

        setDocument(data);
        setTitle(data.title || "");
        setContent(data.content || "");
        setPermission(data.owner_id === user?.id ? "owner" : "edit");
      } else if (documentId === "new") {
        // New document
        setDocument(null);
        setTitle("");
        setContent("");
        setPermission("owner");
      }
    } catch (err: any) {
      console.error("Error loading document:", err);
      setError(err.message || "Failed to load document");
    } finally {
      setIsLoading(false);
    }
  }, [documentId, shareToken, user?.id]);

  // Save document
  const saveDocument = useCallback(async (newTitle?: string, newContent?: string) => {
    const titleToSave = newTitle ?? title;
    const contentToSave = newContent ?? content;

    if (!documentId && !shareToken) return null;

    setIsSaving(true);

    try {
      if (shareToken) {
        // Save via share token (for shared access)
        const { data, error } = await (supabase as any).rpc("update_document_by_token", {
          p_token: shareToken,
          p_title: titleToSave,
          p_content: contentToSave,
        });

        if (error) throw error;
        if (!data) {
          toast({
            title: "Cannot save",
            description: "You don't have edit permission for this document.",
            variant: "destructive",
          });
          return null;
        }
      } else if (documentId === "new") {
        // Create new document
        if (!user) {
          toast({
            title: "Not logged in",
            description: "Please log in to create a document.",
            variant: "destructive",
          });
          return null;
        }

        const { data, error } = await supabase
          .from("documents")
          .insert({
            title: titleToSave || "Untitled",
            content: contentToSave,
            owner_id: user.id,
          })
          .select()
          .single();

        if (error) throw error;
        setDocument(data);
        return data.id;
      } else if (documentId) {
        // Update existing document
        const { error } = await supabase
          .from("documents")
          .update({
            title: titleToSave,
            content: contentToSave,
          })
          .eq("id", documentId);

        if (error) throw error;
      }

      setLastSaved(new Date());
      return documentId;
    } catch (err: any) {
      console.error("Error saving document:", err);
      toast({
        title: "Save failed",
        description: err.message || "Failed to save document",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [documentId, shareToken, title, content, user, toast]);

  // Auto-save with debounce
  const autoSave = useCallback((newTitle: string, newContent: string) => {
    if (permission === "view") return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveDocument(newTitle, newContent);
    }, 1000);
  }, [permission, saveDocument]);

  // Handle title change
  const handleTitleChange = useCallback((newTitle: string) => {
    setTitle(newTitle);
    autoSave(newTitle, content);
  }, [content, autoSave]);

  // Handle content change
  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
    autoSave(title, newContent);
  }, [title, autoSave]);

  // Setup realtime subscription
  useEffect(() => {
    const docId = document?.id || (documentId !== "new" ? documentId : null);
    if (!docId) return;

    // Subscribe to document changes
    channelRef.current = supabase
      .channel(`document:${docId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "documents",
          filter: `id=eq.${docId}`,
        },
        (payload) => {
          const newData = payload.new as Document;
          // Only update if changes came from someone else
          if (newData.updated_at !== document?.updated_at) {
            setDocument(newData);
            // Don't overwrite local changes if user is actively editing
            if (!isSaving) {
              setTitle(newData.title || "");
              setContent(newData.content || "");
            }
          }
        }
      )
      .subscribe();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [document?.id, documentId, document?.updated_at, isSaving]);

  // Setup presence for collaborators
  useEffect(() => {
    const docId = document?.id || (documentId !== "new" ? documentId : null);
    if (!docId || !user) return;

    const presenceChannel = supabase.channel(`presence:${docId}`);

    presenceChannel
      .on("presence", { event: "sync" }, () => {
        const state = presenceChannel.presenceState();
        const users: Collaborator[] = [];
        
        Object.values(state).forEach((presences: any) => {
          presences.forEach((presence: any) => {
            if (presence.user_id !== user.id) {
              users.push({
                id: presence.user_id,
                name: presence.name || "Anonymous",
                color: presence.color || COLORS[users.length % COLORS.length],
              });
            }
          });
        });
        
        setCollaborators(users);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await presenceChannel.track({
            user_id: user.id,
            name: user.email?.split("@")[0] || "Anonymous",
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      supabase.removeChannel(presenceChannel);
    };
  }, [document?.id, documentId, user]);

  // Load document on mount
  useEffect(() => {
    loadDocument();
  }, [loadDocument]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    document,
    title,
    content,
    permission,
    isLoading,
    isSaving,
    lastSaved,
    collaborators,
    error,
    canEdit: permission === "edit" || permission === "owner",
    isOwner: permission === "owner",
    setTitle: handleTitleChange,
    setContent: handleContentChange,
    saveDocument,
    reload: loadDocument,
  };
}
