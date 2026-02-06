import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
    Brain,
    CheckCircle2,
    Loader2,
    ArrowRight,
    Maximize2,
    Minimize2,
    ShieldCheck,
    Code2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { tryParsePlan } from "@/types/plan";
import { PlanDashboard } from "./PlanDashboard";
import dynamic from "next/dynamic";

// Dynamically import Mermaid to avoid SSR issues
const MermaidDiagram = dynamic(() => import("@/components/MermaidDiagram"), {
    ssr: false,
    loading: () => <div className="bg-gray-50 rounded-xl p-6 animate-pulse"><div className="h-32 bg-gray-200 rounded" /></div>
});

interface PlanningViewProps {
    plan: string | undefined;
    isFullScreen: boolean;
    setIsFullScreen: (v: boolean) => void;
    onApprove?: () => void;
    onReject?: () => void;
    isApproving?: boolean;
}

export function PlanningView({
    plan,
    isFullScreen,
    setIsFullScreen,
    onApprove,
    onReject,
    isApproving = false,
}: PlanningViewProps) {

    // Simulate "thinking" steps for the skeleton
    const [loadingStep, setLoadingStep] = useState(0);

    // Typewriter effect for authentic "AI Generation" feel
    const [displayedPlan, setDisplayedPlan] = useState("");

    useEffect(() => {
        if (!plan) {
            setDisplayedPlan("");
            return;
        }

        // If plan is already parsed as JSON, show it immediately (Dashboard handles animations)
        if (tryParsePlan(plan)) {
            setDisplayedPlan(plan);
            return;
        }

        // Otherwise (Markdown), type it out automatically
        let currentIndex = 0;
        const speed = 5; // base chars per tick

        const interval = setInterval(() => {
            if (currentIndex >= plan.length) {
                setDisplayedPlan(plan); // Ensure full completion
                clearInterval(interval);
                return;
            }
            // accelerated typing for long content
            const jump = Math.min(speed + Math.floor(currentIndex / 200), 50);
            currentIndex += jump;
            setDisplayedPlan(plan.slice(0, currentIndex));
        }, 10);

        return () => clearInterval(interval);
    }, [plan]);

    useEffect(() => {
        if (plan && !isFullScreen) {
            setIsFullScreen(true);
        }
    }, [plan, isFullScreen, setIsFullScreen]);

    useEffect(() => {
        if (plan) return;
        const interval = setInterval(() => {
            setLoadingStep(prev => (prev + 1) % 3);
        }, 2000);
        return () => clearInterval(interval);
    }, [plan]);

    // Loading skeleton for premium feel
    const LoadingSkeleton = () => (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header skeleton */}
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                        <Brain className="w-4 h-4 text-blue-500 animate-pulse" />
                    </div>
                    <div>
                        <div className="text-sm text-gray-500 font-medium animate-pulse">
                            {loadingStep === 0 && "Scanning codebase structure..."}
                            {loadingStep === 1 && "Analyzing dependencies & logic..."}
                            {loadingStep === 2 && "Synthesizing migration plan..."}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">AI Architect is working...</div>
                    </div>
                </div>
            </div>

            {/* Progress steps */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: "Deep Scan", state: loadingStep >= 0 ? "busy" : "pending" },
                    { label: "Gap Analysis", state: loadingStep >= 1 ? "busy" : "pending" },
                    { label: "Plan Generation", state: loadingStep >= 2 ? "busy" : "pending" },
                ].map((step, i) => (
                    <div key={i} className="relative">
                        <div className={cn(
                            "flex items-center gap-2 p-3 rounded-lg border transition-all duration-500",
                            step.state === "busy" ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200"
                        )}>
                            {step.state === "busy" ? (
                                <div className="w-4 h-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                            ) : (
                                <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                            )}
                            <span className={cn(
                                "text-xs font-medium transition-colors duration-500",
                                step.state === "busy" ? "text-blue-700" : "text-gray-400"
                            )}>
                                {step.label}
                            </span>
                        </div>
                        {i < 2 && (
                            <div className={cn(
                                "absolute top-1/2 -right-2 w-4 h-0.5 -translate-y-1/2 transition-colors duration-500",
                                loadingStep > i ? "bg-blue-300" : "bg-gray-200"
                            )} />
                        )}
                    </div>
                ))}
            </div>

            {/* Content skeleton - looks like a document loading */}
            <div className="space-y-6 pt-4">
                <div className="space-y-3">
                    <div className="h-6 bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg w-2/3 animate-pulse" />
                    <div className="h-4 bg-gray-100 rounded w-full animate-pulse delay-75" />
                    <div className="h-4 bg-gray-100 rounded w-5/6 animate-pulse delay-100" />
                </div>

                <div className="flex gap-4">
                    <div className="flex-1 h-24 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 animate-pulse" />
                    <div className="flex-1 h-24 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100 animate-pulse delay-75" />
                    <div className="flex-1 h-24 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100 animate-pulse delay-100" />
                </div>
            </div>
        </div>
    );

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "relative overflow-hidden flex flex-col h-full",
                isFullScreen
                    ? "fixed inset-0 z-50 bg-white"
                    : "bg-white rounded-2xl border border-gray-200/80 shadow-xl shadow-gray-200/50",
                // Architectural grid background
                "bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"
            )}
        >
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-200">
                        <Brain className="w-4.5 h-4.5 text-white" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-gray-900 text-sm">Migration Plan</h2>
                        <p className="text-xs text-gray-500">
                            {plan ? "Review the proposed changes" : "AI Architect is working..."}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {plan && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full animate-in fade-in zoom-in duration-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-xs font-medium text-emerald-700">Ready</span>
                        </div>
                    )}
                    <button
                        onClick={() => setIsFullScreen(!isFullScreen)}
                        className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-all duration-200 border border-gray-200"
                    >
                        {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            {/* Content Container */}
            <div className={cn(
                "flex-1 overflow-y-auto custom-scrollbar relative",
                isFullScreen ? "px-8 lg:px-24 xl:px-48 py-8" : "px-6 py-6"
            )}>
                {plan ? (
                    // Try to parse as JSON first, fallback to markdown
                    (() => {
                        const parsedPlan = tryParsePlan(plan);
                        if (parsedPlan) {
                            // Render structured dashboard for JSON plans
                            return (
                                <div className="pb-24"> {/* Add padding for sticky footer */}
                                    <PlanDashboard
                                        plan={parsedPlan}
                                        onApprove={onApprove || (() => { })}
                                        onReject={onReject || (() => { })}
                                        isApproving={isApproving}
                                    />
                                </div>
                            );
                        }
                        // Fallback to markdown rendering
                        return (
                            <div className={cn("prose prose-gray max-w-none animate-in fade-in slide-in-from-bottom-2 duration-500 pb-24", isFullScreen ? "prose-lg" : "prose-sm")}>
                                <ReactMarkdown
                                    components={{
                                        h1: ({ node, ...props }) => (
                                            <div className="mb-8 pb-4 border-b border-gray-200">
                                                <h1 className="text-2xl font-bold text-gray-900 mb-2" {...props} />
                                                <p className="text-sm text-gray-500 font-normal">Review the plan below and approve to continue</p>
                                            </div>
                                        ),
                                        h2: ({ node, ...props }) => (
                                            <div className="flex items-center gap-3 mt-10 mb-4">
                                                <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
                                                <h2 className="text-lg font-semibold text-gray-900" {...props} />
                                            </div>
                                        ),
                                        h3: ({ node, ...props }) => (
                                            <h3 className="text-base font-medium text-gray-800 mt-6 mb-3 flex items-center gap-2" {...props}>
                                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                            </h3>
                                        ),
                                        ul: ({ node, ...props }) => (
                                            <ul className="space-y-2 my-4 pl-0" {...props} />
                                        ),
                                        ol: ({ node, ...props }) => (
                                            <ol className="space-y-3 my-4 pl-0 list-none counter-reset-item" {...props} />
                                        ),
                                        li: ({ node, children, ...props }) => (
                                            <li className="flex items-start text-gray-600 leading-relaxed list-none" {...props}>
                                                <ArrowRight className="w-4 h-4 text-blue-500 mr-2 mt-0.5 shrink-0" />
                                                <span>{children}</span>
                                            </li>
                                        ),
                                        table: ({ node, ...props }) => (
                                            <div className="my-6 overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                                                <table className="w-full text-sm" {...props} />
                                            </div>
                                        ),
                                        thead: ({ node, ...props }) => (
                                            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200" {...props} />
                                        ),
                                        th: ({ node, ...props }) => (
                                            <th className="px-4 py-3 text-left font-semibold text-gray-900 text-xs uppercase tracking-wider" {...props} />
                                        ),
                                        td: ({ node, ...props }) => (
                                            <td className="px-4 py-3 text-gray-600 border-b border-gray-100" {...props} />
                                        ),
                                        tr: ({ node, ...props }) => (
                                            <tr className="hover:bg-gray-50/50 transition-colors" {...props} />
                                        ),
                                        blockquote: ({ node, ...props }) => (
                                            <blockquote className="my-4 pl-4 py-3 pr-4 border-l-4 border-blue-500 bg-blue-50/50 rounded-r-lg text-gray-700 italic" {...props} />
                                        ),
                                        strong: ({ node, ...props }) => (
                                            <strong className="font-semibold text-gray-900" {...props} />
                                        ),
                                        hr: ({ node, ...props }) => (
                                            <hr className="my-8 border-t border-gray-200" {...props} />
                                        ),
                                        code: ({ node, className, children, ...props }: any) => {
                                            const match = /language-(\w+)/.exec(className || "");
                                            const language = match ? match[1] : "";
                                            const codeContent = String(children).replace(/\n$/, "");

                                            if (language === "mermaid") {
                                                return <MermaidDiagram chart={codeContent} className="my-6" />;
                                            }

                                            return match ? (
                                                <div className="my-5 rounded-xl overflow-hidden border border-gray-200 bg-gray-900 shadow-sm">
                                                    <div className="flex items-center justify-between px-4 py-2.5 bg-gray-800 border-b border-gray-700">
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex gap-1.5">
                                                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                                                <div className="w-3 h-3 rounded-full bg-amber-500" />
                                                                <div className="w-3 h-3 rounded-full bg-green-500" />
                                                            </div>
                                                            <span className="text-xs text-gray-400 font-medium ml-2">{language}</span>
                                                        </div>
                                                    </div>
                                                    <div className="p-4 overflow-x-auto text-sm font-mono text-gray-100">{children}</div>
                                                </div>
                                            ) : (
                                                <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded-md text-sm font-mono" {...props}>
                                                    {children}
                                                </code>
                                            );
                                        },
                                        p: ({ node, ...props }) => (
                                            <p className="text-gray-600 leading-relaxed my-3" {...props} />
                                        ),
                                    }}
                                >
                                    {displayedPlan}
                                </ReactMarkdown>
                            </div>
                        );
                    })()
                ) : (
                    <LoadingSkeleton />
                )}
            </div>

            {/* Sticky Action Footer */}
            {plan && (
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-md border-t border-gray-200/50 z-10 flex justify-end animate-in slide-in-from-bottom-4 duration-500">
                    <button
                        onClick={onApprove}
                        disabled={isApproving}
                        className="px-8 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl shadow-lg shadow-blue-200 transition-all hover:shadow-xl disabled:opacity-50 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {isApproving ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Initializing Migration...
                            </>
                        ) : (
                            <>
                                <div className="p-1 bg-white/20 rounded-full">
                                    <CheckCircle2 className="w-4 h-4 text-white" />
                                </div>
                                Approve & Execute Plan
                            </>
                        )}
                    </button>
                </div>
            )}
        </motion.div>
    );
}
