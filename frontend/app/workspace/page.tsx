"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import CodingWorkspace from "@/components/workspace/CodingWorkspace";

function WorkspaceContent() {
  const searchParams = useSearchParams();
  const exerciseId = searchParams.get("exercise") || undefined;
  const courseSlug = searchParams.get("course") || undefined;
  const lessonSlug = searchParams.get("lesson") || undefined;

  return (
    <CodingWorkspace
      initialExerciseId={exerciseId}
      courseSlug={courseSlug}
      lessonSlug={lessonSlug}
    />
  );
}

export default function WorkspacePage() {
  return (
    <Suspense fallback={<div className="flex h-screen w-screen items-center justify-center bg-slate-950 text-cyan-400 font-mono text-sm">Loading Coding Workspace...</div>}>
      <WorkspaceContent />
    </Suspense>
  );
}
