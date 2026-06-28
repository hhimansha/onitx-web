import { useEffect, useRef, useState } from "react";
import { Pencil, Trash2, Send } from "lucide-react";

import { getComments, addComment, updateComment, deleteComment } from "@/services/commentService";
import type { Comment } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

interface Props {
  taskId: string;
}

const CommentSection = ({ taskId }: Props) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newContent, setNewContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    getComments(taskId)
      .then(setComments)
      .catch(() => setError("Failed to load comments."))
      .finally(() => setIsLoading(false));
  }, [taskId]);

  const handleAdd = async () => {
    const content = newContent.trim();
    if (!content) return;
    setIsSending(true);
    setError(null);
    try {
      const comment = await addComment(taskId, content);
      setComments((prev) => [...prev, comment]);
      setNewContent("");
    } catch {
      setError("Failed to add comment.");
    } finally {
      setIsSending(false);
    }
  };

  const startEdit = (comment: Comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  const handleUpdate = async (commentId: string) => {
    const content = editContent.trim();
    if (!content) return;
    setError(null);
    try {
      const updated = await updateComment(taskId, commentId, content);
      setComments((prev) => prev.map((c) => (c.id === commentId ? updated : c)));
      setEditingId(null);
    } catch {
      setError("Failed to update comment.");
    }
  };

  const handleDelete = async (commentId: string) => {
    setError(null);
    try {
      await deleteComment(taskId, commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch {
      setError("Failed to delete comment.");
    }
  };

  const canModify = (comment: Comment) =>
    user?.id === comment.user.id || user?.role === "ADMIN";

  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold">Comments ({comments.length})</h2>

      {error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
      )}

      {/* Comment list */}
      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-md bg-muted" />
          ))
        ) : comments.length === 0 ? (
          <p className="text-sm text-muted-foreground">No comments yet. Be the first to add one.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="rounded-md border p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  {comment.user.profileImage ? (
                    <img
                      src={comment.user.profileImage}
                      alt={comment.user.name}
                      className="h-7 w-7 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {comment.user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <span className="text-sm font-medium">{comment.user.name}</span>
                    <span className="ml-2 text-xs text-muted-foreground">{formatDate(comment.createdAt)}</span>
                  </div>
                </div>

                {canModify(comment) && (
                  <div className="flex gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => startEdit(comment)}
                      aria-label="Edit comment"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(comment.id)}
                      aria-label="Delete comment"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
              </div>

              {editingId === comment.id ? (
                <div className="space-y-2 pt-1">
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={3}
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleUpdate(comment.id)}>
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
              )}
            </div>
          ))
        )}
      </div>

      {/* New comment input */}
      <div className="flex gap-2 pt-1">
        <Textarea
          ref={textareaRef}
          placeholder="Add a comment…"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          rows={2}
          className="resize-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleAdd();
          }}
        />
        <Button
          onClick={handleAdd}
          disabled={isSending || !newContent.trim()}
          size="icon"
          className="self-end"
          aria-label="Send comment"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">Ctrl+Enter to send</p>
    </div>
  );
};

export default CommentSection;
