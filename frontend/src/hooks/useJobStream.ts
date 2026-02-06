/**
 * React hook for streaming job events via WebSocket.
 * Handles connection, reconnection, heartbeats, and event dispatching.
 */

import { useEffect, useRef, useState, useCallback } from 'react';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000';

export interface JobEvent {
    type: string;
    job_id?: string;
    status?: string;
    payload?: Record<string, unknown>;
    [key: string]: unknown;
}

export interface UseJobStreamOptions {
    onEvent?: (event: JobEvent) => void;
    onStatusChange?: (status: string) => void;
    onError?: (error: Error) => void;
    autoReconnect?: boolean;
    reconnectDelay?: number;
}

export interface UseJobStreamResult {
    connected: boolean;
    events: JobEvent[];
    lastEvent: JobEvent | null;
    status: string | null;
    error: Error | null;
}

export function useJobStream(
    jobId: string | null,
    options: UseJobStreamOptions = {}
): UseJobStreamResult {
    const {
        onEvent,
        onStatusChange,
        onError,
        autoReconnect = true,
        reconnectDelay = 3000,
    } = options;

    const [connected, setConnected] = useState(false);
    const [events, setEvents] = useState<JobEvent[]>([]);
    const [lastEvent, setLastEvent] = useState<JobEvent | null>(null);
    const [status, setStatus] = useState<string | null>(null);
    const [error, setError] = useState<Error | null>(null);

    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Use refs for callbacks to avoid reconnection loops
    const onEventRef = useRef(onEvent);
    const onStatusChangeRef = useRef(onStatusChange);
    const onErrorRef = useRef(onError);
    const statusRef = useRef(status);

    // Keep refs updated
    useEffect(() => {
        onEventRef.current = onEvent;
        onStatusChangeRef.current = onStatusChange;
        onErrorRef.current = onError;
    }, [onEvent, onStatusChange, onError]);

    useEffect(() => {
        statusRef.current = status;
    }, [status]);

    // Connect when jobId changes - only depends on jobId, autoReconnect, reconnectDelay
    useEffect(() => {
        if (!jobId) return;

        const cleanup = () => {
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
                reconnectTimeoutRef.current = null;
            }
            if (heartbeatIntervalRef.current) {
                clearInterval(heartbeatIntervalRef.current);
                heartbeatIntervalRef.current = null;
            }
            if (wsRef.current) {
                wsRef.current.close();
                wsRef.current = null;
            }
        };

        const connect = () => {
            cleanup();

            console.log(`[WS] Connecting to job ${jobId}...`);
            const ws = new WebSocket(`${WS_URL}/api/jobs/${jobId}/stream`);
            wsRef.current = ws;

            ws.onopen = () => {
                console.log(`[WS] Connected to job ${jobId}`);
                setConnected(true);
                setError(null);

                // Start heartbeat
                heartbeatIntervalRef.current = setInterval(() => {
                    if (ws.readyState === WebSocket.OPEN) {
                        ws.send(JSON.stringify({ type: 'ping' }));
                    }
                }, 25000);
            };

            ws.onmessage = (event) => {
                try {
                    const data: JobEvent = JSON.parse(event.data);

                    // Skip internal messages
                    if (data.type === 'pong' || data.type === 'heartbeat') return;

                    console.log(`[WS] Event:`, data.type, data.payload ? '(has payload)' : '');

                    // DEBUG: Spy on terminal output
                    if (data.type === 'terminal_output') {
                        console.log('⚡ [WS-HOOK] Terminal Output RX:', data);
                    }

                    // Track event
                    setLastEvent(data);
                    setEvents((prev) => [...prev, data]);

                    // Handle status changes
                    if (data.type === 'status_changed' && data.status) {
                        setStatus(data.status);
                        onStatusChangeRef.current?.(data.status);
                    }

                    // Callback
                    onEventRef.current?.(data);
                } catch (e) {
                    console.error('[WS] Failed to parse message:', e);
                }
            };

            ws.onerror = (event) => {
                console.error('[WS] Error:', event);
                const err = new Error('WebSocket connection error');
                setError(err);
                onErrorRef.current?.(err);
            };

            ws.onclose = (event) => {
                console.log(`[WS] Disconnected from job ${jobId}, code: ${event.code}`);
                setConnected(false);

                // Clear heartbeat
                if (heartbeatIntervalRef.current) {
                    clearInterval(heartbeatIntervalRef.current);
                    heartbeatIntervalRef.current = null;
                }

                // Auto reconnect if enabled and job is still active
                const currentStatus = statusRef.current;
                if (autoReconnect && currentStatus !== 'COMPLETED' && currentStatus !== 'FAILED') {
                    console.log(`[WS] Will reconnect in ${reconnectDelay}ms...`);
                    reconnectTimeoutRef.current = setTimeout(() => {
                        console.log('[WS] Attempting reconnect...');
                        connect();
                    }, reconnectDelay);
                }
            };
        };

        connect();
        return cleanup;
    }, [jobId, autoReconnect, reconnectDelay]);

    return {
        connected,
        events,
        lastEvent,
        status,
        error,
    };
}

export default useJobStream;

