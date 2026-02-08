/**
 * Helper functions for formatting agent activity status
 */

export interface ActivityUpdate {
    activity: string;
    details: Record<string, any>;
    started_at: string;
    phase_id: number;
    step: number;
}

export interface StuckWarning {
    activity: string;
    duration_seconds: number;
    last_successful_action: {
        tool: string;
        timestamp: string;
        step: number;
        phase_id: number;
    } | null;
    diagnostics: {
        likely_cause: string;
        suggestion: string;
        context?: Record<string, any>;
    };
    phase_id: number;
    step: number;
}

export function formatActivity(activity: string): string {
    const activityMap: Record<string, string> = {
        'idle': 'Idle',
        'starting_phase': 'Starting Phase',
        'waiting_for_llm': 'Thinking (waiting for AI response)',
        'executing_tool': 'Executing Command',
        'analyzing_result': 'Analyzing Result',
        'completing_phase': 'Completing Phase'
    };

    return activityMap[activity] || activity;
}

export function formatActivityDetails(details: Record<string, any>): string {
    if (details.tool) {
        return `Running: ${details.tool}`;
    }
    if (details.phase_title) {
        return details.phase_title;
    }
    return '';
}

export function formatDuration(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
}

export function formatTimeAgo(timestamp: string): string {
    const ms = Date.now() - new Date(timestamp).getTime();
    return `${formatDuration(ms)} ago`;
}
