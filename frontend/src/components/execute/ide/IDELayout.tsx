import React from "react";

interface IDELayoutProps {
    sidebar: React.ReactNode;
    editor: React.ReactNode;
    terminal: React.ReactNode;
    process: React.ReactNode;
}

export function IDELayout({ sidebar, editor, terminal, process }: IDELayoutProps) {
    return (
        <div className="flex h-full w-full overflow-hidden bg-white">
            {/* Left: Project Explorer (Fixed width) */}
            <div className="w-[280px] shrink-0 flex flex-col h-full overflow-hidden relative z-10">
                {sidebar}
            </div>

            {/* Center: Work Area (Fluid) */}
            <div className="flex-1 flex flex-col min-w-0 h-full border-r border-slate-200">
                {/* Editor Area (Top) */}
                <div className="flex-1 overflow-hidden relative">
                    {editor}
                </div>

                {/* Terminal Area (Bottom, Fixed/Resizable Height) */}
                <div className="h-[300px] shrink-0 overflow-hidden relative z-20 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
                    {terminal}
                </div>
            </div>

            {/* Right: Agent Brain (Fixed width) */}
            <div className="w-[380px] shrink-0 flex flex-col h-full bg-slate-50 relative z-30">
                {process}
            </div>
        </div>
    );
}
