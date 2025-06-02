import type { ReasoningEffort, Reasoning } from "openai/resources";

export interface AssistantConfig {
    name: string;
    model: string;
    instructions?: string;
    text: any;
    temperature?: number | null;
    reasoning?: { effort: ReasoningEffort; summary?: Reasoning['summary'] };
}