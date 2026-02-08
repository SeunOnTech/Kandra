import React, { useState, useEffect, useMemo } from "react";
import { IDELayout } from "./ide/IDELayout";
import { FileExplorer, FileNode } from "./ide/FileExplorer";
import { CodeEditor } from "./ide/CodeEditor";
import { Terminal } from "./ide/Terminal";
import { AgentProcess } from "./ide/AgentProcess";

interface ExecutionViewProps {
    logs: any[];
    currentPhase: any;
    isComplete: boolean;
    jobId?: string;
}

export function ExecutionView({ logs, currentPhase, isComplete, jobId }: ExecutionViewProps) {
    // === State ===
    const [activeFile, setActiveFile] = useState<string | null>(null);
    const [fileContents, setFileContents] = useState<Record<string, string>>({});
    const [isScanning, setIsScanning] = useState(false);
    const [currentActivity, setCurrentActivity] = useState<any | null>(null);
    const [stuckWarning, setStuckWarning] = useState<any | null>(null);

    // === Derived State (Optimized) ===
    const { files, terminalLogs, processedContents } = useMemo(() => {
        const newFiles: Record<string, FileNode> = {};
        const newTerminal: string[] = [];
        const seenTerminalIds = new Set();
        const contentCache: Record<string, string> = { ...fileContents };

        logs.forEach((log) => {
            // 1. Terminal Output
            if (log.type === "terminal_output") {
                const id = log.id || `${log.type}-${log.timestamp}-${JSON.stringify(log.payload)}`;
                if (!seenTerminalIds.has(id)) {
                    const output = log.payload?.output || log.payload?.content || log.payload?.message;
                    if (output) {
                        newTerminal.push(String(output));
                        seenTerminalIds.add(id);
                    }
                }
            }

            // 2. File Events
            if (log.type === "file_found" || log.type === "file_created" || log.type === "file_modified") {
                const path = log.payload?.path;
                if (path) {
                    const existing = newFiles[path];
                    const status = log.type === "file_found" ? "scanned" :
                        log.type === "file_modified" ? "modifying" :
                            log.type === "file_created" ? "completed" :
                                (existing ? existing.status : "pending");

                    newFiles[path] = {
                        id: path,
                        path: path,
                        status: status,
                        type: path.endsWith("ts") ? "ts" : "other"
                    };

                    if (log.payload?.content && contentCache[path] !== log.payload.content) {
                        contentCache[path] = log.payload.content;
                    }
                }
            }
        });

        return {
            files: Object.values(newFiles),
            terminalLogs: newTerminal,
            processedContents: contentCache
        };
    }, [logs]);

    // Track activity updates and stuck warnings
    useEffect(() => {
        const activityLogs = logs.filter(log => log.type === 'activity_update');
        if (activityLogs.length > 0) {
            setCurrentActivity(activityLogs[activityLogs.length - 1].payload);
        }

        const stuckLogs = logs.filter(log => log.type === 'stuck_warning');
        if (stuckLogs.length > 0) {
            setStuckWarning(stuckLogs[stuckLogs.length - 1].payload);
        }
    }, [logs]);

    // Update local content cache only when new content arrives
    useEffect(() => {
        if (processedContents && Object.keys(processedContents).length > Object.keys(fileContents).length) {
            setFileContents(processedContents);
        }
    }, [processedContents, fileContents]);

    // === Helpers ===
    const handleFileClick = async (path: string) => {
        setActiveFile(path);
    };

    // === Auto-Select First File ===
    useEffect(() => {
        if (!activeFile && files.length > 0) {
            setActiveFile(files[0].path);
        }
    }, [files, activeFile]);

    const defaultContent = `// ⚡ Kandra Execution Environment
// Waiting for file events...
//
// Your migrated code will appear here automatically.
// Select a file from the explorer to view its content.`;

    const editorContent = activeFile
        ? (fileContents[activeFile] || "// Loading content...")
        : defaultContent;

    return (
        <div className="h-full w-full bg-white">
            <IDELayout
                sidebar={
                    <FileExplorer
                        files={files}
                        activeFile={activeFile}
                        onFileClick={handleFileClick}
                    />
                }
                editor={
                    <CodeEditor
                        path={activeFile || "welcome.ts"}
                        content={editorContent}
                        isScanning={isScanning}
                    />
                }
                terminal={
                    <Terminal logs={terminalLogs} />
                }
                process={
                    <AgentProcess
                        logs={logs}
                        currentActivity={currentActivity}
                        stuckWarning={stuckWarning}
                    />
                }
            />
        </div>
    );
}
