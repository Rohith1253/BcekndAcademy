"use client";

import { motion } from "framer-motion";
import { File, Folder, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

interface FileNode {
  name: string;
  type: "file" | "folder";
  path: string;
  children?: FileNode[];
  language?: string;
}

interface FileExplorerProps {
  files: FileNode[];
  onFileSelect: (path: string) => void;
  selectedFile?: string;
}

function FileItem({
  node,
  depth = 0,
  onSelect,
  selectedFile,
}: {
  node: FileNode;
  depth?: number;
  onSelect: (path: string) => void;
  selectedFile?: string;
}) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedFile === node.path;

  return (
    <div>
      <motion.div
        onClick={() => {
          if (node.type === "folder" && hasChildren) {
            setExpanded(!expanded);
          } else if (node.type === "file") {
            onSelect(node.path);
          }
        }}
        className={`flex items-center gap-2 px-3 py-2 cursor-pointer transition rounded-lg ${
          isSelected ? "bg-white/10" : "hover:bg-white/5"
        }`}
        style={{ paddingLeft: `${depth * 16 + 12}px` }}
      >
        {hasChildren && (
          <motion.div animate={{ rotate: expanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </motion.div>
        )}
        {!hasChildren && node.type === "folder" && <Folder className="h-4 w-4 text-amber-400" />}
        {!hasChildren && node.type === "file" && <File className="h-4 w-4 text-cyan-400" />}
        <span className={`text-sm ${isSelected ? "text-white font-semibold" : "text-slate-300"}`}>
          {node.name}
        </span>
      </motion.div>

      {expanded && hasChildren && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {node.children!.map((child, i) => (
            <FileItem
              key={i}
              node={child}
              depth={depth + 1}
              onSelect={onSelect}
              selectedFile={selectedFile}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}

export default function FileExplorer({ files, onFileSelect, selectedFile }: FileExplorerProps) {
  return (
    <div className="h-full flex flex-col bg-slate-950 rounded-lg border border-white/10">
      <div className="border-b border-white/10 px-4 py-3">
        <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">
          Files
        </h3>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {files.map((node, i) => (
          <FileItem
            key={i}
            node={node}
            onSelect={onFileSelect}
            selectedFile={selectedFile}
          />
        ))}
      </div>
    </div>
  );
}
