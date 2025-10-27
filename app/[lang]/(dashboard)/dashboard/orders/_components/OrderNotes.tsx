'use client';

import { useState, useTransition } from "react";
import { addOrderNote } from "@/lib/actions/orders";
import { Textarea } from "@/components/shadcnUI/textarea";
import { Button } from "@/components/shadcnUI/button";
import { toast } from "@/hooks/use-toast";
import { useAuthStore } from "@/lib/stores";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shadcnUI/avatar";
import { Loader2 } from "lucide-react";
import { useI18nStore } from "@/lib/stores/i18n-store";

// Assuming a type for the note object, including the user
type OrderNote = {
  id: number;
  note: string;
  createdAt: Date | null;
  user: {
    id: number;
    username: string | null;
    image: string | null | undefined;
  } | null;
};

interface OrderNotesProps {
  orderId: number;
  initialNotes: OrderNote[];
}

export function OrderNotes({ orderId, initialNotes }: OrderNotesProps) {
  const { t } = useI18nStore();
  const { user } = useAuthStore();
  const [notes, setNotes] = useState(initialNotes);
  const [newNote, setNewNote] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !user) return;

    startTransition(async () => {
      const result = await addOrderNote(orderId, newNote, user.id);
      if (result.success && result.data) {
        const newNoteWithUser = {
            ...result.data,
            user: {
                id: user.id,
                username: user.username,
                image: user.image
            }
        }
        setNotes([newNoteWithUser, ...notes]);
        setNewNote("");
        toast({ title: t("orders.success"), description: t("orders.noteAdded") });
      } else {
        toast({ title: t("orders.error"), description: result.error, variant: "destructive" });
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("orders.internalNotes")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <Textarea
            placeholder={t("orders.addNotePlaceholder")}
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            rows={3}
            disabled={isPending}
          />
          <Button type="submit" disabled={isPending || !newNote.trim()}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : t("orders.addNote")}
          </Button>
        </form> 
        <div className="space-y-4">
          {notes.length === 0 ? (
            <p className="text-muted-foreground text-sm">{t("orders.noNotes")}</p>
          ) : (
            notes.map((note) => (
              <div key={note.id} className="flex items-start gap-4 p-4 border rounded-lg">
                <Avatar>
                  <AvatarImage src={note.user?.image || undefined} alt={note.user?.username || "user"} />
                  <AvatarFallback>{note.user?.username?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{note.user?.username}</p>
                    <p className="text-xs text-muted-foreground">
                      {note.createdAt ? new Date(note.createdAt).toLocaleString() : "N/A"}  
                    </p>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{note.note}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
