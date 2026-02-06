"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Github, ArrowRight, Terminal, Loader2, LogOut, GitFork, Star, Calendar, Code2, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { github, type UserInfo, type RepoInfo } from "@/lib/api";

// Backend URL for direct API calls (analysis, migrations)
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Use types from API client
type GitHubUser = UserInfo;

// Extended repo type with owner for display
interface Repository extends RepoInfo {
    owner: {
        avatar_url: string;
    };
}

// Fallback Mock Data for demo reliability
const MOCK_ANALYSIS = {
    detected_stack: "Node.js (Native HTTP)",
    complexity_score: 45,
    complexity_reason: "Manual routing and callback-based async flow detected in src/server.js",
    insight_title: "O(N) Sequential Performance Bottleneck",
    insight_detail: "I found a sequential loop in portfolio.js that fetches prices one-by-one. In a modern architecture, we would use Promise.all to achieve O(1) concurrent latency.",
    migration_paths: [
        {
            id: "ts_fastify",
            title: "Fastify + TypeScript",
            description: "High-performance modernization with schema validation and type safety.",
            recommended: true
        },
        {
            id: "express_classic",
            title: "Express Modernization",
            description: "Upgrade to latest Express with ESModules and refined folder structure.",
            recommended: false
        },
        {
            id: "bun_native",
            title: "Bun Native Port",
            description: "Maximum performance swap to the Bun runtime using native APIs.",
            recommended: false
        }
    ]
};

