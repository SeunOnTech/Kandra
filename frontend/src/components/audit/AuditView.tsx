"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ShieldCheck,
    FileText,
    Github,
    Download,
    CheckCircle2,
    BarChart3,
    Layers,
    Search,
    FileCode,
    Share2,
    Lock,
    Zap,
    ScrollText,
    ExternalLink,
    ChevronRight,
    ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

import { api } from "@/lib/api";
import ReactMarkdown from "react-markdown";
import { MermaidDiagram } from "@/components/MermaidDiagram";

// === Constants ===

const AUDIT_METRICS_DEFAULT = [
    { label: "Logic Parity", value: "---", detail: "Pending certification...", icon: Layers, color: "text-gray-400", bg: "bg-gray-50" },
    { label: "Test Coverage", value: "---", detail: "Analyzing...", icon: BarChart3, color: "text-gray-400", bg: "bg-gray-50" },
    { label: "Security Scan", value: "---", detail: "Scanning...", icon: ShieldCheck, color: "text-gray-400", bg: "bg-gray-50" },
    { label: "Type Safety", value: "---", detail: "Checking...", icon: Lock, color: "text-gray-400", bg: "bg-gray-50" },
];

export function AuditView({ jobId }: { jobId?: string }) {
    const [activeTab, setActiveTab] = useState<"summary" | "docs" | "git">("summary");

    // Data State
    const [loading, setLoading] = useState(true);
    const [report, setReport] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    // PR State
    const [repoUrl, setRepoUrl] = useState("");
    const [branchName, setBranchName] = useState("kandra/migration-refactor");
    const [submittingPr, setSubmittingPr] = useState(false);
    const [prSuccessUrl, setPrSuccessUrl] = useState<string | null>(null);

    // GitHub Connection State
    const [isGitHubConnected, setIsGitHubConnected] = useState(false);
    const [githubUser, setGithubUser] = useState<any>(null);
    const [checkingGitHub, setCheckingGitHub] = useState(true);

    React.useEffect(() => {
        if (!jobId) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                // Check GitHub Status first
                try {
                    const status = await api.github.getStatus();
                    setIsGitHubConnected(status.connected);
                    setGithubUser(status.user);
                } catch (e) {
                    console.error("Failed to check GitHub status:", e);
                } finally {
                    setCheckingGitHub(false);
                }

                // Fetch job info to pre-fill repo
                try {
                    const jobData = await api.jobs.get(jobId);
                    if (jobData) {
                        const cleanRepo = jobData.repo_url
                            .replace("https://github.com/", "")
                            .replace("http://github.com/", "")
                            .replace(".git", "")
                            .replace(/^\/+|\/+$/g, "");
                        setRepoUrl(cleanRepo);
                    }
                } catch (e) {
                    console.error("Failed to fetch job info:", e);
                }

                // Poll for audit report
                await new Promise(r => setTimeout(r, 1500));
                const data = await api.jobs.getAuditReport(jobId);
                setReport(data);
                setLoading(false);
            } catch (err: any) {
                console.error("Audit fetch failed:", err);
                setError(err.message || "Failed to load audit report");
                setLoading(false);
            }
        };

        fetchData();
    }, [jobId]);

    // Handle Download
    const handleDownload = () => {
        const downloadUrl = `${api.API_URL}/api/jobs/${jobId}/download`;
        window.location.href = downloadUrl;
    };

    const handleDownloadPDF = () => {
        const downloadUrl = `${api.API_URL}/api/jobs/${jobId}/audit/download-pdf`;
        window.location.href = downloadUrl;
    };

    // Handle GitHub Connection
    const handleConnectGitHub = async () => {
        try {
            const { auth_url } = await api.github.getAuthUrl();
            // Store current path for return
            sessionStorage.setItem("github_auth_return", window.location.pathname + window.location.search);
            window.location.href = auth_url;
        } catch (err: any) {
            alert("Failed to initiate GitHub connection: " + err.message);
        }
    };

    // Handle PR Submission
    const handleSubmitPR = async () => {
        if (!jobId) return;
        try {
            setSubmittingPr(true);
            const res = await api.jobs.submitAuditPR(jobId, repoUrl, branchName);
            setPrSuccessUrl(res.pr_url);
            setSubmittingPr(false);
        } catch (err: any) {
            alert("Failed to submit PR: " + err.message);
            setSubmittingPr(false);
        }
    };

    // Prepare Metrics for Render
    const metrics = report ? [
        { label: "Logic Parity", value: report.metrics.parity, detail: "All business logic verified", icon: Layers, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Test Coverage", value: report.metrics.coverage, detail: "Strict type coverage cert", icon: BarChart3, color: "text-emerald-600", bg: "bg-emerald-50" },
        { label: "Security Scan", value: report.metrics.security, detail: "No vulnerabilities found", icon: ShieldCheck, color: "text-purple-600", bg: "bg-purple-50" },
        { label: "Modernization", value: report.metrics.lift, detail: "Code complexity reduction", icon: Zap, color: "text-amber-600", bg: "bg-amber-50" },
    ] : AUDIT_METRICS_DEFAULT;

    // Loading State
    if (loading) {
        return (
            <div className="h-full flex flex-col items-center justify-center bg-gray-50/50">
                <div className="flex flex-col items-center gap-6">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-full border-4 border-gray-200 border-t-blue-600 animate-spin" />
                        <ShieldCheck className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-blue-600" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Certifying Migration...</h3>
                        <p className="text-gray-500 text-sm">Running logic parity checks and security scans</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-full flex items-center justify-center text-red-500 p-8 text-center">
                <div>
                    <h3 className="text-lg font-bold mb-2">Certification Failed</h3>
                    <p className="text-sm">{error}</p>
                    <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-red-100 rounded-lg text-red-700 font-bold text-xs hover:bg-red-200">RETRY AUDIT</button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-gray-50/50">
            {/* Phase Hero */}
            <div className="p-8 bg-white border-b border-gray-200">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-3xl bg-emerald-500 shadow-2xl shadow-emerald-200 flex items-center justify-center text-white">
                            <ShieldCheck className="w-8 h-8" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">System Certified</span>
                                <span className="text-gray-300">•</span>
                                <span className="text-gray-500 text-xs">ID: {jobId || "KNDR-992"}</span>
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Migration Certification</h2>
                            <p className="text-gray-500 text-sm mt-1">Your code has been audited, verified, and is ready for production delivery.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleDownload}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
                        >
                            <Download className="w-4 h-4" />
                            Download Code (ZIP)
                        </button>
                        <button
                            onClick={() => setActiveTab("git")}
                            className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-blue-600 rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all active:scale-95"
                        >
                            <Github className="w-4 h-4" />
                            Deploy to GitHub
                        </button>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white border-b border-gray-200 px-8">
                <div className="max-w-6xl mx-auto flex gap-8">
                    {["summary", "docs", "git"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={cn(
                                "py-4 text-sm font-bold capitalize transition-all relative",
                                activeTab === tab ? "text-blue-600" : "text-gray-400 hover:text-gray-600"
                            )}
                        >
                            {tab}
                            {activeTab === tab && (
                                <motion.div
                                    layoutId="audit-tab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                                />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-12">
                <div className="max-w-6xl mx-auto">
                    <AnimatePresence mode="wait">
                        {activeTab === "summary" && (
                            <motion.div
                                key="summary"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-12"
                            >
                                {/* Bento Grid - Scorecard */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {metrics.map((metric, i) => (
                                        <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                                            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", metric.bg)}>
                                                <metric.icon className={cn("w-6 h-6", metric.color)} />
                                            </div>
                                            <div className="text-3xl font-black text-gray-900 mb-1">{metric.value}</div>
                                            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">{metric.label}</div>
                                            <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                                                <span className="text-[10px] text-gray-500 font-medium">{metric.detail}</span>
                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Main Content Bento */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {/* Detailed Audit Logs */}
                                    <div className="lg:col-span-2 space-y-6">
                                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                                            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                                                <h3 className="font-bold text-gray-900">Audit Verification Logs</h3>
                                                <div className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded">LIVE FEED</div>
                                            </div>
                                            <div className="divide-y divide-gray-50">
                                                {report?.logs?.map((log: any) => (
                                                    <div key={log.id} className="p-6 flex gap-4 hover:bg-gray-50/50 transition-all">
                                                        <div className={cn(
                                                            "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                                                            log.type === "success" ? "bg-emerald-50 text-emerald-500" : "bg-blue-50 text-blue-500"
                                                        )}>
                                                            {log.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <ScrollText className="w-5 h-5" />}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex justify-between items-start mb-1">
                                                                <h4 className="font-bold text-gray-900 text-sm">{log.title}</h4>
                                                                <span className="text-[10px] text-gray-400">{log.timestamp}</span>
                                                            </div>
                                                            <p className="text-gray-500 text-xs leading-relaxed">{log.description}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Logic Parity Visualization */}
                                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                                            <div className="flex items-center justify-between mb-8">
                                                <h3 className="font-bold text-gray-900">Critical Logic Mapping</h3>
                                                <button className="text-[10px] font-bold text-gray-400 flex items-center gap-1 hover:text-blue-500 transition-all">
                                                    VIEW MAP <ChevronRight className="w-3 h-3" />
                                                </button>
                                            </div>
                                            <div className="space-y-4">
                                                {report?.logic_map?.length > 0 ? (
                                                    report.logic_map.map((item: any, i: number) => (
                                                        <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                                            <div className="flex items-center gap-3">
                                                                <div className="px-2 py-1 bg-gray-200 rounded text-[9px] font-bold">SOURCE</div>
                                                                <span className="text-xs font-mono text-gray-600 truncate max-w-[150px]">{item.source}</span>
                                                            </div>
                                                            <ArrowRight className="w-4 h-4 text-gray-300" />
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-xs font-mono text-blue-600 truncate max-w-[150px]">{item.target}</span>
                                                                <div className={cn(
                                                                    "px-2 py-1 rounded text-[9px] font-bold text-center w-20",
                                                                    item.status === "MATCHED" ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600"
                                                                )}>
                                                                    {item.status}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="text-center py-8 text-gray-400 text-sm">
                                                        No logic mapping available for this scan.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Sidebar - Quick Actions/Stats */}
                                    <div className="space-y-8">
                                        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white relative overflow-hidden group shadow-xl">
                                            <Zap className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 rotate-12 group-hover:scale-110 transition-transform" />
                                            <h4 className="text-lg font-bold mb-2">Modernization Lift</h4>
                                            <p className="text-blue-100 text-xs mb-6 leading-relaxed opacity-80">
                                                {report?.lift_details?.details || "We refactored nested patterns into modern async/await structures, reducing total lines by 22% while maintaining 100% parity."}
                                            </p>
                                            <div className="text-4xl font-black mb-1">{report?.lift_details?.percent || 0}%</div>
                                            <div className="text-[10px] font-bold uppercase tracking-widest text-blue-200">Complexity Reduction</div>
                                        </div>

                                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                                            <h4 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                                                <ScrollText className="w-4 h-4 text-gray-400" />
                                                Next Steps
                                            </h4>
                                            <div className="space-y-4">
                                                {[
                                                    "Generate technical dossier",
                                                    "Push to GitHub Staging",
                                                    "Create interactive PR documentation",
                                                    "Notify team for review"
                                                ].map((step, i) => (
                                                    <div key={i} className="flex items-center gap-3 group cursor-pointer">
                                                        <div className="w-5 h-5 rounded-full border-2 border-gray-100 flex items-center justify-center flex-shrink-0 group-hover:border-blue-400 font-bold text-[9px] text-gray-400 group-hover:text-blue-500 transition-all">
                                                            {i + 1}
                                                        </div>
                                                        <span className="text-xs text-gray-500 group-hover:text-gray-900 transition-all">{step}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "docs" && (
                            <motion.div
                                key="docs"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                className="bg-white rounded-[2rem] border border-gray-200 shadow-2xl overflow-hidden flex flex-col h-[700px]"
                            >
                                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                                    <div className="flex items-center gap-4">
                                        <div className="flex gap-1.5">
                                            <div className="w-3 h-3 rounded-full bg-red-400/20" />
                                            <div className="w-3 h-3 rounded-full bg-amber-400/20" />
                                            <div className="w-3 h-3 rounded-full bg-emerald-400/20" />
                                        </div>
                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-gray-200/50 shadow-sm flex items-center gap-2">
                                            <FileText className="w-3 h-3" />
                                            MIGRATION_DOSSIER.md
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleDownloadPDF}
                                        className="text-[10px] font-bold text-blue-600 hover:text-blue-700 transition-all flex items-center gap-1.5"
                                    >
                                        <Download className="w-3.5 h-3.5" /> DOWNLOAD
                                    </button>
                                </div>
                                <div className="flex-1 p-12 overflow-y-auto font-serif prose prose-slate max-w-none">
                                    <div className="max-w-4xl mx-auto">
                                        {report?.dossier ? (
                                            <ReactMarkdown
                                                components={{
                                                    code({ node, inline, className, children, ...props }: any) {
                                                        const match = /language-(\w+)/.exec(className || "");
                                                        const lang = match ? match[1] : "";

                                                        if (!inline && lang === "mermaid") {
                                                            return <MermaidDiagram chart={String(children).replace(/\n$/, "")} />;
                                                        }

                                                        return (
                                                            <code className={className} {...props}>
                                                                {children}
                                                            </code>
                                                        );
                                                    }
                                                }}
                                            >
                                                {report.dossier}
                                            </ReactMarkdown>
                                        ) : (
                                            <p className="text-gray-400 italic">Generating dossier...</p>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "git" && (
                            <motion.div
                                key="git"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="grid grid-cols-1 lg:grid-cols-2 gap-12"
                            >
                                <div className="space-y-8">
                                    <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl relative overflow-hidden">
                                        <Github className="absolute top-8 right-8 w-12 h-12 text-gray-50 opacity-10" />
                                        <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Git Delivery</h3>
                                        <p className="text-gray-500 text-sm mb-8 leading-relaxed">Connect your repository to release the migration as a golden pull request.</p>

                                        {!prSuccessUrl ? (
                                            <div className="space-y-6">
                                                {!isGitHubConnected ? (
                                                    <div className="p-8 bg-blue-50 rounded-3xl border border-blue-100 flex flex-col items-center text-center">
                                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                                                            <Github className="w-6 h-6 text-blue-600" />
                                                        </div>
                                                        <h4 className="font-bold text-blue-900 mb-2">GitHub Not Connected</h4>
                                                        <p className="text-blue-700 text-xs mb-6 opacity-70">You need to connect your GitHub account to enable automated pull request delivery.</p>
                                                        <button
                                                            onClick={handleConnectGitHub}
                                                            className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all"
                                                        >
                                                            Connect GitHub
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-6">
                                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100 mb-2">
                                                            <img
                                                                src={githubUser?.avatar_url}
                                                                alt={githubUser?.login}
                                                                className="w-8 h-8 rounded-full border border-gray-200"
                                                            />
                                                            <div>
                                                                <div className="text-[10px] font-bold text-gray-400 leading-none">CONNECTED AS</div>
                                                                <div className="text-xs font-bold text-gray-900">{githubUser?.login}</div>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Repository Target</label>
                                                            <div className="relative group">
                                                                <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                                                <input
                                                                    type="text"
                                                                    placeholder="username/repository"
                                                                    value={repoUrl}
                                                                    onChange={(e) => setRepoUrl(e.target.value)}
                                                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Branch Name</label>
                                                            <div className="relative group">
                                                                <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                                                <input
                                                                    type="text"
                                                                    value={branchName}
                                                                    onChange={(e) => setBranchName(e.target.value)}
                                                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="pt-4">
                                                            <button
                                                                onClick={handleSubmitPR}
                                                                disabled={submittingPr}
                                                                className="w-full py-5 bg-gray-900 text-white font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-black transition-all hover:shadow-2xl hover:shadow-gray-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                                            >
                                                                {submittingPr ? (
                                                                    <>
                                                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                                        Submitting...
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Github className="w-5 h-5" />
                                                                        Submit Golden Pull Request
                                                                    </>
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                                <p className="text-center text-[10px] text-gray-400 mt-4 leading-relaxed font-medium capitalize flex items-center justify-center gap-1.5 opacity-60">
                                                    <Lock className="w-2.5 h-2.5" />
                                                    Private repository access is secured via temporary PAT
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-8 animate-in fade-in zoom-in duration-500">
                                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                                                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                                                </div>
                                                <h4 className="text-xl font-bold text-gray-900 mb-2">Pull Request Created!</h4>
                                                <a
                                                    href={prSuccessUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 font-bold hover:underline flex items-center gap-2"
                                                >
                                                    View on GitHub <ExternalLink className="w-4 h-4" />
                                                </a>
                                                <button
                                                    onClick={() => setPrSuccessUrl(null)}
                                                    className="mt-8 text-xs text-gray-400 hover:text-gray-600"
                                                >
                                                    Submit another PR
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div className="bg-emerald-600 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-emerald-200">
                                        <ShieldCheck className="absolute -right-8 -top-8 w-48 h-48 text-white/10 -rotate-12" />
                                        <h4 className="text-xl font-bold mb-4">Quality Assurance Badge</h4>
                                        <p className="text-emerald-100/80 text-sm leading-relaxed mb-8">This migration has been tagged with the **Certified by Kandra** badge, which can be embedded in your GitHub README to signal architectural compliance.</p>

                                        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-emerald-400 flex items-center justify-center text-white font-black italic">K</div>
                                                <div>
                                                    <div className="text-[10px] font-bold text-emerald-200 uppercase tracking-widest">CERTIFIED BY</div>
                                                    <div className="font-black text-lg">KANDRA ENGINE</div>
                                                </div>
                                            </div>
                                            <CheckCircle2 className="w-8 h-8 text-emerald-300" />
                                        </div>

                                        <button className="mt-8 text-xs font-bold text-white flex items-center gap-2 hover:translate-x-1 transition-transform">
                                            COPY MARKDOWN EMBED <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                                        <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <Share2 className="w-4 h-4 text-blue-500" />
                                            Collaboration
                                        </h4>
                                        <p className="text-gray-500 text-xs leading-relaxed mb-6">Invite team members to review the certification dossier before final merge.</p>
                                        <div className="flex items-center gap-3">
                                            <div className="flex -space-x-3">
                                                {[1, 2, 3].map(i => (
                                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-400">
                                                        {i === 3 ? "..." : `U${i}`}
                                                    </div>
                                                ))}
                                            </div>
                                            <button className="w-10 h-10 rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 hover:text-blue-500 hover:border-blue-500 transition-all">
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}


