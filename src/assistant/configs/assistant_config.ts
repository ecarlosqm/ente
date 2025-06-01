export interface AssistantConfig {
    name: string;
    model: string;
    instructions?: string;
    text: any;
    temperature?: number | null;
}