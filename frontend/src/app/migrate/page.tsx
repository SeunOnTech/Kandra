"use client";

import React, { useState, useEffect, useRef, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Loader2,
    CheckCircle2,
    XCircle,
    ArrowRight,
    Terminal,
    FileCode,
    FolderOpen,
    Brain,
    Zap,
    ShieldCheck,
    Activity,
    CircuitBoard,
    Bug,
    Code2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { api, JobInfo } from "@/lib/api";
import { useJobStream, JobEvent } from "@/hooks/useJobStream";
import dynamic from "next/dynamic";
import { tryParsePlan } from "@/types/plan";
import { ExecutionView } from "@/components/execute/ExecutionView";
import { VerificationView } from "@/components/verify/VerificationView";
import { PlanningView } from "@/components/plan/PlanningView";
import { AuditView } from "@/components/audit/AuditView";

// Dynamically import Mermaid to avoid SSR issues
const MermaidDiagram = dynamic(() => import("@/components/MermaidDiagram"), {
    ssr: false,
    loading: () => <div className="bg-gray-50 rounded-xl p-6 animate-pulse"><div className="h-32 bg-gray-200 rounded" /></div>
});

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// === Types ===

interface FileNode {
    id: string;
    path: string;
    status: "pending" | "scanning" | "scanned" | "modifying" | "completed";
    type: "ts" | "py" | "json" | "js";
}

// === Helper Components ===

function FileTreeItem({
    name,
    path,
    type,
    status,
    depth = 0,
    isActive,
    onClick,
}: {
    name: string;
    path: string;
    type: "folder" | "file";
    status?: string;
    depth?: number;
    isActive?: boolean;
    onClick?: () => void;
}) {
    return (
        <div
            onClick={onClick}
            className={cn(
                "flex items-center space-x-2 py-1 px-2 cursor-pointer rounded text-[11px] group transition-all duration-200",
                isActive
                    ? "bg-blue-50 text-blue-600 border-l-2 border-blue-500"
                    : "text-gray-600 hover:bg-gray-100 border-l-2 border-transparent"
            )}
            style={{ paddingLeft: `${depth * 12 + 12}px` }}
        >
            <span className="shrink-0 w-4 flex justify-center">
                {type === "folder" ? (
                    <FolderOpen className="w-3.5 h-3.5 text-blue-500/70" />
                ) : (
                    <FileCode className="w-3.5 h-3.5 text-gray-500" />
                )}
            </span>
            <span className="truncate flex-1 tracking-tight">{name}</span>
            <AnimatePresence>
                {status === "loading" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <Loader2 className="w-2.5 h-2.5 animate-spin text-blue-500/50" />
                    </motion.div>
                )}
                {status === "new" && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// === IDE Implementation View ===

function ImplementationView({
    plan,
    terminalLogs,
    files,
    fileContents,
    jobId,
}: {
    plan: string | undefined;
    terminalLogs: string[];
    files: FileNode[];
    fileContents: Record<string, string>;
    jobId: string | null;
}) {
    const [localContents, setLocalContents] = useState<Record<string, string>>({});
    const [activeFile, setActiveFile] = useState("Initializing...");
    const terminalRef = useRef<HTMLDivElement>(null);
    const [isUserSelecting, setIsUserSelecting] = useState(false);

    // Auto-scroll terminal
    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [terminalLogs]);

    // Build file tree structure
    const fileTree = useMemo(() => {
        const root: any[] = [];
        const map: Record<string, any> = {};
        const sorted = [...files].sort((a, b) => a.path.length - b.path.length);

        sorted.forEach((node) => {
            const parts = node.path.split("/");
            let currentPath = "";
            let parent: any[] = root;

            parts.forEach((part, i) => {
                const isLast = i === parts.length - 1;
                const path = currentPath ? `${currentPath}/${part}` : part;
                currentPath = path;

                if (!map[path]) {
                    const treeNode = {
                        name: part,
                        path,
                        type: isLast ? "file" : "folder",
                        status: isLast
                            ? node.status === "modifying"
                                ? "loading"
                                : node.status === "completed"
                                    ? "new"
                                    : undefined
                            : undefined,
                        depth: i,
                        children: [],
                    };
                    map[path] = treeNode;
                    parent.push(treeNode);
                }
                parent = map[path].children;
            });
        });

        // Flatten
        const flattened: any[] = [];
        const walk = (items: any[]) => {
            items.sort((a, b) => {
                if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
                return a.name.localeCompare(b.name);
            });
            items.forEach((item) => {
                flattened.push(item);
                if (item.children) walk(item.children);
            });
        };
        walk(root);
        return flattened;
    }, [files]);

    const getFileContent = (path: string) => localContents[path] || fileContents[path] || "";

    // Auto-switch to new files
    useEffect(() => {
        if (isUserSelecting) return;
        const lastModified = files.filter((f) => f.status === "completed" || f.status === "modifying").pop();
        if (lastModified) setActiveFile(lastModified.path);
    }, [files, isUserSelecting]);

    const handleFileClick = async (path: string) => {
        setIsUserSelecting(true);
        setActiveFile(path);

        if (!fileContents[path] && !localContents[path] && jobId) {
            try {
                const res = await fetch(`${API_URL}/api/jobs/${jobId}/files/content?path=${encodeURIComponent(path)}`);
                if (res.ok) {
                    const data = await res.json();
                    setLocalContents((prev) => ({ ...prev, [path]: data.content }));
                }
            } catch (err) {
                console.error("Error fetching file:", err);
            }
        }
    };

    return (
        <div className="flex h-full bg-white text-xs font-mono border border-gray-200 rounded-lg overflow-hidden shadow-xl">
            {/* File Tree */}
            <div className="w-64 border-r border-gray-200 bg-gray-50 flex flex-col">
                <div className="p-3 border-b border-gray-200 flex items-center justify-between">
                    <span className="text-gray-500 uppercase tracking-widest text-[9px] font-bold">Project Explorer</span>
                    <FolderOpen className="w-3 h-3 text-gray-400" />
                </div>
                <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                    {fileTree.map((file, i) => (
                        <FileTreeItem
                            key={i}
                            name={file.name}
                            path={file.path}
                            type={file.type}
                            status={file.status}
                            depth={file.depth}
                            isActive={activeFile === file.path}
                            onClick={() => handleFileClick(file.path)}
                        />
                    ))}
                    {fileTree.length === 0 && (
                        <div className="text-center text-gray-400 mt-4 opacity-50 italic text-[10px]">Initializing...</div>
                    )}
                </div>
            </div>

            {/* Editor + Terminal */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Editor */}
                <div className="flex-1 flex flex-col min-h-0 bg-white">
                    <div className="h-9 bg-gray-100 flex items-center px-4 border-b border-gray-200 justify-between">
                        <div className="flex items-center space-x-4 h-full">
                            <div className="flex items-center space-x-2 text-gray-700 text-[11px] border-b-2 border-blue-500 h-full px-2">
                                <FileCode className="w-3.5 h-3.5 text-blue-500" />
                                <span className="font-medium">{activeFile.split("/").pop()}</span>
                            </div>
                            <div className="text-[10px] text-gray-400 truncate hidden md:block">{activeFile}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                            <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Bot Editing</span>
                        </div>
                    </div>
                    <div className="flex-1 p-6 overflow-y-auto custom-scrollbar bg-white">
                        <pre className="text-gray-800 leading-relaxed whitespace-pre-wrap font-mono relative">
                            <div className="absolute left-0 top-0 w-8 text-right pr-4 text-gray-400 select-none pointer-events-none text-[10px] leading-[1.625rem]">
                                {getFileContent(activeFile)
                                    .split("\n")
                                    .map((_, i) => (
                                        <div key={i}>{i + 1}</div>
                                    ))}
                            </div>
                            <div className="pl-10">
                                <code>{getFileContent(activeFile)}</code>
                                <span className="inline-block w-1.5 h-4 bg-blue-500/80 ml-1 animate-pulse align-middle" />
                            </div>
                        </pre>
                    </div>
                </div>

                {/* Terminal */}
                <div className="h-1/3 bg-black border-t border-gray-800 flex flex-col">
                    <div className="h-8 bg-[#1a1a1a] flex items-center px-4 border-b border-gray-800/50">
                        <div className="flex items-center space-x-2">
                            <Terminal className="w-3 h-3 text-gray-500" />
                            <span className="text-gray-500 uppercase tracking-widest text-[9px] font-bold">Kandra Terminal</span>
                        </div>
                    </div>
                    <div ref={terminalRef} className="flex-1 p-4 overflow-y-auto custom-scrollbar font-mono text-[11px] space-y-1">
                        {terminalLogs.map((log, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "flex items-start transition-opacity duration-300",
                                    log.startsWith(">")
                                        ? "text-gray-200"
                                        : log.includes("Error")
                                            ? "text-red-400"
                                            : log.includes("Success") || log.includes("Found 0 errors")
                                                ? "text-green-400"
                                                : "text-gray-500"
                                )}
                            >
                                <span>{log}</span>
                            </div>
                        ))}
                        <div className="w-2 h-4 bg-gray-600 animate-pulse inline-block align-middle" />
                    </div>
                </div>
            </div>
        </div>
    );
}

