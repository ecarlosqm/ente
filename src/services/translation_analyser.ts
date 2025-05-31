import dedent from "dedent";
import { Assistant } from "../assistant/assistant.js";
import { TRANSLATION_ANALYSER_CONFIG, TranslationAnalysisResponse, TranslationAnalysisResponseSchema, TranslationError } from "../assistant/configs/translation_analyser.js";

export interface TranslationAnalysisInput {
    theme: string;
    original: string;
    translation: string;
    studentTranslation: string;
}

export class TranslationAnalyser {
    private assistant: Assistant;

    constructor() {
        this.assistant = new Assistant(TRANSLATION_ANALYSER_CONFIG);
    }

    public async analyseTranslation(input: TranslationAnalysisInput): Promise<TranslationError[]> {
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