"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Play, Sparkles, Github, ChevronRight, CheckCircle2, Zap, Shield, Code2, Network, Terminal, Activity, FileCode, Server, Database, Layers, Cpu } from "lucide-react";

// ============================================================================
// HEADER COMPONENT (UNCHANGED)
// ============================================================================
function Header() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? "bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm"
                : "bg-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/30 transition-shadow">
                            <Code2 className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-xl font-bold text-slate-900 tracking-tight">Kandra</span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-8">
                        <Link href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Features</Link>
                        <Link href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">How It Works</Link>
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1.5">
                            <Github className="w-4 h-4" />
                            GitHub
                        </a>
                    </nav>
                    <div className="flex items-center gap-3">
                        <Link href="/connect" className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-full shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all hover:scale-[1.02] active:scale-[0.98]">
                            Try Kandra
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}

// ============================================================================
// MISSION CONTROL VISUALIZATION
// ============================================================================

// Simulated Terminal Logs
const TERMINAL_LOGS = [
    { type: "info", msg: "Kandra Agent Initialized v2.4.0" },
    { type: "info", msg: "Connecting to repository..." },
    { type: "success", msg: "Repository connected. 142 files found." },
    { type: "info", msg: "Analyzing dependency graph..." },
    { type: "warning", msg: "Detected legacy pattern: Callback Hell in /server/routes" },
    { type: "info", msg: "Generating migration plan (Strategy: Recursive)" },
    { type: "success", msg: "Plan approved. Starting execution phase." },
    { type: "exe", msg: ">> Migrating src/utils/db.js -> src/utils/db.ts" },
    { type: "success", msg: "✓ src/utils/db.ts compiled" },
    { type: "exe", msg: ">> Migrating src/api/user.js -> src/api/user.ts" },
    { type: "info", msg: "Running autonomous verification suite..." },
    { type: "success", msg: "✓ Test suite passed (45/45 tests)" },
    { type: "success", msg: "Migration complete. PR ready for review." },
];

