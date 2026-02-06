import React, { useState, useEffect } from "react";
import { IDELayout } from "./ide/IDELayout";
import { FileExplorer, FileNode } from "./ide/FileExplorer";
import { CodeEditor } from "./ide/CodeEditor";
import { Terminal } from "./ide/Terminal";
import { AgentProcess } from "./ide/AgentProcess";

interface ExecutionViewProps {
    logs: any[];
    currentPhase: any;
    isComplete: boolean;
    jobId?: string; // Add jobId for fetching file content
}

export function ExecutionView({ logs, currentPhase, isComplete, jobId }: ExecutionViewProps) {
    // === State ===
    const [files, setFiles] = useState<FileNode[]>([]);
    const [activeFile, setActiveFile] = useState<string | null>(null);
    const [fileContents, setFileContents] = useState<Record<string, string>>({});
    const [isScanning, setIsScanning] = useState(false);
    const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
    const [lastAutoSwitch, setLastAutoSwitch] = useState<number>(0);

    // === Event Processing ===
    useEffect(() => {
        // We must process the entire log history to rebuild the "Virtual File System"
        // This ensures that even if we mount late, we see the files found earlier.

        try {
            const newFiles: Record<string, FileNode> = {};
            const newTerminal: string[] = []; // Clean start
            let newActiveFile: string | null = null;
            let latestModTime = 0;

            logs.forEach((log, index) => {
                try {
                    // 1. Terminal Output
                    if (log.type === "terminal_output") {
                        // VALIDATION: Check if payload exists
                        if (!log.payload) {
                            console.warn(`⚠️ [ExecutionView] Event #${index} (terminal_output) missing payload:`, log);
                            return;
                        }

                        const output = log.payload.output || log.payload.content || log.payload.message;

                        if (output) {
                            newTerminal.push(output);
                        } else {
                            console.warn(`⚠️ [ExecutionView] Event #${index} (terminal_output) missing 'output' field:`, log.payload);
                        }
                    }

                    // 2. File Events
                    if (log.type === "file_found" || log.type === "file_created" || log.type === "file_modified") {
                        const path = log.payload?.path;
                        if (!path) return;

                        // Determine file status
                        // If it's already in our map, keep existing status unless this event updates it
                        const existing = newFiles[path];
                        let status: any = existing ? existing.status : "pending";

                        if (log.type === "file_found") status = "scanned"; // Start as scanned
                        if (log.type === "file_modified") status = "modifying";
                        if (log.type === "file_created") status = "completed";

                        newFiles[path] = {
                            id: path,
                            path: path,
                            status: status,
                            type: path.endsWith("ts") ? "ts" : "other"
                        };

                        // Update content cache
                        if (log.payload?.content) {
                            setFileContents(prev => ({ ...prev, [path]: log.payload.content }));
                        }
                    }
                } catch (innerErr) {
                    console.error(`❌ [ExecutionView] Error processing log #${index}:`, innerErr, log);
                }
            });

            // Update Scan State: If we have files, we aren't "scanning" in the empty sense anymore
            const fileList = Object.values(newFiles);
            setFiles(fileList);
            setTerminalLogs(newTerminal);

            // DEBUG: Spy on the data flow
            if (logs.length > 0) {
                const types = logs.map(l => l.type);
                const counts = types.reduce((acc, t) => { acc[t] = (acc[t] || 0) + 1; return acc; }, {} as any);
                console.log("⚡ [ExecutionView] Processing logs loop (v2):", {
                    totalLogs: logs.length,
                    counts: counts,
                    filesFound: Object.keys(newFiles).length,
                    terminalLines: newTerminal.length,
                    firstTerminalLine: newTerminal[0],
                    lastTerminalLine: newTerminal[newTerminal.length - 1]
                });
            }
        } catch (err) {
            console.error("❌ [ExecutionView] CRITICAL: Failed to process logs:", err);
        }

    }, [logs]);

    // === Helpers ===
    const handleFileClick = async (path: string) => {
        setActiveFile(path);

        // If content missing, try to fetch (if jobId available)
        // NOTE: In a real implementation we would call the API here
        // For now, we rely on the event stream cache or show placeholder
        if (!fileContents[path]) {
            // console.log("Fetching file content for:", path);
        }
    };

    // === Auto-Select First File ===
    useEffect(() => {
        if (!activeFile && files.length > 0) {
            // Auto-select the first file to avoid empty state
            setActiveFile(files[0].path);
        }
    }, [files, activeFile]);

    // === Default Content ===
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
                        path={activeFile || "welcome.ts"} // Dummy path for syntax highlighting
                        content={editorContent}
                        isScanning={isScanning}
                    />
                }
                terminal={
                    <Terminal logs={terminalLogs} />
                }
                process={
                    <AgentProcess logs={logs} />
                }
            />
        </div>
    );
}
