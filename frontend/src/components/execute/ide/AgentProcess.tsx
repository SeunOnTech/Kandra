import React, { useRef, useEffect } from "react";
import { Brain, Terminal as TerminalIcon, FileText, Search, Play, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface AgentProcessProps {
    logs: any[]; // Supports generic mixed events for now
}

export function AgentProcess({ logs }: AgentProcessProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll logic
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    // Filters for "Processor" events: Thoughts and Tool Calls
    const processEvents = logs.filter(l =>
        l.type === "agent_thought" ||
        l.type === "tool_call" ||
        l.type === "phase_started" ||
        l.type === "phase_completed" ||
        l.type === "phase_error"
    );

    return (
        <div className="flex flex-col h-full bg-white border-l border-slate-200">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white stick top-0 z-10">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                        <Brain className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="text-xs font-bold text-slate-800">Kandra Brain</h3>
                        <p className="text-[10px] text-slate-400">Autonomous Reasoning</p>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-wider animate-pulse">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Live
                </div>
            </div>

            {/* Timeline */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar" ref={scrollRef}>
                {processEvents.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-40 text-slate-300 text-center">
                        <Brain className="w-12 h-12 mb-2 opacity-20 animate-pulse" />
                        <span className="text-xs">Initializing neural pathways...</span>
                    </div>
                )}

                <AnimatePresence initial={false}>
                    {processEvents.map((event, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative pl-4 border-l-2 border-slate-100 last:border-l-transparent"
                        >
                            {/* Connector Line */}
                            <div className={cn(
                                "absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full border-2 bg-white",
                                event.type === "phase_started" ? "border-blue-500" :
                                    event.type === "agent_thought" ? "border-purple-400" :
                                        event.type === "tool_call" ? "border-amber-400" :
                                            "border-slate-300"
                            )} />

                            {/* Content */}
                            <div className="pb-4">
                                {/* Time */}
                                <span className="text-[9px] text-slate-300 font-mono mb-1 block">
                                    {new Date(event.timestamp || Date.now()).toLocaleTimeString()}
                                </span>

                                {event.type === "phase_started" && (
                                    <div className="bg-blue-50 text-blue-800 p-3 rounded-xl rounded-tl-none text-xs font-medium border border-blue-100 shadow-sm">
                                        🚀 Starting Phase: <span className="font-bold">{event.payload?.phase}</span>
                                    </div>
                                )}

                                {event.type === "phase_completed" && (
                                    <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl rounded-tl-none text-xs font-bold border border-emerald-100 shadow-sm flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                        Phase Complete
                                    </div>
                                )}

                                {event.type === "phase_error" && (
                                    <div className="bg-rose-50 text-rose-800 p-3 rounded-xl rounded-tl-none text-xs font-bold border border-rose-100 shadow-sm flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 text-rose-500" />
                                        Error: {event.payload?.error}
                                    </div>
                                )}

                                {event.type === "agent_thought" && (
                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase font-bold text-purple-400 tracking-wider flex items-center gap-1">
                                            <Brain className="w-3 h-3" />
                                            Thinking
                                        </p>
                                        <div className="text-slate-600 text-xs italic leading-relaxed">
                                            "{event.payload?.thought}"
                                        </div>
                                    </div>
                                )}

                                {event.type === "tool_call" && (
                                    <div className="mt-1 bg-white border border-slate-200 p-2.5 rounded-lg shadow-sm group hover:border-amber-200 transition-colors">
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <div className="p-1 bg-amber-50 rounded text-amber-600">
                                                {getToolIcon(event.payload?.tool)}
                                            </div>
                                            <span className="font-bold text-slate-700 text-xs font-mono">{event.payload?.tool}</span>
                                        </div>
                                        <div className="text-[10px] text-slate-400 font-mono bg-slate-50 p-1.5 rounded truncate">
                                            {JSON.stringify(event.payload?.args)}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Live Indicator at bottom */}
                <div className="flex items-center gap-2 text-[10px] text-slate-400 opacity-50 pl-4 py-4 animate-pulse">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Waiting for next step...
                </div>
            </div>
        </div>
    );
}

function getToolIcon(toolName: string) {
    if (toolName?.includes("file")) return <FileText className="w-3 h-3" />;
    if (toolName?.includes("ls") || toolName?.includes("find")) return <Search className="w-3 h-3" />;
    if (toolName?.includes("run")) return <Play className="w-3 h-3" />;
    return <TerminalIcon className="w-3 h-3" />;
}
