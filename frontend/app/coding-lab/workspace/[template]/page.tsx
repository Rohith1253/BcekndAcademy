"use client";

import React, { use, useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import CodingWorkspace from "@/components/coding-lab/CodingWorkspace";
import { CODING_LAB_TEMPLATES } from "@/lib/coding-lab-templates";
import { api } from "@/lib/api";
import type { VirtualFile, CodingLabTemplate } from "@/lib/coding-lab-types";

function WorkspaceInner({ templateId }: { templateId: string }) {
  const searchParams = useSearchParams();
  const workspaceId = searchParams.get("workspaceId");

  const [loading, setLoading] = useState(Boolean(workspaceId));
  const [savedName, setSavedName] = useState<string>("");
  const [savedFiles, setSavedFiles] = useState<VirtualFile[] | undefined>(undefined);

  // Find template definition
  const template: CodingLabTemplate =
    CODING_LAB_TEMPLATES.find((t) => t.id === templateId) || CODING_LAB_TEMPLATES[0];

  useEffect(() => {
    if (!workspaceId) {
      setLoading(false);
      return;
    }

    async function loadSaved() {
      try {
        const res = await api.get(`/api/coding-lab/workspaces/${workspaceId}`);
        if (res.success && res.data?.workspace) {
          setSavedName(res.data.workspace.name);
          setSavedFiles(res.data.workspace.files);
        }
      } catch (err) {
        console.error("Failed to load saved workspace:", err);
      } finally {
        setLoading(false);
      }
    }

    loadSaved();
  }, [workspaceId]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#050712] text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
          <p className="text-xs font-mono">Loading workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <CodingWorkspace
      key={workspaceId || template.id}
      template={template}
      initialWorkspaceId={workspaceId}
      initialWorkspaceName={savedName}
      savedFiles={savedFiles}
    />
  );
}

export default function DynamicWorkspacePage({
  params,
}: {
  params: Promise<{ template: string }>;
}) {
  const resolvedParams = use(params);

  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-[#050712] text-slate-400">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
        </div>
      }
    >
      <WorkspaceInner templateId={resolvedParams.template} />
    </Suspense>
  );
}
