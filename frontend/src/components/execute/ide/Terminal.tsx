import React, { useEffect, useRef } from "react";
import { Terminal as TerminalIcon, XCircle, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TerminalProps {
    logs: string[];
}

export function Terminal({ logs }: TerminalProps) {
    const bottomRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [logs]);

    return (
        <div className="flex flex-col h-full bg-white text-slate-800 font-mono text-xs border-t border-slate-200">
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-4 h-9 bg-slate-50 border-b border-slate-200 select-none text-slate-500">
                <div className="flex items-center gap-2 uppercase tracking-wider text-[10px] font-bold">
                    <TerminalIcon className="w-3 h-3" />
                    Terminal Output
                </div>
                <div className="flex gap-2">
                    <span className="flex items-center gap-1 cursor-default">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-medium text-emerald-600">Active</span>
                    </span>
                </div>
            </div>

            {/* Logs Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
                {logs.length === 0 && (
                    <div className="opacity-40 italic text-slate-400">Target process ready. Waiting for commands...</div>
                )}
                {logs.map((log, i) => (
                    <div key={i} className="flex hover:bg-slate-50 px-2 -mx-2 rounded transition-colors break-words whitespace-pre-wrap">
                        <span className="opacity-30 mr-3 select-none w-6 text-right text-slate-400 text-[10px] pt-0.5">{i + 1}</span>
                        <span className={cn(
                            "flex-1 font-mono leading-relaxed",
                            log.includes("Error") || log.includes("Failed") ? "text-rose-600 font-medium" :
                                log.includes("Success") || log.includes("Done") ? "text-emerald-600 font-medium" :
                                    log.startsWith(">") ? "text-blue-600 font-bold" :
                                        "text-slate-700"
                        )}>
                            {log}
                        </span>
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
            `}} />
        </div>
    );
}
