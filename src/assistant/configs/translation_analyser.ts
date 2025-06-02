import { z } from "zod";
import type { AssistantConfig } from "./assistant_config.js";
import dedent from "dedent";

const TranslationError = z.object({
    error: z.string(),
    correct: z.string(),
    type: z.string(),
    explanation: z.string().nullable(),
});

const TransalationErrors = z.array(TranslationError);

export const TranslationAnalysisResponseSchema = z.object({
    errors: TransalationErrors
});

export type TransalationErrors = z.infer<typeof TransalationErrors>;
export type TranslationError = z.infer<typeof TranslationError>;
export type TranslationAnalysisResponse = z.infer<typeof TranslationAnalysisResponseSchema>;

export const TRANSLATION_ANALYSER_CONFIG: AssistantConfig = {
    name: 'translation_analyser',
    model: 'o4-mini-2025-04-16',
    temperature: null,
    reasoning: { effort: "medium" },
    text: {
        format: {
            "type": "json_schema",
            "name": "translation_analysis",
            "strict": false,
            "schema": {
                "type": "object",
                "properties": {
                    "errors": {
                        "type": "array",
                        "description": "A collection of errors detected in the student translation.",
                        "items": {
                            "type": "object",
                            "properties": {
                                "error": {
                                    "type": "string",
                                    "description": "Cited error of the student's translation. Must be short and concise, ideally one word or a short phrase."
                                },
                                "correct": {
                                    "type": "string",
                                    "description": "The suggested correction for the error."
                                },
                                "type": {
                                    "type": "string",
                                    "description": "The type of error, e.g., 'grammar', 'spelling', 'punctuation'."
                                },
                                "explanation": {
                                    "type": "string",
                                    "description": "A pedagogical explanation of the error if applicable",
                                }
                            },
                            "required": [
                                "error",
                                "correct",
                                "type",
                                "explanation"
                            ],
                            "additionalProperties": false
                        }
                    }
                },
                "required": [
                    "errors"
                ],
                "additionalProperties": false
            }
        }
    },
    instructions: dedent`
    Eres un evaluador experto y exigente en traducciones de español a inglés y un tutor constructivo. Cuando recibas cuatro elementos:

        1. THEME (el tema gramatical que se está practicando)
        2. ORIGINAL (la frase en español)
        3. TRANSLATION (la versión hecha por una inteligencia artificial)
        4. STUDENT_TRANSLATION (la versión que el alumno ha escrito en inglés)

    Debes detectar los errores de la traducción del alumno.
        - Ortográficos.
        - Gramaticales.
        - Fluidez.
        - Estilo.
        - Modo.
        - Fidelidad idiomática.
        - Contexto.
        - Selección de palabras.
        - Sentido.
        - Tono.
        - Registro.
    
    Para cada error debes proporcionar:
        - Descripción clara y precisa de en qué consiste.
        - Corrección sugerida.
        - Tipo de error.
        - Explicación pedagógica de ser necesaria.

    Consideraciones adicionales:
        - No corrijas los puntos finales de las frases.
        - No corrijas el uso de mayúsculas al inicio de las frases.
        - No corrijas nombres propios.
        - Tus explicaciones siempre deben ser en español.
    `
};