/**
 * API Client for Kandra V2 Backend
 * 
 * Clean, type-safe API functions with error handling
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// === Types ===

export interface UserInfo {
    login: string;
    avatar_url?: string;
    name?: string;
}

export interface RepoInfo {
    id: number;
    name: string;
    full_name: string;
    description?: string;
    html_url: string;
    clone_url: string;
    language?: string;
    stargazers_count: number;
    updated_at: string;
    private: boolean;
}

export interface StatusResponse {
    connected: boolean;
    user?: UserInfo;
}

export interface ReposResponse {
    repos: RepoInfo[];
    total_count: number;
}

// === API Error ===

export class ApiError extends Error {
    constructor(
        message: string,
        public status: number,
        public detail?: string
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

// === Fetch Helper ===

async function apiFetch<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${API_URL}${endpoint}`;

    const response = await fetch(url, {
        ...options,
        credentials: 'include', // Send cookies for session
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new ApiError(
            data.detail || `Request failed: ${response.status}`,
            response.status,
            data.detail
        );
    }

    return response.json();
}

// === GitHub API ===

export const github = {
    /**
     * Get GitHub OAuth authorization URL
     */
    async getAuthUrl(): Promise<{ auth_url: string; state: string }> {
        return apiFetch('/api/github/authorize');
    },

    /**
     * Complete OAuth callback
     */
    async completeCallback(code: string, state: string): Promise<{ success: boolean; user: UserInfo }> {
        return apiFetch('/api/github/callback', {
            method: 'POST',
            body: JSON.stringify({ code, state }),
        });
    },

    /**
     * Check connection status
     */
    async getStatus(): Promise<StatusResponse> {
        return apiFetch('/api/github/status');
    },

    /**
     * Get user's repositories
     */
    async getRepos(params?: {
        page?: number;
        per_page?: number;
        search?: string;
    }): Promise<ReposResponse> {
        const searchParams = new URLSearchParams();
        if (params?.page) searchParams.set('page', String(params.page));
        if (params?.per_page) searchParams.set('per_page', String(params.per_page));
        if (params?.search) searchParams.set('search', params.search);

        const query = searchParams.toString();
        return apiFetch(`/api/github/repos${query ? `?${query}` : ''}`);
    },

    /**
     * Disconnect from GitHub
     */
    async disconnect(): Promise<{ success: boolean }> {
        return apiFetch('/api/github/disconnect', { method: 'POST' });
    },
};

// === Health API ===

export const health = {
    async check(): Promise<{ status: string; service: string; version: string; redis: string }> {
        return apiFetch('/health');
    },
};

// === Job Types ===

export interface CreateJobRequest {
    repo_url: string;
    repo_name: string;
    target_stack: string;
    workspace_path: string;
}

export interface JobInfo {
    id: string;
    status: string;
    repo_url: string;
    repo_name: string;
    target_stack: string;
    workspace_path?: string;
    current_iteration: number;
    error?: string;
    created_at: string;
    updated_at: string;
}

export interface JobEvent {
    id: string;
    event_type: string;
    payload: Record<string, unknown>;
    created_at: string;
}

// === Jobs API ===

export const jobs = {
    /**
     * Create a new migration job
     */
    async create(data: CreateJobRequest): Promise<JobInfo> {
        return apiFetch('/api/jobs', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    /**
     * Get job by ID
     */
    async get(jobId: string): Promise<JobInfo> {
        return apiFetch(`/api/jobs/${jobId}`);
    },

    /**
     * Get job events (for catching up after reconnect)
     */
    async getEvents(jobId: string, sinceId?: string): Promise<JobEvent[]> {
        const params = sinceId ? `?since_id=${sinceId}` : '';
        return apiFetch(`/api/jobs/${jobId}/events${params}`);
    },

    /**
     * Start planning phase for a job
     */
    async startPlanning(jobId: string, analysisData: Record<string, unknown>): Promise<{ status: string; job_id: string; message: string }> {
        return apiFetch(`/api/jobs/${jobId}/start-planning`, {
            method: 'POST',
            body: JSON.stringify({ analysis_data: analysisData }),
        });
    },

    /**
     * Approve the migration plan and start execution
     */
    async approve(jobId: string): Promise<{ status: string; job_id: string; message: string }> {
        return apiFetch(`/api/jobs/${jobId}/approve`, {
            method: 'POST',
        });
    },

    async reject(jobId: string, feedback?: string): Promise<{ status: string; job_id: string; message: string }> {
        return apiFetch(`/api/jobs/${jobId}/reject`, {
            method: 'POST',
            body: JSON.stringify({ feedback }),
        });
    },

    /**
     * Get the audit certification report
     */
    async getAuditReport(jobId: string): Promise<any> {
        return apiFetch(`/api/jobs/${jobId}/audit/report`);
    },

    /**
     * Submit the certified PR
     */
    async submitAuditPR(jobId: string, repoUrl: string, branchName: string): Promise<{ success: boolean; pr_url: string }> {
        return apiFetch(`/api/jobs/${jobId}/audit/pr`, {
            method: 'POST',
            body: JSON.stringify({ repo_url: repoUrl, branch_name: branchName }),
        });
    },
};

// === Default Export ===

export const api = {
    github,
    health,
    jobs,
};

export default api;
