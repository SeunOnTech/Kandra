"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

// Initialize mermaid with a nice theme
mermaid.initialize({
    startOnLoad: false,
    theme: "default",
    securityLevel: "loose",
    fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif",
    themeVariables: {
        primaryColor: "#6366f1",
        primaryTextColor: "#1f2937",
        primaryBorderColor: "#a5b4fc",
        lineColor: "#6366f1",
        secondaryColor: "#f0fdf4",
        tertiaryColor: "#f3f4f6",
    },
    flowchart: {
        curve: "basis",
        padding: 20,
        htmlLabels: true,
    },
});

interface MermaidDiagramProps {
    chart: string;
    className?: string;
}

// Clean up common AI-generated Mermaid syntax issues
function sanitizeMermaidCode(code: string): string {
    let cleaned = code.trim();

    // Remove markdown code fence if present
    cleaned = cleaned.replace(/^```mermaid\s*/i, "").replace(/```\s*$/, "");

    // Fix common issues
    cleaned = cleaned
        // Remove any HTML-like tags that might break
        .replace(/<br\s*\/?>/gi, "\\n")
        // Fix arrow syntax variations  
        .replace(/-->/g, " --> ")
        .replace(/<--/g, " <-- ")
        // Clean up extra whitespace
        .replace(/\n\s*\n/g, "\n")
        .trim();

    return cleaned;
}

export function MermaidDiagram({ chart, className = "" }: MermaidDiagramProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [svg, setSvg] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [showCode, setShowCode] = useState(false);

    useEffect(() => {
        const renderDiagram = async () => {
            if (!chart.trim()) return;

            try {
                const cleanedChart = sanitizeMermaidCode(chart);

                // Generate unique ID for this diagram
                const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;

                // Validate first
                const isValid = await mermaid.parse(cleanedChart).catch(() => false);
                if (!isValid) {
                    throw new Error("Invalid diagram syntax");
                }

                // Render the diagram
                const { svg: renderedSvg } = await mermaid.render(id, cleanedChart);
                setSvg(renderedSvg);
                setError(null);
            } catch (err) {
                console.warn("Mermaid render warning:", err);
                setError("diagram");
            }
        };

        renderDiagram();
    }, [chart]);

    // Show as code block if there's an error
    if (error || showCode) {
        return (
            <div className={`my-5 rounded-xl overflow-hidden border border-gray-200 bg-gray-900 shadow-sm ${className}`}>
                <div className="flex items-center justify-between px-4 py-2.5 bg-gray-800 border-b border-gray-700">
                    <div className="flex items-center gap-2">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <div className="w-3 h-3 rounded-full bg-amber-500" />
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                        </div>
                        <span className="text-xs text-gray-400 font-medium ml-2">
                            {error ? "mermaid (diagram preview unavailable)" : "mermaid"}
                        </span>
                    </div>
                    {!error && (
                        <button
                            onClick={() => setShowCode(false)}
                            className="text-xs text-blue-400 hover:text-blue-300"
                        >
                            Show diagram
                        </button>
                    )}
                </div>
                <div className="p-4 overflow-x-auto text-sm font-mono text-gray-300 whitespace-pre">
                    {chart.trim()}
                </div>
            </div>
        );
    }

    return (
        <div className={`my-6 ${className}`}>
            <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-6 overflow-x-auto">
                <div
                    ref={containerRef}
                    dangerouslySetInnerHTML={{ __html: svg }}
                    className="flex justify-center"
                />
            </div>
            <button
                onClick={() => setShowCode(true)}
                className="mt-2 text-xs text-gray-400 hover:text-gray-600"
            >
                View source
            </button>
        </div>
    );
}

export default MermaidDiagram;
