import type { OpenAI } from "openai";
import { Assistant } from "../assistant/assistant.js";
import {
    type GenerateSentencesResponse,
    GenerateSentencesResponseSchema,
    SENTENCE_GENERATOR_CONFIG
} from "../assistant/configs/sentence_generator.js";
import type { Sentence } from "../assistant/configs/sentence_generator.js";

export class SentenceGenerator {
    private assistant: Assistant;
    private readonly isDevelopment: boolean;

    constructor(client: OpenAI) {
        this.assistant = new Assistant(SENTENCE_GENERATOR_CONFIG, client);
        this.isDevelopment = typeof window !== 'undefined' && 
            (window.location.hostname === 'localhost' || 
             window.location.hostname === '127.0.0.1' ||
             (window as any).__DEV__ === true);
    }

    public async generateSentences(theme: string): Promise<Sentence[]> {
        if (this.isDevelopment) {
            return [
                {
                    original: 'The cat is sleeping',
                    translation: 'El gato está durmiendo',
                    context: 'El gato está durmiendo en el sofá'
                },
                {
                    original: 'The cat is sleeping',
                    translation: 'El gato está durmiendo',
                    context: 'El gato está durmiendo en el sofá'
                },
            ];
        }
        const response = await this.assistant.sendMessage<GenerateSentencesResponse>(
            `TEMA_GRAMATICAL: ${theme}`,
            GenerateSentencesResponseSchema.parse
        );
        return response.sentences;
    }
}