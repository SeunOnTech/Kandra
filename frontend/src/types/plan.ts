/**
 * TypeScript types for the structured migration plan JSON.
 * These match the JSON schema output from the planner agent.
 */

export interface PlanSummary {
    title: string;
    description: string;
    confidence: number;
    estimated_duration: string;
    risk_level: "low" | "medium" | "high";
}

export interface PlanStats {
    files_to_modify?: number;
    files_to_create?: number;
    files_to_delete?: number;
    dependencies_to_add?: number;
    dependencies_to_remove?: number;
}

export interface StackInfo {
    stack: string;
    language: string;
    key_features: string[];
}

export interface Transformation {
    source: StackInfo;
    target: StackInfo;
}

export interface PlanPhase {
    id: number;
    title: string;
    description: string;
    tasks: string[];
    files_affected: string[];
}

export interface FileChange {
    path: string;
    action: "create" | "modify" | "delete" | "transform";
    new_path?: string;
    reason: string;
}

export interface Dependency {
    name: string;
    reason: string;
}

export interface Dependencies {
    add: Dependency[];
    remove: Dependency[];
}

export interface Verification {
    auto_checks: string[];
    success_criteria: string;
}

export interface MigrationPlan {
    summary: PlanSummary;
    stats: PlanStats;
    transformation: Transformation;
    phases: PlanPhase[];
    file_changes: FileChange[];
    dependencies: Dependencies;
    verification: Verification;
}

/**
 * Repair common JSON syntax errors from AI output.
 */
function repairJSON(jsonString: string): string {
    let fixed = jsonString;

    // Remove trailing commas before closing braces/brackets
    fixed = fixed.replace(/,(\s*[}\]])/g, "$1");

    // Remove any control characters except newlines and tabs
    fixed = fixed.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "");

    return fixed;
}

/**
 * Try to parse a plan string as JSON.
 * Returns null if parsing fails.
 */
export function tryParsePlan(planString: string): MigrationPlan | null {
    try {
        let cleaned = planString.trim();

        console.log("[tryParsePlan] Input length:", cleaned.length);

        // Remove markdown code blocks
        cleaned = cleaned.replace(/^```json\s*\n?/i, "");
        cleaned = cleaned.replace(/\n?```\s*$/i, "");
        cleaned = cleaned.replace(/^```\s*\n?/i, "");
        cleaned = cleaned.replace(/\s*```$/i, "");
        cleaned = cleaned.trim();

        // Must start and end with braces
        if (!cleaned.startsWith("{") || !cleaned.endsWith("}")) {
            console.log("[tryParsePlan] Not valid JSON structure");
            return null;
        }

        // Try to repair common JSON issues
        const repaired = repairJSON(cleaned);

        console.log("[tryParsePlan] Attempting parse after repair...");

        let parsed;
        try {
            parsed = JSON.parse(repaired);
        } catch (firstError) {
            console.log("[tryParsePlan] Repaired parse failed:", firstError);
            // Try original if repair didn't help
            parsed = JSON.parse(cleaned);
        }

        // Basic validation
        if (!parsed.summary || !parsed.phases) {
            console.log("[tryParsePlan] Missing required fields");
            return null;
        }

        console.log("[tryParsePlan] SUCCESS! Parsed", parsed.phases?.length, "phases");
        return parsed as MigrationPlan;
    } catch (e) {
        console.log("[tryParsePlan] Parse error:", e);
        return null;
    }
}
