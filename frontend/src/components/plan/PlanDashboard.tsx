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
            <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {[
                    { label: "Files to Modify", value: plan.stats.files_to_modify || 0, icon: FileCode, color: "blue" },
                    { label: "Files to Create", value: plan.stats.files_to_create || 0, icon: FilePlus, color: "emerald" },
                    { label: "Files to Delete", value: plan.stats.files_to_delete || 0, icon: FileX, color: "red" },
                    { label: "Deps to Add", value: plan.stats.dependencies_to_add || 0, icon: Package, color: "purple" },
                    { label: "Deps to Remove", value: plan.stats.dependencies_to_remove || 0, icon: Package, color: "amber" },
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
                    Transformation Overview
                </h3>
                <div className="flex items-center justify-center gap-8">
                    {/* Source */}
                    <div className="flex-1 text-center">
                        <div className="inline-flex flex-col items-center p-6 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200">
                            <div className="text-lg font-bold text-slate-900 mb-1">{plan.transformation.source.stack}</div>
                            <div className="text-sm text-slate-500 mb-3">{plan.transformation.source.language}</div>
                            <div className="flex flex-wrap gap-1 justify-center">
                                {plan.transformation.source.key_features.map((f, i) => (
                                    <span key={i} className="px-2 py-0.5 bg-slate-200 text-slate-600 text-xs rounded-full">{f}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Arrow */}
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-16 h-1 bg-gradient-to-r from-slate-300 via-blue-500 to-emerald-500 rounded-full" />
                        <ArrowRight className="w-6 h-6 text-blue-500" />
                    </div>

                    {/* Target */}
                    <div className="flex-1 text-center">
                        <div className="inline-flex flex-col items-center p-6 rounded-xl bg-gradient-to-br from-emerald-50 to-blue-50 border border-emerald-200">
                            <div className="text-lg font-bold text-emerald-900 mb-1">{plan.transformation.target.stack}</div>
                            <div className="text-sm text-emerald-600 mb-3">{plan.transformation.target.language}</div>
                            <div className="flex flex-wrap gap-1 justify-center">
                                {plan.transformation.target.key_features.map((f, i) => (
                                    <span key={i} className="px-2 py-0.5 bg-emerald-200 text-emerald-700 text-xs rounded-full">{f}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

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

            {/* Verification Checklist */}
            <motion.div variants={item} className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl border border-emerald-200 p-6">
                <h3 className="text-sm font-semibold text-emerald-900 mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Verification Checklist
                </h3>
                <ul className="space-y-2 mb-4">
                    {plan.verification.auto_checks.map((check, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-emerald-800">
                            <div className="w-5 h-5 rounded-full border-2 border-emerald-300 flex items-center justify-center mt-0.5 shrink-0">
                                <span className="text-xs text-emerald-500">{i + 1}</span>
                            </div>
                            {check}
                        </li>
                    ))}
                </ul>
                <div className="pt-3 border-t border-emerald-200">
                    <p className="text-xs text-emerald-600 font-medium">SUCCESS CRITERIA</p>
                    <p className="text-sm text-emerald-800 mt-1">{plan.verification.success_criteria}</p>
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
                "rounded-xl border transition-all cursor-pointer",
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
                            className="mt-4 space-y-4"
                        >
                            {/* Tasks */}
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Tasks</p>
                                <ul className="space-y-1.5">
                                    {phase.tasks.map((task, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                            <ArrowRight className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                                            {task}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Files */}
                            {phase.files_affected.length > 0 && (
                                <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Files Affected</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {phase.files_affected.map((file, i) => (
                                            <span key={i} className="px-2 py-1 bg-white border border-gray-200 rounded-md text-xs font-mono text-gray-600">
                                                {file}
                                            </span>
                                        ))}
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