export default function ConnectPage() {
    const router = useRouter();
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState<GitHubUser | null>(null);
    const [repos, setRepos] = useState<Repository[]>([]);
    const [repoSearch, setRepoSearch] = useState("");

    // Concierge Modal State
    const [isStartModalOpen, setIsStartModalOpen] = useState(false);
    const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
    const [isCloning, setIsCloning] = useState(false);
    const [cloningStep, setCloningStep] = useState("");

    // Strategic Analysis State
    const [showAnalysis, setShowAnalysis] = useState(false);
    const [analysisData, setAnalysisData] = useState<any>(null);

    // Check connection status on mount
    useEffect(() => {
        checkStatus();
    }, []);

    // Fetch repos when user is connected (Step 2)
    useEffect(() => {
        if (step === 2 && user) {
            fetchRepos();
        }
    }, [step, user]);

    const checkStatus = async () => {
        try {
            const data = await github.getStatus();
            if (data.connected && data.user) {
                setUser(data.user);
                setStep(2);
            }
        } catch (err) {
            console.error("Failed to check status", err);
        }
    };

    const handleConnect = async () => {
        setIsLoading(true);
        try {
            const data = await github.getAuthUrl();
            if (data.auth_url) {
                window.location.href = data.auth_url;
            }
        } catch (err) {
            console.error("Failed to initiate auth", err);
            setIsLoading(false);
        }
    };

    const handleDisconnect = async () => {
        try {
            await github.disconnect();
            setUser(null);
            setStep(1);
        } catch (err) {
            console.error("Failed to disconnect", err);
        }
    };

    const fetchRepos = async () => {
        try {
            const data = await github.getRepos({ per_page: 100 });
            // Add owner avatar from user (API returns flat repo, not nested owner)
            const reposWithOwner = data.repos.map(repo => ({
                ...repo,
                owner: { avatar_url: user?.avatar_url || '' }
            }));
            setRepos(reposWithOwner);
        } catch (err) {
            console.error("Failed to fetch repos", err);
        }
    };

    const openStartModal = (repo: Repository) => {
        setSelectedRepo(repo);
        setIsStartModalOpen(true);
        setIsCloning(false);
        setShowAnalysis(false);
    };

    const detectStack = async (repo: Repository) => {
        setIsCloning(true);
        setCloningStep("Initializing Kandra Neural Engine...");

        try {
            const steps = [
                "Cloning repository...",
                "Reading file headers...",
                "Building 1M Context Window...",
                "Injecting into Gemini 3 Flash...",
                "Awaiting Neural Analysis..."
            ];

            // Visual Progress simulation
            for (let i = 0; i < steps.length - 1; i++) {
                setCloningStep(steps[i]);
                await new Promise(r => setTimeout(r, 600));
            }

            setCloningStep(steps[steps.length - 1]);

            // Dynamic Cloning & Analysis Flow
            const res = await fetch(`${API_URL}/api/analyze`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    clone_url: repo.clone_url,
                    repo_name: repo.name
                })
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ detail: "Neural Engine failure" }));
                throw new Error(errorData.detail || `HTTP ${res.status}`);
            }

            const data = await res.json();
            setAnalysisData(data);

            // Transition to Analysis Phase
            setTimeout(() => {
                setShowAnalysis(true);
                setIsCloning(false);
            }, 300);

        } catch (error: any) {
            console.error("[Connect] Logic Error:", error);
            setIsCloning(false);
            setCloningStep("Error: " + error.message);
        }
    };

    const handleStartMigration = async () => {
        if (!selectedRepo) return;
        await detectStack(selectedRepo);
    };

    const handleSelectStack = async (stackId: string) => {
        if (!selectedRepo || !analysisData) return;

        try {
            const res = await fetch(`${API_URL}/api/jobs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    repo_url: selectedRepo.clone_url,
                    repo_name: selectedRepo.name,
                    target_stack: stackId,
                    workspace_path: analysisData.workspace_path
                })
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({ detail: "Job creation failed" }));
                throw new Error(err.detail || `HTTP ${res.status}`);
            }

            const data = await res.json();

            // Store analysis data for the migrate page to use when triggering planning
            if (analysisData) {
                sessionStorage.setItem(`analysis_${data.id}`, JSON.stringify(analysisData));
            }

            router.push(`/migrate?job_id=${data.id}`);
        } catch (err) {
            console.error("Migration Error:", err);
            // Fallback for safety
            router.push("/migrate");
        }
    };

    // Filter repos
    const filteredRepos = repos.filter(repo =>
        repo.name.toLowerCase().includes(repoSearch.toLowerCase())
    );

    // Color/Icon mapping for common languages
    const getLanguageColor = (lang?: string) => {
        const lower = lang?.toLowerCase() || "";
        if (lower.includes("typescript")) return "bg-blue-500";
        if (lower.includes("javascript")) return "bg-yellow-400";
        if (lower.includes("python")) return "bg-green-500";
        if (lower.includes("rust")) return "bg-orange-600";
        if (lower.includes("go")) return "bg-cyan-500";
        return "bg-gray-400";
    };

    // Generate a deterministic percentage for "Top Stack" (Visual flair)
    const getStackPercentage = (id: number) => {
        return 85 + (id % 14); // Returns 85% - 98%
    };

    const getLanguageLogo = (lang?: string) => {
        if (!lang) return null;
        const lower = lang.toLowerCase();
        const aliases: Record<string, string> = {
            "c++": "cplusplus",
            "c#": "csharp",
            "vue": "vuejs",
            "html": "html5",
            "css": "css3",
            "shell": "bash",
            "jupyter notebook": "jupyter",
            "scss": "sass",
        };

        const name = aliases[lower] || lower;
        return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${name}/${name}-original.svg`;
    };

    const RepoCard = ({ repo }: { repo: Repository }) => (
        <div
            onClick={() => openStartModal(repo)}
            className="group relative p-4 rounded-xl border border-border hover:border-blue-500/40 bg-card hover:bg-blue-50/10 cursor-pointer transition-all duration-300 hover:shadow-md overflow-hidden flex items-stretch"
        >
            <div className="absolute bottom-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <div className="flex items-center space-x-1 text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full backdrop-blur-sm shadow-sm border border-blue-200/50">
                    <span>Select</span>
                    <ArrowRight className="w-3 h-3" />
                </div>
            </div>

            {/* Left: Avatar */}
            <div className="mr-4 flex-shrink-0 pt-1">
                <img
                    src={repo.owner.avatar_url}
                    alt={repo.full_name}
                    className="w-10 h-10 rounded-lg border border-border/50 shadow-sm object-cover"
                />
            </div>

            {/* Middle: Content */}
            <div className="flex-grow min-w-0 pr-4 flex flex-col justify-between">
                <div>
                    <div className="flex items-center justify-between mb-0.5">
                        <h3 className="font-semibold text-sm text-foreground group-hover:text-blue-600 transition-colors truncate pr-16 opacity-90">
                            {repo.name}
                        </h3>
                        {repo.private && (
                            <GitFork className="w-3 h-3 text-muted-foreground/50 shrink-0" />
                        )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1 opacity-70 mb-2 font-light">
                        {repo.description || "No description provided"}
                    </p>
                </div>

                <div className="flex items-center text-[10px] text-muted-foreground space-x-3 opacity-80">
                    <div className="flex items-center">
                        <Star className="w-3 h-3 mr-1 opacity-70" />
                        {repo.stargazers_count}
                    </div>
                    <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1 opacity-70" />
                        {formatDistanceToNow(new Date(repo.updated_at), { addSuffix: true })}
                    </div>
                </div>
            </div>

            {/* Right: Creative Stack Bar */}
            {
                repo.language && (
                    <div className="w-[80px] flex-shrink-0 flex flex-col justify-center items-end border-l border-border/40 pl-4 my-[-8px] py-2">
                        <div className="flex items-center justify-end mb-1 space-x-1.5">
                            <div className="text-[10px] font-bold text-foreground text-right">
                                {repo.language}
                            </div>
                            {getLanguageLogo(repo.language) && (
                                <img
                                    src={getLanguageLogo(repo.language)!}
                                    alt={repo.language}
                                    className="w-3 h-3 object-contain"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                />
                            )}
                        </div>
                        <div className="w-full h-1.5 bg-muted/50 rounded-full overflow-hidden mb-1">
                            <div
                                className={cn("h-full rounded-full", getLanguageColor(repo.language))}
                                style={{ width: `${getStackPercentage(repo.id)}%` }}
                            />
                        </div>
                        <div className="text-[9px] text-muted-foreground/80 font-mono">
                            {getStackPercentage(repo.id)}%
                        </div>
                    </div>
                )
            }
        </div >
    );

    const StackOption = ({ title, desc, recommended, onClick }: { title: string, desc: string, recommended?: boolean, onClick: () => void }) => (
        <div
            onClick={onClick}
            className={cn(
                "relative p-4 rounded-xl border cursor-pointer transition-all duration-300 hover:shadow-md",
                recommended
                    ? "border-blue-500 bg-blue-50/50 hover:bg-blue-50"
                    : "border-border bg-card hover:bg-muted/50"
            )}
        >
            {recommended && (
                <div className="absolute -top-2.5 right-4 px-2 py-0.5 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">
                    Recommended
                </div>
            )}
            <h3 className="font-semibold text-sm mb-1">{title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
        </div>
    );

    const [isModalOpen, setIsModalOpen] = useState(false);

    // Sort logic
    const [sortOption, setSortOption] = useState<'updated' | 'stars' | 'name'>('updated');

    const getSortedRepos = (reposToSort: Repository[]) => {
        return [...reposToSort].sort((a, b) => {
            if (sortOption === 'updated') return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
            if (sortOption === 'stars') return b.stargazers_count - a.stargazers_count;
            if (sortOption === 'name') return a.name.localeCompare(b.name);
            return 0;
        });
    };

    const sortedFilteredRepos = getSortedRepos(filteredRepos);
    const visibleRepos = sortedFilteredRepos.slice(0, 4);

    return (
        <div className="min-h-screen w-full flex flex-col lg:flex-row bg-background text-foreground overflow-hidden">
            {/* LEFT PANEL - Functional */}
            <div className="w-full lg:w-[50%] flex flex-col justify-between p-8 lg:p-12 relative z-10 bg-background/95 backdrop-blur-sm transition-colors duration-300">

                {/* Header / Stepper */}
                <div className="w-full max-w-[500px] mx-auto pt-4 lg:pt-10">
                    <div className="flex items-center space-x-4 mb-8 lg:mb-12 text-sm font-medium text-muted-foreground">
                        <span className={cn("flex items-center justify-center w-6 h-6 rounded-full border transition-all duration-300", step >= 1 ? "border-blue-500 text-blue-600 bg-blue-50" : "border-border")}>1</span>
                        <div className={cn("h-[1px] w-8 transition-colors duration-300", step >= 2 ? "bg-blue-500" : "bg-border")} />
                        <span className={cn("flex items-center justify-center w-6 h-6 rounded-full border transition-all duration-300", step >= 2 ? "border-blue-500 text-blue-600 bg-blue-50" : "border-border")}>2</span>
                        <div className={cn("h-[1px] w-8 transition-colors duration-300", step >= 3 ? "bg-blue-500" : "bg-border")} />
                        <span className={cn("flex items-center justify-center w-6 h-6 rounded-full border transition-all duration-300", step >= 3 ? "border-blue-500 text-blue-600 bg-blue-50" : "border-border")}>3</span>
                    </div>

                    <div className="space-y-2 mb-10">
                        <h1 className="text-3xl font-semibold tracking-tight">
                            {step === 1 ? "Connect to Git" : "Select Repository"}
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            {step === 1 ? "Connect a repository to start the analysis." : "Choose the codebase you want to migrate."}
                        </p>
                    </div>

                    {/* STEP 1: CONNECT BUTTONS */}
                    {step === 1 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <button
                                onClick={handleConnect}
                                disabled={isLoading}
                                className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center space-x-3 font-medium transition-all transform active:scale-[0.98] cursor-pointer disabled:opacity-70 shadow-lg hover:shadow-xl"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Github className="w-5 h-5" />
                                )}
                                <span>{isLoading ? "Connecting..." : "Connect with GitHub"}</span>
                            </button>

                            <div className="relative flex py-2 items-center">
                                <div className="flex-grow border-t border-border"></div>
                                <span className="flex-shrink-0 mx-4 text-muted-foreground text-xs uppercase">Or</span>
                                <div className="flex-grow border-t border-border"></div>
                            </div>

                            <button
                                onClick={() => setStep(3)}
                                className="w-full h-14 bg-background border border-border hover:bg-muted/50 rounded-xl flex items-center justify-center space-x-3 font-medium text-foreground transition-all transform active:scale-[0.98] cursor-pointer"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-link"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
                                <span>Paste Repository URL</span>
                            </button>
                        </div>
                    )}

                    {/* STEP 2: REPO LIST (GitHub) */}
                    {step === 2 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-500">
                            {user && (
                                <div className="flex items-center justify-between p-3 bg-muted/20 border border-border rounded-lg mb-6 backdrop-blur-sm">
                                    <div className="flex items-center space-x-3">
                                        <img src={user.avatar_url} alt={user.login} className="w-8 h-8 rounded-full border border-border" />
                                        <div className="text-sm">
                                            <p className="font-medium text-foreground">{user.name || user.login}</p>
                                            <div className="flex items-center text-xs text-muted-foreground">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>
                                                Connected via OAuth
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={handleDisconnect} className="p-2 hover:bg-red-50 rounded-md text-muted-foreground hover:text-red-500 transition-colors" title="Disconnect">
                                        <LogOut className="w-4 h-4" />
                                    </button>
                                </div>
                            )}

                            <div className="relative sticky top-0 z-20 bg-background/95 pb-4 backdrop-blur-sm">
                                <input
                                    type="text"
                                    value={repoSearch}
                                    onChange={(e) => setRepoSearch(e.target.value)}
                                    placeholder="Search repositories..."
                                    className="w-full h-12 px-4 pl-11 rounded-xl border border-input bg-background/50 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none text-sm transition-all shadow-sm"
                                />
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-4 top-4 text-blue-500/50"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                            </div>

                            <div className="space-y-3 mt-2 pr-2">
                                {repos.length === 0 ? (
                                    <div className="text-center py-12 text-muted-foreground text-sm flex flex-col items-center">
                                        <Loader2 className="w-8 h-8 animate-spin mb-3 text-primary/50" />
                                        <span>Fetching repositories from GitHub...</span>
                                    </div>
                                ) : visibleRepos.length === 0 ? (
                                    <div className="text-center py-12 text-muted-foreground text-sm">
                                        No repositories found matching "{repoSearch}".
                                    </div>
                                ) : (
                                    <>
                                        {visibleRepos.map((repo) => (
                                            <RepoCard key={repo.id} repo={repo} />
                                        ))}

                                        {filteredRepos.length > 4 && (
                                            <button
                                                onClick={() => setIsModalOpen(true)}
                                                className="w-full py-4 my-2 bg-muted/30 hover:bg-muted/50 border border-dashed border-border rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground transition-all flex items-center justify-center space-x-2 group"
                                            >
                                                <span>Load more</span>
                                                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {/* MODAL: REPOSITORY EXPLORER */}
                    {isModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
                            {/* Backdrop */}
                            <div
                                className="absolute inset-0 bg-background/80 backdrop-blur-md"
                                onClick={() => setIsModalOpen(false)}
                            />

                            {/* Modal Content */}
                            <div className="relative w-full max-w-4xl max-h-[85vh] bg-background/95 border border-border shadow-2xl rounded-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                                {/* Header */}
                                <div className="flex items-center justify-between p-6 border-b border-border bg-muted/10">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                            <Terminal className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-semibold">Repository Explorer</h2>
                                            <p className="text-sm text-muted-foreground">Select a repository to migrate</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="p-2 hover:bg-muted rounded-full transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-muted-foreground"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                    </button>
                                </div>

                                {/* Controls */}
                                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 border-b border-border bg-background">
                                    <div className="relative flex-grow w-full">
                                        <input
                                            type="text"
                                            value={repoSearch}
                                            onChange={(e) => setRepoSearch(e.target.value)}
                                            placeholder="Filter repositories..."
                                            className="w-full h-10 px-4 pl-10 rounded-lg border border-input bg-muted/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition-all shadow-sm"
                                            autoFocus
                                        />
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-3 text-muted-foreground"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                                    </div>

                                    <div className="flex items-center space-x-2 w-full sm:w-auto">
                                        <select
                                            value={sortOption}
                                            onChange={(e) => setSortOption(e.target.value as any)}
                                            className="h-10 px-3 rounded-lg border border-input bg-background/50 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer"
                                        >
                                            <option value="updated">Last Updated</option>
                                            <option value="stars">Most Stars</option>
                                            <option value="name">Name (A-Z)</option>
                                        </select>
                                    </div>
                                </div>

                                {/* List Grid */}
                                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-secondary/5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {sortedFilteredRepos.map((repo) => (
                                            <RepoCard key={repo.id} repo={repo} />
                                        ))}
                                        {sortedFilteredRepos.length === 0 && (
                                            <div className="col-span-full py-12 text-center text-muted-foreground">
                                                No matches found.
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="p-3 border-t border-border bg-muted/10 text-xs text-center text-muted-foreground">
                                    Showing {sortedFilteredRepos.length} repositories
                                </div>
                            </div>
                        </div>
                    )}

                    {/* START MIGRATION MODAL (CONCIERGE STYLE with 2 PHASES) */}
                    {isStartModalOpen && selectedRepo && (
                        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-300">
                            <div
                                className="absolute inset-0 bg-background/80 backdrop-blur-md"
                                onClick={() => !isCloning && !showAnalysis && setIsStartModalOpen(false)}
                            />

                            <div className={cn(
                                "relative w-full bg-background border border-border shadow-2xl rounded-2xl overflow-hidden transition-all duration-500 ease-in-out",
                                showAnalysis ? "max-w-2xl" : "max-w-lg"
                            )}>
                                {!showAnalysis ? (
                                    // PHASE 1: CLONE & INIT
                                    <div className="p-8 animate-in slide-in-from-left-5 duration-300">
                                        <div className="flex items-start justify-between mb-6">
                                            <div>
                                                <h2 className="text-2xl font-semibold tracking-tight mb-2">Ready to modernize?</h2>
                                                <p className="text-muted-foreground">
                                                    I can prepare a secure workspace for <span className="font-medium text-foreground">{selectedRepo.name}</span> and begin the architectural analysis.
                                                </p>
                                            </div>
                                            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
                                                <Code2 className="w-6 h-6 text-blue-600" />
                                            </div>
                                        </div>

                                        <div className="bg-muted/30 rounded-lg p-4 mb-8 border border-border/50">
                                            <div className="flex items-center space-x-3 mb-3">
                                                <img src={selectedRepo.owner.avatar_url} alt="" className="w-6 h-6 rounded-md" />
                                                <span className="font-medium text-sm">{selectedRepo.full_name}</span>
                                            </div>
                                            <div className="space-y-1 text-xs text-muted-foreground">
                                                <div className="flex justify-between">
                                                    <span>Language</span>
                                                    <span className="font-mono">{selectedRepo.language || 'Unknown'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Last Updated</span>
                                                    <span>{formatDistanceToNow(new Date(selectedRepo.updated_at), { addSuffix: true })}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {isCloning ? (
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-xs font-medium">
                                                        <span className="text-blue-600 animate-pulse">{cloningStep}</span>
                                                        <span className="text-blue-500/60">Do not close window</span>
                                                    </div>
                                                    <div className="h-2 w-full bg-blue-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-blue-600 animate-progress-indeterminate rounded-full shadow-[0_0_8px_rgba(37,99,235,0.4)]" />
                                                    </div>
                                                </div>
                                                <div className="flex justify-center pt-2">
                                                    <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center space-x-3 pt-2">
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setIsStartModalOpen(false);
                                                    }}
                                                    className="flex-1 h-11 rounded-lg border border-input hover:bg-muted font-medium transition-colors cursor-pointer"
                                                >
                                                    Not now
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleStartMigration();
                                                    }}
                                                    className="flex-1 h-11 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium transition-colors shadow-sm flex items-center justify-center cursor-pointer"
                                                >
                                                    Start Session
                                                    <ArrowRight className="w-4 h-4 ml-2" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    // PHASE 2: STRATEGIC ANALYSIS ("THE WAR ROOM")
                                    <div className="p-8 animate-in slide-in-from-right-10 duration-500">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                                                    <Star className="w-5 h-5 fill-current" />
                                                </div>
                                                <div>
                                                    <h2 className="text-xl font-semibold">Strategic Analysis</h2>
                                                    <p className="text-xs text-muted-foreground">Scan Complete • Neural Engine Active</p>
                                                </div>
                                            </div>
                                            <div className="px-2 py-1 bg-muted rounded text-[10px] font-mono text-muted-foreground">
                                                V3 • {selectedRepo.language}
                                            </div>
                                        </div>

                                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6 space-y-2">
                                            <div className="flex items-start space-x-3">
                                                <div className="mt-0.5">
                                                    <Bot className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <div className="text-sm">
                                                    <p className="font-bold text-blue-600 mb-1 uppercase text-[10px] tracking-wider">Agent Insight</p>
                                                    <p className="font-semibold text-foreground mb-1">{analysisData?.insight_title}</p>
                                                    <p className="text-muted-foreground text-xs leading-relaxed">
                                                        {analysisData?.insight_detail}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Target Migration Protocols</h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                                            {analysisData?.migration_paths?.map((path: any) => (
                                                <StackOption
                                                    key={path.id}
                                                    title={path.title}
                                                    desc={path.description}
                                                    recommended={path.recommended}
                                                    onClick={() => handleSelectStack(path.id)}
                                                />
                                            ))}
                                            {!analysisData?.migration_paths && (
                                                <>
                                                    <StackOption title="Python (FastAPI)" desc="Best for data-heavy apps." recommended={true} onClick={() => handleSelectStack("python")} />
                                                    <StackOption title="Node.js (NestJS)" desc="Standard modernization." onClick={() => handleSelectStack("node")} />
                                                </>
                                            )}
                                        </div>

                                        <div className="text-center">
                                            <button
                                                onClick={() => setIsStartModalOpen(false)}
                                                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                                            >
                                                Cancel and return to dashboard
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-500">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Repository URL</label>
                                <input
                                    type="text"
                                    placeholder="https://github.com/username/repo"
                                    className="w-full h-12 px-4 rounded-xl border border-input bg-background/50 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none text-sm transition-all"
                                />
                            </div>
                            <Link href="/migrate">
                                <button className="w-full h-14 mt-4 bg-blue-600 text-white hover:bg-blue-700 rounded-xl flex items-center justify-center space-x-2 font-medium transition-all transform active:scale-[0.98] cursor-pointer">
                                    <span>Analyze Repository</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </Link>
                            <div className="pt-2 text-center">
                                <button onClick={() => setStep(1)} className="text-sm text-muted-foreground hover:text-foreground cursor-pointer">
                                    Back to options
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Alert */}
                <div className="w-full max-w-[500px] mx-auto">
                    <div className="bg-muted/40 border border-border rounded-lg p-4 text-xs text-muted-foreground leading-relaxed">
                        <strong>$100 in free credits</strong> when you connect a repository for the first time.
                        Limited time offer for beta users.
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL - Branding/Visual */}
            <div className="hidden lg:flex w-full lg:w-[50%] bg-slate-950 relative items-center justify-center overflow-hidden">
                {/* Gradient Mesh Background */}
                <div className="absolute inset-0 w-full h-full opacity-60">
                    <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-purple-600/30 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] left-[-20%] w-[800px] h-[800px] bg-orange-500/20 rounded-full blur-[120px]" />
                    <div className="absolute top-[40%] left-[20%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px]" />
                </div>

                {/* Floating Content */}
                <div className="relative z-10 w-full max-w-[500px] p-8 space-y-8">
                    {/* Mockup Card (Glassmorphism) */}
                    <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl p-6 transform rotate-[-2deg] hover:rotate-0 transition-transform duration-700 ease-out">
                        <div className="flex items-center space-x-2 mb-6 border-b border-white/10 pb-4">
                            <div className="w-3 h-3 rounded-full bg-red-500/80" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                            <div className="w-3 h-3 rounded-full bg-green-500/80" />
                            <div className="ml-4 text-[10px] text-white/40 font-mono">kandra-agent — analysis</div>
                        </div>

                        <div className="space-y-3 font-mono text-sm">
                            <div className="flex items-center text-green-400">
                                <Terminal className="w-4 h-4 mr-2" />
                                <span>analyzing project structure...</span>
                            </div>
                            <div className="text-white/60 pl-6">
                                found 24 api routes
                            </div>
                            <div className="text-white/60 pl-6">
                                detected legacy next.js patterns
                            </div>
                            <div className="text-white/60 pl-6">
                                identified 3 potential breaking changes
                            </div>
                            <div className="flex items-center text-green-400 pt-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-2" />
                                <span>generation plan ready</span>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
                            <div className="text-xs text-white/40">Migration Estimation: <span className="text-white">2m 30s</span></div>
                            <div className="px-3 py-1 rounded-full bg-white/10 text-xs text-white border border-white/10">
                                High Confidence
                            </div>
                        </div>
                    </div>

                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-semibold text-white tracking-tight">
                            Legacy code to modern ship.
                        </h2>
                        <p className="text-white/50 text-base max-w-[80%] mx-auto">
                            Transition seamlessly with Kandra's automated migration agent.
                        </p>
                    </div>
                </div>

                {/* Floating Chat Bubble Mockup */}
                <div className="absolute bottom-12 right-12 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer border border-blue-400/50">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
                </div>
            </div>
        </div>
    );
}