function TerminalView() {
    const [logs, setLogs] = useState<typeof TERMINAL_LOGS>([]);
    const [isClient, setIsClient] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsClient(true);
        let index = 0;
        const interval = setInterval(() => {
            if (index < TERMINAL_LOGS.length) {
                const newLog = TERMINAL_LOGS[index];
                if (newLog) {
                    setLogs(prev => [...prev, newLog]);
                }
                index++;
                if (scrollRef.current) {
                    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                }
            } else {
                setLogs([]);
                index = 0;
            }
        }, 800);
        return () => clearInterval(interval);
    }, []);

    const getTime = () => {
        if (!isClient) return "00:00:00";
        return new Date().toLocaleTimeString('en-US', { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
    };

    return (
        <div className="bg-slate-900 rounded-xl overflow-hidden font-mono text-xs shadow-inner h-full flex flex-col border border-slate-800">
            <div className="flex items-center px-4 py-2 bg-slate-950 border-b border-slate-800">
                <Terminal className="w-3 h-3 text-slate-400 mr-2" />
                <span className="text-slate-400">Agent Terminal</span>
            </div>
            <div className="p-4 flex-1 overflow-y-auto space-y-1.5 scrollbar-hide" ref={scrollRef}>
                {logs.map((log, i) => (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={i}
                        className="flex gap-2"
                    >
                        <span className="text-slate-600 select-none min-w-[60px]">{getTime()}</span>
                        <span className={`
                            ${log.type === 'success' ? 'text-green-400' : ''}
                            ${log.type === 'warning' ? 'text-amber-400' : ''}
                            ${log.type === 'info' ? 'text-blue-300' : ''}
                            ${log.type === 'exe' ? 'text-purple-300' : ''}
                        `}>
                            {log.msg}
                        </span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

function StatCard({ icon: Icon, label, value, color }: any) {
    return (
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">{label}</p>
                <p className="text-xl font-bold text-slate-900">{value}</p>
            </div>
            <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
                <Icon className="w-5 h-5 text-white" />
            </div>
        </div>
    );
}

function RepoGraphVisualization() {
    return (
        <div className="relative w-full h-full bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
            {/* Ambient Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(30,41,59,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(30,41,59,0.3)_1px,transparent_1px)] bg-[size:20px_20px]" />

            {/* Central Hub */}
            <motion.div
                className="relative z-10 w-16 h-16 rounded-full bg-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.5)] flex items-center justify-center border-4 border-slate-900"
                animate={{ boxShadow: ["0 0 20px rgba(59,130,246,0.3)", "0 0 40px rgba(59,130,246,0.6)", "0 0 20px rgba(59,130,246,0.3)"] }}
                transition={{ duration: 3, repeat: Infinity }}
            >
                <Cpu className="w-8 h-8 text-white" />
            </motion.div>

            {/* Orbiting Nodes */}
            {[...Array(6)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 15 + i * 5, repeat: Infinity, ease: "linear" }}
                    style={{ width: "100%", height: "100%" }}
                >
                    <div
                        className={`absolute w-3 h-3 rounded-full border border-slate-900 shadow-md transform -translate-x-1/2 -translate-y-1/2
                            ${i % 3 === 0 ? 'bg-green-400' : 'bg-purple-400'}
                        `}
                        style={{
                            top: "50%",
                            left: "50%",
                            transform: `rotate(${i * 60}deg) translate(${80 + i * 10}px) rotate(-${i * 60}deg)`
                        }}
                    />
                    {/* Connection Line */}
                    <div
                        className="absolute top-1/2 left-1/2 h-[1px] bg-blue-500/20 origin-left"
                        style={{
                            width: `${80 + i * 10}px`,
                            transform: `rotate(${i * 60}deg)`
                        }}
                    />
                </motion.div>
            ))}

            <div className="absolute bottom-3 left-3 flex gap-2">
                <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-blue-900/30 border border-blue-500/30">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                    <span className="text-[10px] text-blue-300 font-mono">System Active</span>
                </div>
            </div>
        </div>
    );
}

function MissionControl() {
    return (
        <div className="relative w-full max-w-5xl mx-auto p-4 sm:p-6 bg-white rounded-3xl border border-slate-200 shadow-2xl shadow-blue-900/5">
            {/* Header Bar */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
                        <Activity className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-900">Kandra Mission Control</h3>
                        <p className="text-xs text-slate-500">Live Migration Status • Target: prod-main</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-xs font-bold flex items-center gap-1.5 border border-green-100">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        AUTONOMOUS MODE
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-4 lg:gap-6 h-[500px]">
                {/* Left Column: Stats & Graph */}
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
                    <StatCard
                        icon={FileCode}
                        label="Files Processed"
                        value="142 / 142"
                        color="bg-purple-500"
                    />
                    <StatCard
                        icon={Layers}
                        label="Dependencies"
                        value="24 Nodes"
                        color="bg-blue-500"
                    />
                    <StatCard
                        icon={Shield}
                        label="Test Coverage"
                        value="98.5%"
                        color="bg-green-500"
                    />
                    <div className="flex-1 min-h-[200px]">
                        <RepoGraphVisualization />
                    </div>
                </div>

                {/* Right Column: Terminal & Plan */}
                <div className="col-span-12 lg:col-span-8 flex flex-col gap-4">
                    <TerminalView />

                    {/* Progress Bar */}
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-semibold text-slate-600">Overall Migration Progress</span>
                            <span className="text-xs font-bold text-blue-600">85%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-blue-600 rounded-full"
                                initial={{ width: "0%" }}
                                animate={{ width: "85%" }}
                                transition={{ duration: 2, delay: 0.5 }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Reflection Overlay */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
        </div>
    );
}

// ============================================================================
// HERO SECTION (UPDATED)
// ============================================================================
function Hero() {
    return (
        <section className="relative min-h-screen flex flex-col justify-center pt-24 pb-16 overflow-hidden bg-slate-50/50">
            {/* Large background blurs */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 -z-20" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-100/40 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 -z-20" />

            <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full z-10">
                <div className="text-center max-w-4xl mx-auto mb-16">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full shadow-sm mb-8">
                        <Sparkles className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-slate-700">
                            The Autonomous Engineer
                        </span>
                    </div>

                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-slate-900 tracking-tight leading-[1.1] mb-8">
                        Modernize your entire stack. <br />
                        <span className="text-blue-600">Autonomously.</span>
                    </h1>

                    <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-10">
                        Stop rewriting files by hand. Give Kandra a repository, and it plans the migration, rewrites the code, and verifies the build — all on its own.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/connect"
                            className="group flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-full shadow-xl shadow-blue-500/20 hover:shadow-blue-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Deploy Kandra
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                        <button
                            className="flex items-center gap-2 px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 text-lg font-semibold rounded-full border border-slate-200 shadow-sm hover:shadow-md transition-all"
                        >
                            <Play className="w-5 h-5 text-blue-600" />
                            Watch Demo
                        </button>
                    </div>
                </div>

                {/* MISSION CONTROL VISUALIZATION */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <MissionControl />
                </motion.div>

                {/* Tech Stack Banner */}
                <div className="mt-20 pt-10 border-t border-slate-200/60">
                    <p className="text-center text-sm font-semibold text-slate-400 uppercase tracking-widest mb-8">
                        Trusted for complex migrations
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Fake logos for demo purposes - replace with real ones later */}
                        <div className="flex items-center gap-2 text-xl font-bold text-slate-700">
                            <Server className="w-6 h-6" /> Next.js
                        </div>
                        <div className="flex items-center gap-2 text-xl font-bold text-slate-700">
                            <Database className="w-6 h-6" /> Prisma
                        </div>
                        <div className="flex items-center gap-2 text-xl font-bold text-slate-700">
                            <Network className="w-6 h-6" /> Node.js
                        </div>
                        <div className="flex items-center gap-2 text-xl font-bold text-slate-700">
                            <Layers className="w-6 h-6" /> Docker
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}

// ============================================================================
// MAIN PAGE
// ============================================================================
export default function NewLandingPage() {
    return (
        <main className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100">
            <Header />
            <Hero />
        </main>
    );
}