// PlanningView moved to @/components/plan/PlanningView


// === Verification View ===








// === Status Steps (Scanning already done on /connect) ===

const STEPS = [
    { id: 0, label: "Planning", icon: Brain },
    { id: 1, label: "Executing", icon: Code2 },
    { id: 2, label: "Certifying", icon: ShieldCheck },
];

// === Main Page Content ===

function MigratePageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const jobId = searchParams.get("job_id");

    const [job, setJob] = useState<JobInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // UI state
    const [currentStep, setCurrentStep] = useState(0); // 0=Planning, 1=Executing, 2=Certifying

    // Execution State
    const [executionLogs, setExecutionLogs] = useState<any[]>([]);
    const [currentExecutionPhase, setCurrentExecutionPhase] = useState<any>(null);
    const [isExecutionComplete, setIsExecutionComplete] = useState(false);

    const [plan, setPlan] = useState<string | undefined>(undefined);
    const [files, setFiles] = useState<FileNode[]>([]);
    const [fileContents, setFileContents] = useState<Record<string, string>>({});
    const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isApproving, setIsApproving] = useState(false);
    const [planningStarted, setPlanningStarted] = useState(false);

    // WebSocket stream
    const { connected, events, lastEvent, status } = useJobStream(jobId, {
        onEvent: (event) => {
            // ALWAYS append to executionLogs so ExecutionView gets the full stream
            // This fixes the "starvation" issue where ExecutionView didn't see terminal/file events
            setExecutionLogs(prev => [...prev, event]);

            // Handle different event types for local page state (if needed)
            switch (event.type) {
                case "status_changed":
                    if (event.status === "PLANNING") setCurrentStep(0);
                    if (event.status === "EXECUTING") setCurrentStep(1);
                    if (event.status === "VERIFYING") setCurrentStep(2);
                    if (event.status === "COMPLETED") setCurrentStep(2);
                    break;
                case "plan_chunk":
                    // Complete plan sent as single chunk - replace instead of append
                    setPlan(String(event.payload?.content || ""));
                    break;

                // Execution Coordinator Events
                case "phase_started":
                    setCurrentExecutionPhase(event.payload);
                    break;
                case "execution_complete":
                    setIsExecutionComplete(true);
                    setTimeout(() => setCurrentStep(2), 2000); // Move to certifying after delay
                    break;
            }
        },
    });

    // Load job on mount
    useEffect(() => {
        if (!jobId) {
            setError("No job ID provided");
            setLoading(false);
            return;
        }

        const loadJob = async () => {
            try {
                const data = await api.jobs.get(jobId);
                setJob(data);
                if (data.status === "CREATED" || data.status === "PLANNING" || data.status === "AWAITING_APPROVAL") setCurrentStep(0);
                else if (data.status === "EXECUTING") setCurrentStep(1);
                else if (data.status === "VERIFYING" || data.status === "COMPLETED") setCurrentStep(2);
            } catch (err: any) {
                setError(err.message || "Failed to load job");
            } finally {
                setLoading(false);
            }
        };

        loadJob();
    }, [jobId]);

    // Auto-trigger planning when job is CREATED
    useEffect(() => {
        if (!job || !jobId || planningStarted) return;

        if (job.status === "CREATED") {
            setPlanningStarted(true);

            // Get analysis data from sessionStorage (stored by connect page)
            const analysisDataStr = sessionStorage.getItem(`analysis_${jobId}`);
            const analysisData = analysisDataStr ? JSON.parse(analysisDataStr) : {};

            console.log("🚀 Auto-triggering planning for job:", jobId);

            api.jobs.startPlanning(jobId, analysisData)
                .then(() => console.log("✅ Planning started"))
                .catch((err) => console.error("❌ Failed to start planning:", err));
        }
    }, [job, jobId, planningStarted]);

    // Handle plan approval
    const handleApprove = async () => {
        if (!jobId) return;

        setIsApproving(true);
        try {
            await api.jobs.approve(jobId);
            console.log("✅ Plan approved");
        } catch (err) {
            console.error("❌ Failed to approve plan:", err);
        } finally {
            setIsApproving(false);
        }
    };

    // Handle plan rejection
    const handleReject = async () => {
        if (!jobId) return;

        // Could add a modal for feedback here
        try {
            await api.jobs.reject(jobId);
            setPlan(undefined); // Clear the current plan
            setPlanningStarted(false); // Allow re-planning
            console.log("✅ Plan rejected");
        } catch (err) {
            console.error("❌ Failed to reject plan:", err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-6">
                    <div className="relative">
                        <div className="absolute inset-0 bg-blue-400/20 blur-3xl rounded-full animate-pulse" />
                        <div className="w-16 h-16 rounded-2xl bg-white shadow-xl flex items-center justify-center relative z-10 border border-blue-100">
                            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                        </div>
                    </div>
                    <div className="text-center space-y-2">
                        <p className="text-blue-600 text-xs font-bold font-mono tracking-[0.2em] uppercase">Initializing Engine</p>
                        <p className="text-slate-400 text-xs">Preparing secure migration workspace...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl shadow-blue-900/5 border border-blue-100 p-8 text-center animate-in zoom-in-95 duration-500">
                    <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <XCircle className="w-8 h-8 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Analysis Failed</h2>
                    <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                        {error || "We couldn't initialize the migration session. The job ID might be invalid or the server is unreachable."}
                    </p>
                    <button
                        onClick={() => router.push("/connect")}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all hover:shadow-lg hover:shadow-blue-500/20 flex items-center justify-center gap-2 active:scale-[0.98]"
                    >
                        <ArrowRight className="w-4 h-4 rotate-180" />
                        Return to Connect
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
            {/* Header */}
            <header className="border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-40 shadow-sm">
                <div className={cn("mx-auto py-4 flex items-center justify-between px-6", (currentStep === 1 || currentStep === 2) ? "max-w-none" : "max-w-[1800px]")}>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                            <Zap className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg tracking-tight text-gray-900">{job.repo_name}</h1>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                <ArrowRight className="w-3 h-3" />
                                {job.target_stack}
                            </p>
                        </div>
                    </div>

                    {/* Steps */}
                    <div className="flex items-center gap-1">
                        {STEPS.map((step, i) => (
                            <div key={step.id} className="flex items-center">
                                <div
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 rounded-lg transition-all",
                                        currentStep === step.id
                                            ? "bg-blue-50 text-blue-600 border border-blue-200"
                                            : currentStep > step.id
                                                ? "text-emerald-600"
                                                : "text-gray-400"
                                    )}
                                >
                                    {currentStep > step.id ? (
                                        <CheckCircle2 className="w-4 h-4" />
                                    ) : currentStep === step.id ? (
                                        <step.icon className="w-4 h-4 animate-pulse" />
                                    ) : (
                                        <step.icon className="w-4 h-4" />
                                    )}
                                    <span className="text-xs font-medium hidden lg:block">{step.label}</span>
                                </div>
                                {i < STEPS.length - 1 && <div className={cn("w-8 h-[2px] mx-1", currentStep > step.id ? "bg-emerald-400" : "bg-gray-200")} />}
                            </div>
                        ))}
                    </div>

                    {/* Connection Status */}
                    <div className={cn("flex items-center gap-2 text-xs", connected ? "text-green-600" : "text-gray-400")}>
                        <div className={cn("w-2 h-2 rounded-full", connected ? "bg-green-500 animate-pulse" : "bg-gray-400")} />
                        {connected ? "Live" : "Connecting..."}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className={cn("flex-1", (currentStep === 1 || currentStep === 2) ? "p-0" : "p-6")}>
                <div className={cn("mx-auto", (currentStep === 1 || currentStep === 2) ? "max-w-none h-[calc(100vh-73px)]" : "max-w-[1800px] h-[calc(100vh-140px)]")}>
                    <AnimatePresence mode="wait">
                        {currentStep === 0 && (
                            <motion.div key="planning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                                <PlanningView
                                    plan={plan}
                                    isFullScreen={isFullScreen}
                                    setIsFullScreen={setIsFullScreen}
                                    onApprove={handleApprove}
                                    isApproving={isApproving}
                                    onReject={handleReject}
                                />
                            </motion.div>
                        )}

                        {currentStep === 1 && (
                            <motion.div key="execution" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                                <ExecutionView
                                    logs={executionLogs}
                                    currentPhase={currentExecutionPhase}
                                    isComplete={isExecutionComplete}
                                />
                            </motion.div>
                        )}

                        {currentStep === 2 && (
                            <motion.div key="audit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                                <AuditView jobId={jobId!} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main >
        </div >
    );
}

// === Page Export ===

export default function MigratePage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                </div>
            }
        >
            <MigratePageContent />
        </Suspense>
    );
}
