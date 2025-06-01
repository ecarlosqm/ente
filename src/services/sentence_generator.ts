import type { OpenAI } from "openai";
import { Assistant } from "../assistant/assistant.js";
import {
    type GenerateSentencesResponse,
    GenerateSentencesResponseSchema,
    SENTENCE_GENERATOR_CONFIG
} from "../assistant/configs/sentence_generator.js";
import type { Sentence } from "../assistant/configs/sentence_generator.js";
import dedent from "dedent";

export class SentenceGenerator {
    private assistant: Assistant;

    constructor(client: OpenAI) {
        this.assistant = new Assistant(SENTENCE_GENERATOR_CONFIG, client);
    }

    public async generateSentences(theme: string, requiredWords: string[] = []): Promise<Sentence[]> {
        const requiredWordsText = requiredWords.length > 0 
            ? `PALABRAS_SEMILLA: ${requiredWords.join(', ')}`
            : '';
            
        const response = await this.assistant.sendMessage<GenerateSentencesResponse>(
            dedent`
            TEMA_GRAMATICAL: ${theme}
            ${requiredWordsText}
            `,
            GenerateSentencesResponseSchema.parse
        );
        return response.sentences;
    }
}