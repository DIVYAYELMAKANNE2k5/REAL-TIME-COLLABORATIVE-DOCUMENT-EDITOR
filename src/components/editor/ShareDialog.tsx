import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Share2,
  Link as LinkIcon,
  Copy,
  MessageCircle,
  Trash2,
  Ban,
  Eye,
  Edit3,
  ExternalLink,
  Loader2,
  Users,
} from "lucide-react";
import { useShareToken } from "@/hooks/useShareToken";
import { formatDistanceToNow } from "date-fns";

interface ShareDialogProps {
  documentId: string | undefined;
  documentTitle: string;
  isOwner: boolean;
}

export function ShareDialog({ documentId, documentTitle, isOwner }: ShareDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<"view" | "edit">("view");
  const [expiresIn, setExpiresIn] = useState<string>("never");
  
  const {
    shareTokens,
    generatedLink,
    isLoading,
    loadShareTokens,
    createShareLink,
    revokeShareLink,
    deleteShareLink,
    copyToClipboard,
    shareViaWhatsApp,
    clearGeneratedLink,
  } = useShareToken(documentId);

  useEffect(() => {
    if (open && documentId && documentId !== "new") {
      loadShareTokens();
    }
  }, [open, documentId, loadShareTokens]);

  const handleCreateLink = async () => {
    const days = expiresIn === "never" ? undefined : parseInt(expiresIn);
    await createShareLink(selectedPermission, days);
  };

  const getExpirationDays = (value: string) => {
    switch (value) {
      case "1": return "1 day";
      case "7": return "7 days";
      case "30": return "30 days";
      default: return "Never";
    }
  };

  if (!isOwner) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) clearGeneratedLink();
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Document
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">Create Link</TabsTrigger>
            <TabsTrigger value="manage">
              Manage Links
              {shareTokens.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 justify-center">
                  {shareTokens.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-4 pt-4">
            {/* Permission Selection */}
            <div className="space-y-2">
              <Label>Access Level</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedPermission("view")}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedPermission === "view"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-muted-foreground/50"
                  }`}
                >
                  <Eye className="h-5 w-5 mb-2 text-muted-foreground" />
                  <div className="font-medium">View Only</div>
                  <div className="text-xs text-muted-foreground">
                    Can read but not edit
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPermission("edit")}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedPermission === "edit"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-muted-foreground/50"
                  }`}
                >
                  <Edit3 className="h-5 w-5 mb-2 text-muted-foreground" />
                  <div className="font-medium">Can Edit</div>
                  <div className="text-xs text-muted-foreground">
                    Full editing access
                  </div>
                </button>
              </div>
            </div>

            {/* Expiration */}
            <div className="space-y-2">
              <Label>Link Expires</Label>
              <Select value={expiresIn} onValueChange={setExpiresIn}>
                <SelectTrigger>
                  <SelectValue placeholder="Select expiration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">Never</SelectItem>
                  <SelectItem value="1">In 1 day</SelectItem>
                  <SelectItem value="7">In 7 days</SelectItem>
                  <SelectItem value="30">In 30 days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Generate Button */}
            <Button 
              onClick={handleCreateLink} 
              className="w-full" 
              disabled={isLoading || !documentId || documentId === "new"}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <LinkIcon className="h-4 w-4 mr-2" />
              )}
              Generate Share Link
            </Button>

            {/* Generated Link Display */}
            {generatedLink && (
              <div className="space-y-3 p-4 rounded-lg bg-muted/50 border">
                <div className="flex items-center gap-2 text-sm font-medium text-primary">
                  <LinkIcon className="h-4 w-4" />
                  Link Created!
                </div>
                <div className="flex gap-2">
                  <Input
                    value={generatedLink}
                    readOnly
                    className="text-xs"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(generatedLink)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => copyToClipboard(generatedLink)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Link
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 text-emerald-600 hover:text-emerald-700"
                    onClick={() => shareViaWhatsApp(generatedLink, documentTitle)}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    WhatsApp
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="manage" className="pt-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : shareTokens.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <LinkIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No share links created yet</p>
                <p className="text-sm">Create a link to share this document</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {shareTokens.map((token) => (
                  <div
                    key={token.id}
                    className={`p-3 rounded-lg border ${
                      token.is_active ? "bg-card" : "bg-muted/50 opacity-60"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge
                            variant={token.permission === "edit" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {token.permission === "edit" ? (
                              <>
                                <Edit3 className="h-3 w-3 mr-1" />
                                Edit
                              </>
                            ) : (
                              <>
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </>
                            )}
                          </Badge>
                          {!token.is_active && (
                            <Badge variant="destructive" className="text-xs">
                              Revoked
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Created {formatDistanceToNow(new Date(token.created_at), { addSuffix: true })}
                          {token.expires_at && (
                            <> · Expires {formatDistanceToNow(new Date(token.expires_at), { addSuffix: true })}</>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <Users className="h-3 w-3" />
                          {token.access_count} {token.access_count === 1 ? "visit" : "visits"}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {token.is_active && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => copyToClipboard(`${window.location.origin}/shared/${token.token}`)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => window.open(`${window.location.origin}/shared/${token.token}`, "_blank")}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => revokeShareLink(token.id)}
                            >
                              <Ban className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => deleteShareLink(token.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
