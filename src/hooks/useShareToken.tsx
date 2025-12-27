import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";

interface ShareToken {
  id: string;
  token: string;
  permission: "view" | "edit";
  created_at: string;
  expires_at: string | null;
  is_active: boolean;
  access_count: number;
}

export function useShareToken(documentId: string | undefined) {
  const { toast } = useToast();
  const [shareTokens, setShareTokens] = useState<ShareToken[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);

  // Generate a secure random token
  const generateToken = () => {
    const array = new Uint8Array(24);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
  };

  // Load existing share tokens
  const loadShareTokens = useCallback(async () => {
    if (!documentId || documentId === "new") return;

    setIsLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from("share_tokens")
        .select("*")
        .eq("document_id", documentId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setShareTokens((data || []) as ShareToken[]);
    } catch (err: any) {
      console.error("Error loading share tokens:", err);
    } finally {
      setIsLoading(false);
    }
  }, [documentId]);

  // Create a new share link
  const createShareLink = useCallback(async (
    permission: "view" | "edit",
    expiresInDays?: number
  ) => {
    if (!documentId || documentId === "new") {
      toast({
        title: "Cannot share",
        description: "Please save the document first.",
        variant: "destructive",
      });
      return null;
    }

    setIsLoading(true);
    try {
      const token = generateToken();
      const expiresAt = expiresInDays
        ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000).toISOString()
        : null;

      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error("Not authenticated");
      }

      const { data, error } = await (supabase as any)
        .from("share_tokens")
        .insert({
          document_id: documentId,
          token,
          permission,
          expires_at: expiresAt,
          created_by: userData.user.id,
        })
        .select()
        .single();

      if (error) throw error;

      const shareUrl = `${window.location.origin}/shared/${token}`;
      setGeneratedLink(shareUrl);
      setShareTokens((prev) => [data as ShareToken, ...prev]);

      toast({
        title: "Link created",
        description: "Share link has been created successfully.",
      });

      return shareUrl;
    } catch (err: any) {
      console.error("Error creating share link:", err);
      toast({
        title: "Failed to create link",
        description: err.message || "Something went wrong",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [documentId, toast]);

  // Revoke a share link
  const revokeShareLink = useCallback(async (tokenId: string) => {
    setIsLoading(true);
    try {
      const { error } = await (supabase as any)
        .from("share_tokens")
        .update({ is_active: false })
        .eq("id", tokenId);

      if (error) throw error;

      setShareTokens((prev) =>
        prev.map((t) => (t.id === tokenId ? { ...t, is_active: false } : t))
      );

      toast({
        title: "Link revoked",
        description: "The share link has been deactivated.",
      });
    } catch (err: any) {
      console.error("Error revoking share link:", err);
      toast({
        title: "Failed to revoke",
        description: err.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Delete a share link permanently
  const deleteShareLink = useCallback(async (tokenId: string) => {
    setIsLoading(true);
    try {
      const { error } = await (supabase as any)
        .from("share_tokens")
        .delete()
        .eq("id", tokenId);

      if (error) throw error;

      setShareTokens((prev) => prev.filter((t) => t.id !== tokenId));

      toast({
        title: "Link deleted",
        description: "The share link has been permanently removed.",
      });
    } catch (err: any) {
      console.error("Error deleting share link:", err);
      toast({
        title: "Failed to delete",
        description: err.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Copy link to clipboard
  const copyToClipboard = useCallback(async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      toast({
        title: "Copied!",
        description: "Link copied to clipboard.",
      });
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = link;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      toast({
        title: "Copied!",
        description: "Link copied to clipboard.",
      });
    }
  }, [toast]);

  // Share via WhatsApp
  const shareViaWhatsApp = useCallback((link: string, documentTitle: string) => {
    const message = encodeURIComponent(
      `Check out this document: "${documentTitle}"\n\n${link}`
    );
    window.open(`https://wa.me/?text=${message}`, "_blank");
  }, []);

  return {
    shareTokens,
    generatedLink,
    isLoading,
    loadShareTokens,
    createShareLink,
    revokeShareLink,
    deleteShareLink,
    copyToClipboard,
    shareViaWhatsApp,
    clearGeneratedLink: () => setGeneratedLink(null),
  };
}
