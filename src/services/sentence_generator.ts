import type { OpenAI } from "openai";
import { Assistant } from "../assistant/assistant.js";
import {
    type GenerateSentencesResponse,
    GenerateSentencesResponseSchema,
    SENTENCE_GENERATOR_CONFIG
} from "../assistant/configs/sentence_generator.js";
import type { Sentence } from "../assistant/configs/sentence_generator.js";
import dedent from "dedent";
import StringUtils from "../utils/string.js";

export class SentenceGenerator {
    private assistant: Assistant;

    constructor(client: OpenAI) {
        this.assistant = new Assistant(SENTENCE_GENERATOR_CONFIG, client);
    }

    public async generateSentences(theme: string, requiredWords: string[] = []): Promise<Sentence[]> {
        const response = await this.assistant.sendMessage<GenerateSentencesResponse>(
            StringUtils.removeLineBreaks(StringUtils.removeQuotes(dedent`
            TEMA_GRAMATICAL: ${theme}. 
            PALABRAS_SUGERIDAS: [${requiredWords.join(', ')}]
            `)),
            GenerateSentencesResponseSchema.parse
        );
        return response.sentences;
    }
}