"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Save, Trash2, Edit2, Check } from "lucide-react";
import { useClient } from "@/lib/store";
import { getApiUrl } from "@/lib/http";

interface NotesPanelProps {
  lessonId?: string;
}

export default function NotesPanel({ lessonId }: NotesPanelProps) {
  const { user } = useClient();
  const [notes, setNotes] = useState<Array<{ id: string; text: string; timestamp: string }>>([]);
  const [newNote, setNewNote] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  const fetchNotes = useCallback(async () => {
    if (!user) return;
    try {
      const url = lessonId ? getApiUrl(`/api/notes?lessonId=${lessonId}`) : getApiUrl("/api/notes");
      const res = await fetch(url, { credentials: "include" });
      const json = await res.json();
      if (json.success && Array.isArray(json.data?.notes)) {
        setNotes(
          json.data.notes.map((n: any) => ({
            id: n._id || n.id,
            text: n.content,
            timestamp: new Date(n.updatedAt || n.createdAt || Date.now()).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          }))
        );
      }
    } catch (e) {
      console.error("Fetch notes error:", e);
    }
  }, [user, lessonId]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    if (user && lessonId) {
      try {
        const res = await fetch(getApiUrl("/api/notes"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lessonId, content: newNote }),
          credentials: "include",
        });
        const json = await res.json();
        if (json.success) {
          setNewNote("");
          await fetchNotes();
          return;
        }
      } catch (e) {
        console.error("Add note error:", e);
      }
    }

    // Local fallback if unauthenticated
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setNotes((prev) => [...prev, { id: Date.now().toString(), text: newNote, timestamp: now }]);
    setNewNote("");
  };

  const handleDeleteNote = async (id: string) => {
    if (user && id.length === 24) {
      try {
        await fetch(getApiUrl(`/api/notes/${id}`), { method: "DELETE", credentials: "include" });
        await fetchNotes();
        return;
      } catch (e) {
        console.error("Delete note error:", e);
      }
    }
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  const handleEditNote = (id: string, text: string) => {
    setEditingId(id);
    setEditingText(text);
  };

  const handleSaveEdit = async (id: string) => {
    if (user && id.length === 24) {
      try {
        await fetch(getApiUrl(`/api/notes/${id}`), {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: editingText }),
          credentials: "include",
        });
        setEditingId(null);
        await fetchNotes();
        return;
      } catch (e) {
        console.error("Edit note error:", e);
      }
    }
    setNotes((prev) =>
      prev.map((note) => (note.id === id ? { ...note, text: editingText } : note))
    );
    setEditingId(null);
  };

  return (
    <section className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
      <div className="mb-6">
        <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Personal Notes</p>
        <h2 className="mt-3 text-2xl font-semibold text-white">Take notes as you learn</h2>
      </div>

      <div className="mb-6 space-y-3">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Write your notes here..."
          className="w-full rounded-[1.5rem] border border-white/10 bg-slate-900/80 px-5 py-4 text-slate-200 placeholder-slate-500 focus:border-violet-500/50 focus:outline-none"
          rows={3}
        />
        <button
          onClick={handleAddNote}
          disabled={!newNote.trim()}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:opacity-95 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          Save Note
        </button>
      </div>

      <div className="space-y-3">
        {notes.length === 0 ? (
          <p className="py-8 text-center text-slate-400">No notes yet. Start writing to capture key concepts.</p>
        ) : (
          notes.map((note) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[1.5rem] border border-white/10 bg-slate-900/80 p-4"
            >
              {editingId === note.id ? (
                <div className="space-y-3">
                  <textarea
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    className="w-full rounded-[1rem] border border-white/10 bg-slate-950 px-4 py-3 text-slate-200 focus:border-violet-500/50 focus:outline-none"
                    rows={2}
                  />
                  <button
                    onClick={() => handleSaveEdit(note.id)}
                    className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-4 py-2 text-sm font-medium text-emerald-300 hover:bg-emerald-500/30"
                  >
                    <Check className="h-4 w-4" />
                    Save
                  </button>
                </div>
              ) : (
                <div className="flex gap-4">
                  <p className="flex-1 text-sm text-slate-300">{note.text}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditNote(note.id, note.text)}
                      className="rounded-full border border-white/10 bg-white/5 p-2 transition hover:bg-white/10"
                    >
                      <Edit2 className="h-4 w-4 text-slate-300" />
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="rounded-full border border-white/10 bg-white/5 p-2 transition hover:bg-rose-500/10"
                    >
                      <Trash2 className="h-4 w-4 text-slate-300" />
                    </button>
                  </div>
                </div>
              )}
              <p className="mt-2 text-xs text-slate-500">{note.timestamp}</p>
            </motion.div>
          ))
        )}
      </div>
    </section>
  );
}
