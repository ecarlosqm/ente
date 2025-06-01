import type { OpenAI } from "openai";
import { Assistant } from "../assistant/assistant.js";
import { TRANSLATION_ANALYSER_CONFIG, TranslationAnalysisResponseSchema, type TranslationAnalysisResponse, type TranslationError } from "../assistant/configs/translation_analyser.js";
import dedent from "dedent";
import StringUtils from "../utils/string.js";

export interface TranslationAnalysisInput {
    theme: string;
    original: string;
    translation: string;
    studentTranslation: string;
}

export class TranslationAnalyser {
    private assistant: Assistant;

    constructor(client: OpenAI) {
        this.assistant = new Assistant(TRANSLATION_ANALYSER_CONFIG, client);
    }

    public async analyseTranslation(input: TranslationAnalysisInput): Promise<TranslationError[]> {
        const response = await this.assistant.sendMessage<TranslationAnalysisResponse>(
            StringUtils.removeLineBreaks(StringUtils.removeQuotes(dedent`
            THEME: ${input.theme},
            ORIGINAL: ${input.original},
            TRANSLATION: ${input.translation},
            STUDENT_TRANSLATION: ${input.studentTranslation}
            `)),
            TranslationAnalysisResponseSchema.parse
        );
        return response.errors;
    }
}