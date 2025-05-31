import { AutoParseableTextFormat } from "openai/lib/parser.js";

export interface AssistantConfig {
    name: string;
    model: string;
    instructions?: string;
    text: any;
}