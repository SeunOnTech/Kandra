import React, { useMemo } from "react";
import { FolderOpen, FileCode, ChevronRight, ChevronDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export interface FileNode {
    id: string;
    path: string;
    status: "pending" | "scanning" | "scanned" | "modifying" | "completed";
    type: "ts" | "py" | "json" | "js" | "other";
}

interface FileExplorerProps {
    files: FileNode[];
    activeFile: string | null;
    onFileClick: (path: string) => void;
}

interface TreeNode {
    name: string;
    path: string;
    type: "folder" | "file";
    status?: string;
    children: TreeNode[];
    isOpen?: boolean;
}

// Helper to build tree
const buildTree = (files: FileNode[]): TreeNode[] => {
    const root: TreeNode[] = [];
    const map: Record<string, TreeNode> = {};

    // Sort: Folders first, then files. Alphabetical.
    const sortedFiles = [...files].sort((a, b) => a.path.localeCompare(b.path));

    sortedFiles.forEach(file => {
        // Filter out undesirable files/folders
        if (file.path.includes("node_modules") || file.path.includes(".git") || file.path.includes(".DS_Store")) return;

        const parts = file.path.split("/");
        let currentPath = "";
        let currentLevel = root; // Start at root level

        parts.forEach((part, index) => {
            const isLast = index === parts.length - 1;
            const path = currentPath ? `${currentPath}/${part}` : part;
            currentPath = path;

            if (!map[path]) {
                const node: TreeNode = {
                    name: part,
                    path,
                    type: isLast ? "file" : "folder",
                    status: isLast ? file.status : undefined,
                    children: [],
                    isOpen: true // Default open for now, can make stateful later
                };
                map[path] = node;

                // Find parent to add to, or add to root
                if (index === 0) {
                    root.push(node);
                } else {
                    const parentPath = parts.slice(0, index).join("/");
                    if (map[parentPath]) {
                        map[parentPath].children.push(node);
                    } else {
                        // Parent missing (orphan? shouldn't happen with sorted hierarchy ideally, 
                        // but strictly we might need to create intermediates if files come out of order.
                        // For simplicity assuming files contains full paths or enough context)
                        // Fallback: Add to root if parent not found (safety)
                        root.push(node);
                    }
                }
            }
        });
    });

    // Recursive sort children
    const sortNodes = (nodes: TreeNode[]) => {
        nodes.sort((a, b) => {
            if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
            return a.name.localeCompare(b.name);
        });
        nodes.forEach(node => sortNodes(node.children));
    };
    sortNodes(root);

    return root;
};

const FileItem = ({ node, depth, activePath, onClick }: { node: TreeNode, depth: number, activePath: string | null, onClick: (p: string) => void }) => {
    const isActive = activePath === node.path;

    return (
        <div>
            <div
                onClick={() => node.type === "file" && onClick(node.path)}
                className={cn(
                    "flex items-center gap-1.5 py-1 px-2 cursor-pointer text-[12px] font-medium transition-colors select-none",
                    isActive ? "bg-blue-100/50 text-blue-700" : "text-slate-600 hover:bg-slate-100",
                    node.type === "folder" && "text-slate-900 font-semibold"
                )}
                style={{ paddingLeft: `${depth * 12 + 12}px` }}
            >
                <div className="shrink-0 w-4 flex justify-center text-slate-400">
                    {node.type === "folder" ? (
                        <FolderOpen className="w-3.5 h-3.5 fill-slate-200" />
                    ) : (
                        <FileCode className={cn("w-3.5 h-3.5", isActive ? "text-blue-500" : "text-slate-400")} />
                    )}
                </div>
                <span className="truncate flex-1">{node.name}</span>

                {/* Status Icons */}
                {node.status === "modifying" && <Loader2 className="w-3 h-3 text-blue-500 animate-spin" />}
                {node.status === "completed" && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200" />}
            </div>

            {/* Render Children */}
            {node.children.length > 0 && (
                <div>
                    {node.children.map(child => (
                        <FileItem key={child.path} node={child} depth={depth + 1} activePath={activePath} onClick={onClick} />
                    ))}
                </div>
            )}
        </div>
    );
};

export function FileExplorer({ files, activeFile, onFileClick }: FileExplorerProps) {
    const tree = useMemo(() => buildTree(files), [files]);

    return (
        <div className="flex flex-col h-full bg-slate-50/50 border-r border-slate-200 font-sans text-sm">
            <div className="p-3 border-b border-slate-200/60 bg-slate-50 sticky top-0 z-10">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <FolderOpen className="w-3 h-3" />
                    Explorer
                </h3>
            </div>
            <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
                {files.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-slate-400 gap-2">
                        <Loader2 className="w-6 h-6 animate-spin opacity-50" />
                        <span className="text-xs">Scanning workspace...</span>
                    </div>
                ) : (
                    tree.map(node => (
                        <FileItem key={node.path} node={node} depth={0} activePath={activeFile} onClick={onFileClick} />
                    ))
                )}
            </div>
        </div>
    );
}
