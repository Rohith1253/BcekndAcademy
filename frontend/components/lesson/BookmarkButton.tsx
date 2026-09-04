"use client";

import { Heart } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useClient } from "@/lib/store";
import { getApiUrl } from "@/lib/http";

interface BookmarkButtonProps {
  lessonId?: string;
}

export default function BookmarkButton({ lessonId }: BookmarkButtonProps) {
  const { user } = useClient();
  const [bookmarked, setBookmarked] = useState(false);

  const checkBookmark = useCallback(async () => {
    if (!user || !lessonId) return;
    try {
      const res = await fetch(getApiUrl("/api/bookmarks"), { credentials: "include" });
      const json = await res.json();
      if (json.success && Array.isArray(json.data?.bookmarks)) {
        const isBookmarked = json.data.bookmarks.some(
          (b: any) =>
            b.lessonId === lessonId ||
            b._id === lessonId ||
            b.lessonId?.slug === lessonId ||
            b.lessonId?._id === lessonId
        );
        setBookmarked(isBookmarked);
      }
    } catch (e) {
      console.error("Check bookmark error:", e);
    }
  }, [user, lessonId]);

  useEffect(() => {
    checkBookmark();
  }, [checkBookmark]);

  const toggleBookmark = async () => {
    const nextState = !bookmarked;
    setBookmarked(nextState);

    if (user && lessonId) {
      try {
        if (nextState) {
          await fetch(getApiUrl("/api/bookmarks"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lessonId }),
            credentials: "include",
          });
        } else {
          await fetch(getApiUrl(`/api/bookmarks/${lessonId}`), {
            method: "DELETE",
            credentials: "include",
          });
        }
      } catch (e) {
        console.error("Toggle bookmark error:", e);
      }
    }
  };

  return (
    <button
      onClick={toggleBookmark}
      className={`inline-flex items-center justify-center rounded-3xl px-4 py-2.5 text-sm font-semibold transition ${
        bookmarked
          ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/20"
          : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
      }`}
    >
      <Heart className={`h-4 w-4 ${bookmarked ? "fill-current" : ""}`} />
      <span className="ml-2">{bookmarked ? "Bookmarked" : "Bookmark"}</span>
    </button>
  );
}
