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

export interface Transformation {
    source_stack: string;
    target_stack: string;
    strategy: string;
    package_manager?: string;  // Dynamically discovered from research
    test_framework?: string;   // Dynamically discovered from research
    build_tool?: string;       // Dynamically discovered from research
}

export interface ImpactedFile {
    source: string;
    target: string;
    reason: string;
}

export interface PhaseVerification {
    test_commands: string[];
    success_criteria: string;
}

export interface PlanPhase {
    id: number;
    title: string;
    description: string;
    instructions: string[];
    tasks: string[];
    files_impacted: ImpactedFile[];
    verification: PhaseVerification;
}

export interface Dependency {
    name: string;
    reason: string;
}

export interface Dependencies {
    add: Dependency[];
    remove: Dependency[];
}

export interface Source {
    uri: string;
    title: string;
}

export interface ResearchSummary {
    sources_consulted: Source[];
    search_queries: string[];
}

export interface MigrationPlan {
    research_summary?: ResearchSummary;  // NEW: Research metadata from grounding
    summary: PlanSummary;
    transformation: Transformation;
    phases: PlanPhase[];
    dependencies: Dependencies;
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
