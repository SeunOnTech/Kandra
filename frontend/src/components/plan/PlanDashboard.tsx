"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import {
    ArrowRight,
    CheckCircle2,
    Clock,
    FileCode,
    FilePlus,
    FileX,
    Package,
    ShieldCheck,
    Zap,
    AlertTriangle,
    Target,
    Layers,
    Loader2,
    Search,
    ExternalLink,
    Wrench,
} from "lucide-react";
import type { MigrationPlan, PlanPhase } from "@/types/plan";

interface PlanDashboardProps {
    plan: MigrationPlan;
    onApprove: () => void;
    onReject: () => void;
    isApproving: boolean;
}

export function PlanDashboard({ plan, onApprove, onReject, isApproving }: PlanDashboardProps) {
    const [expandedPhase, setExpandedPhase] = React.useState<number | null>(1);

    const riskColors = {
        low: "bg-emerald-100 text-emerald-700 border-emerald-200",
        medium: "bg-amber-100 text-amber-700 border-amber-200",
        high: "bg-red-100 text-red-700 border-red-200",
    };

    // Variant for container
    const container: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    // Variant for items
    const item: Variants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
    };

    // Derive some stats for the UI
    const totalTasks = plan.phases.reduce((acc, p) => acc + p.tasks.length, 0);
    const totalFiles = plan.phases.reduce((acc, p) => acc + p.files_impacted.length, 0);
    const totalDeps = (plan.dependencies?.add?.length || 0) + (plan.dependencies?.remove?.length || 0);

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-6"
        >
            {/* Header Section */}
            <motion.div variants={item} className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 text-white relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-emerald-500/10 to-cyan-500/10 rounded-full blur-2xl" />

                <div className="relative z-10">
                    {/* Badges */}
                    <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 text-xs font-medium">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            {plan.summary.confidence}% Confidence
                        </div>
                        <div className={cn(
                            "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border",
                            riskColors[plan.summary.risk_level]
                        )}>
                            <AlertTriangle className="w-3.5 h-3.5" />
                            {plan.summary.risk_level.charAt(0).toUpperCase() + plan.summary.risk_level.slice(1)} Risk
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 text-xs font-medium">
                            <Clock className="w-3.5 h-3.5 text-blue-400" />
                            {plan.summary.estimated_duration}
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl font-bold mb-2">{plan.summary.title}</h1>
                    <p className="text-slate-300 text-sm max-w-2xl">{plan.summary.description}</p>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                    { label: "Phases", value: plan.phases.length, icon: Layers, color: "blue" },
                    { label: "Total Tasks", value: totalTasks, icon: Zap, color: "amber" },
                    { label: "Affected Files", value: totalFiles, icon: FileCode, color: "emerald" },
                    { label: "Dependencies", value: totalDeps, icon: Package, color: "purple" },
                ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                            <stat.icon className={cn("w-5 h-5", `text-${stat.color}-500`)} />
                            <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                        </div>
                        <p className="text-xs text-gray-500">{stat.label}</p>
                    </div>
                ))}
            </motion.div>

            {/* Transformation Hero */}
            <motion.div variants={item} className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-500" />
                    Transformation Strategy
                </h3>
                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-center gap-8">
                        {/* Source */}
                        <div className="flex-1 text-center">
                            <div className="inline-flex flex-col items-center p-6 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 min-w-[160px]">
                                <div className="text-sm text-slate-500 uppercase tracking-wider font-semibold mb-1">Source</div>
                                <div className="text-lg font-bold text-slate-900">{plan.transformation.source_stack}</div>
                            </div>
                        </div>

                        {/* Arrow */}
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-16 h-1 bg-gradient-to-r from-slate-300 via-blue-500 to-emerald-500 rounded-full" />
                            <ArrowRight className="w-6 h-6 text-blue-500" />
                        </div>

                        {/* Target */}
                        <div className="flex-1 text-center">
                            <div className="inline-flex flex-col items-center p-6 rounded-xl bg-gradient-to-br from-emerald-50 to-blue-50 border border-emerald-200 min-w-[160px]">
                                <div className="text-sm text-emerald-600 uppercase tracking-wider font-semibold mb-1">Target</div>
                                <div className="text-lg font-bold text-emerald-900">{plan.transformation.target_stack}</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                        <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Strategy</p>
                        <p className="text-sm text-slate-700 leading-relaxed font-medium">{plan.transformation.strategy}</p>
                    </div>
                </div>
            </motion.div>

            {/* Research & Discovery Section */}
            {(plan.research_summary || plan.transformation.package_manager) && (
                <motion.div variants={item} className="bg-white rounded-2xl border border-gray-200 p-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Search className="w-4 h-4 text-indigo-500" />
                        Research & Discovery
                    </h3>

                    <div className="space-y-4">
                        {/* Discovered Tools */}
                        {(plan.transformation.package_manager || plan.transformation.test_framework || plan.transformation.build_tool) && (
                            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
                                <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                    <Wrench className="w-3.5 h-3.5" />
                                    Discovered Tools
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    {plan.transformation.package_manager && (
                                        <div className="bg-white/70 backdrop-blur rounded-lg p-3 border border-indigo-100">
                                            <div className="text-[10px] text-indigo-500 font-bold uppercase mb-1">Package Manager</div>
                                            <div className="text-sm font-mono font-bold text-indigo-900">{plan.transformation.package_manager}</div>
                                        </div>
                                    )}
                                    {plan.transformation.test_framework && (
                                        <div className="bg-white/70 backdrop-blur rounded-lg p-3 border border-indigo-100">
                                            <div className="text-[10px] text-indigo-500 font-bold uppercase mb-1">Test Framework</div>
                                            <div className="text-sm font-mono font-bold text-indigo-900">{plan.transformation.test_framework}</div>
                                        </div>
                                    )}
                                    {plan.transformation.build_tool && (
                                        <div className="bg-white/70 backdrop-blur rounded-lg p-3 border border-indigo-100">
                                            <div className="text-[10px] text-indigo-500 font-bold uppercase mb-1">Build Tool</div>
                                            <div className="text-sm font-mono font-bold text-indigo-900">{plan.transformation.build_tool}</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Search Queries */}
                        {plan.research_summary?.search_queries && plan.research_summary.search_queries.length > 0 && (
                            <div>
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                    Search Queries Executed
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {plan.research_summary.search_queries.map((query, i) => (
                                        <div key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600">
                                            <Search className="w-3 h-3 text-slate-400" />
                                            <span className="font-medium">{query}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Sources Consulted */}
                        {plan.research_summary?.sources_consulted && plan.research_summary.sources_consulted.length > 0 && (
                            <div>
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                    Sources Consulted ({plan.research_summary.sources_consulted.length})
                                </p>
                                <div className="space-y-2">
                                    {plan.research_summary.sources_consulted.slice(0, 5).map((source, i) => (
                                        <a
                                            key={i}
                                            href={source.uri}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-start gap-2 p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 rounded-lg transition-colors group"
                                        >
                                            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-500 mt-0.5 shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-medium text-slate-900 group-hover:text-blue-600 truncate">
                                                    {source.title || 'Documentation'}
                                                </div>
                                                <div className="text-xs text-slate-500 truncate mt-0.5">
                                                    {source.uri}
                                                </div>
                                            </div>
                                        </a>
                                    ))}
                                    {plan.research_summary.sources_consulted.length > 5 && (
                                        <div className="text-xs text-slate-400 text-center py-2">
                                            +{plan.research_summary.sources_consulted.length - 5} more sources
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}

            {/* Phases Timeline */}
            <motion.div variants={item} className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-500" />
                    Execution Phases ({plan.phases.length} steps)
                </h3>
                <div className="space-y-3">
                    {plan.phases.map((phase, idx) => (
                        <PhaseCard
                            key={phase.id}
                            phase={phase}
                            index={idx}
                            isExpanded={expandedPhase === phase.id}
                            onToggle={() => setExpandedPhase(expandedPhase === phase.id ? null : phase.id)}
                        />
                    ))}
                </div>
            </motion.div>

        </motion.div>
    );
}

// Phase Card Component
function PhaseCard({
    phase,
    index,
    isExpanded,
    onToggle
}: {
    phase: PlanPhase;
    index: number;
    isExpanded: boolean;
    onToggle: () => void;
}) {
    return (
        <motion.div
            layout
            className={cn(
                "rounded-xl border transition-all cursor-pointer overflow-hidden",
                isExpanded
                    ? "bg-blue-50/50 border-blue-200 shadow-sm"
                    : "bg-gray-50 border-gray-200 hover:border-gray-300"
            )}
            onClick={onToggle}
        >
            <div className="p-4 flex items-start gap-4">
                {/* Phase number */}
                <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0",
                    isExpanded
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-600"
                )}>
                    {phase.id}
                </div>

                <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 text-sm">{phase.title}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{phase.description}</p>

                    {/* Expanded content */}
                    {isExpanded && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 space-y-6"
                        >
                            {/* Instructions */}
                            {phase.instructions?.length > 0 && (
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Technical Guidance</p>
                                    <div className="bg-white/50 rounded-lg p-3 border border-slate-100">
                                        <ul className="space-y-2">
                                            {phase.instructions.map((ins, i) => (
                                                <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                                                    <div className="w-1 h-1 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                                                    {ins}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {/* Files */}
                            {phase.files_impacted?.length > 0 && (
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">File Transformations</p>
                                    <div className="space-y-1.5">
                                        {phase.files_impacted.map((file, i) => (
                                            <div key={i} className="flex flex-col p-2 bg-white border border-slate-100 rounded-md text-[11px]">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-mono text-slate-400">../source/{file.source}</span>
                                                    <ArrowRight className="w-3 h-3 text-slate-300" />
                                                    <span className="font-mono text-blue-600 font-bold">./target/{file.target}</span>
                                                </div>
                                                <p className="text-slate-500 italic">“{file.reason}”</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Verification */}
                            {phase.verification && (
                                <div className="bg-emerald-50/50 rounded-lg p-3 border border-emerald-100">
                                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                        <ShieldCheck className="w-3 h-3" />
                                        Success Gate
                                    </p>
                                    <div className="space-y-2">
                                        <div className="text-xs text-emerald-800">
                                            <span className="font-bold">Goal:</span> {phase.verification.success_criteria}
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {phase.verification.test_commands.map((cmd, i) => (
                                                <code key={i} className="px-1.5 py-0.5 bg-white border border-emerald-200 rounded text-[10px] font-mono text-emerald-600">
                                                    {cmd}
                                                </code>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </div>

                {/* Chevron indicator */}
                <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center transition-transform",
                    isExpanded ? "rotate-90" : ""
                )}>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
            </div>
        </motion.div>
    );
}
