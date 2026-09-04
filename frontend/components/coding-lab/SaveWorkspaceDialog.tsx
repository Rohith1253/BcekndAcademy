"use client";

import React, { useState } from "react";
import { Save, X } from "lucide-react";

interface SaveWorkspaceDialogProps {
  isOpen: boolean;
  defaultName: string;
  onClose: () => void;
  onSave: (name: string) => Promise<void>;
}

export default function SaveWorkspaceDialog({
  isOpen,
  defaultName,
  onClose,
  onSave,
}: SaveWorkspaceDialogProps) {
  const [name, setName] = useState(defaultName);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSaving(true);
    try {
      await onSave(name.trim());
      onClose();
    } catch (err: any) {
      alert(err.message || "Failed to save workspace");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Save className="w-4 h-4 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Save Workspace to Cloud</h3>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1.5">Workspace Name</label>
            <input
              type="text"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white outline-none focus:border-cyan-500/50"
              placeholder="e.g. My Express API Project"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || !name.trim()}
              className="rounded-xl bg-cyan-500 px-5 py-2 font-bold text-slate-950 hover:bg-cyan-400 transition disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Workspace"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
