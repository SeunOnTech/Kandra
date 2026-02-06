import React, { useEffect, useState } from "react";
import { FileCode, Zap, Lock, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeEditorProps {
    path: string | null;
    content: string;
    isScanning: boolean;
}

export function CodeEditor({ path, content, isScanning }: CodeEditorProps) {
    // Determine language based on file extension
    const language = path?.endsWith('.ts') || path?.endsWith('.tsx') ? 'typescript' :
        path?.endsWith('.js') || path?.endsWith('.jsx') ? 'javascript' :
            path?.endsWith('.py') ? 'python' :
                path?.endsWith('.json') ? 'json' :
                    path?.endsWith('.css') ? 'css' :
                        path?.endsWith('.html') ? 'html' :
                            'text';

    if (!path) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-slate-300 bg-white">
                <FileCode className="w-16 h-16 mb-4 opacity-20" />
                <p className="text-sm font-medium">Select a file to view content</p>
                <p className="text-xs opacity-60 mt-2">Files modified by the agent will automatically appear here</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white font-mono text-sm group relative">
            {/* Editor Tab Header */}
            <div className="flex items-center justify-between px-4 h-10 border-b border-slate-100 bg-white select-none shrink-0">
                <div className="flex items-center gap-2 text-slate-700">
                    <FileCode className="w-3.5 h-3.5 text-blue-500" />
                    <span className="font-medium text-xs">{path.split('/').pop()}</span>
                    <span className="text-[10px] text-slate-400 opacity-60 ml-2">{path}</span>
                </div>
                {isScanning && (
                    <div className="flex items-center gap-1.5 text-[10px] text-blue-600 font-bold uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded-full">
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        Writing
                    </div>
                )}
            </div>

            {/* Code Content */}
            <div className="flex-1 overflow-auto custom-scrollbar relative bg-white">
                <SyntaxHighlighter
                    language={language}
                    style={oneLight}
                    customStyle={{
                        margin: 0,
                        padding: '1.5rem',
                        fontSize: '13px',
                        lineHeight: '1.5',
                        backgroundColor: 'transparent', // Let parent bg handle it
                    }}
                    showLineNumbers={true}
                    lineNumberStyle={{
                        minWidth: '2.5em',
                        paddingRight: '1em',
                        textAlign: 'right',
                        color: '#cbd5e1', // slate-300
                        userSelect: 'none',
                    }}
                    wrapLines={true}
                >
                    {content}
                </SyntaxHighlighter>

                {/* Agent Cursor (Ghost) */}
                {isScanning && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 0.8 }}
                        className="absolute bottom-8 left-16 w-2 h-5 bg-blue-500 pointer-events-none"
                    />
                )}
            </div>
        </div>
    );
}
