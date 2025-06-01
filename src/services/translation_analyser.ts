import dedent from 'dedent';
import type { OpenAI } from "openai";
import { Assistant } from "../assistant/assistant.js";
import { TRANSLATION_ANALYSER_CONFIG, TranslationAnalysisResponseSchema, type TranslationAnalysisResponse, type TranslationError } from "../assistant/configs/translation_analyser.js";

export interface TranslationAnalysisInput {
    theme: string;
    original: string;
    translation: string;
    studentTranslation: string;
}

export class TranslationAnalyser {
    private assistant: Assistant;
    private readonly isDevelopment: boolean;

    constructor(client: OpenAI) {
        this.assistant = new Assistant(TRANSLATION_ANALYSER_CONFIG, client);
        this.isDevelopment = typeof window !== 'undefined' &&
            (window.location.hostname === 'localhost' ||
                window.location.hostname === '127.0.0.1' ||
                (window as any).__DEV__ === true);
    }

    public async analyseTranslation(input: TranslationAnalysisInput): Promise<TranslationError[]> {
        if (this.isDevelopment) {
            return [
                {
                    type: 'grammar',
                    error: 'The translation is not correct',
                    correct: 'The translation is correct',
                    explanation: 'The translation is not correct',
                },
                {
                    type: 'grammar',
                    error: 'The translation is not correct',
                    correct: 'The translation is correct',
                    explanation: 'The translation is not correct',
                }
            ];
        }
        const response = await this.assistant.sendMessage<TranslationAnalysisResponse>(dedent`
            THEME: ${input.theme}
            ORIGINAL: ${input.original}
            TRANSLATION: ${input.translation}
            STUDENT_TRANSLATION: ${input.studentTranslation}
            `,
            TranslationAnalysisResponseSchema.parse
        );
        return response.errors;
    }
}